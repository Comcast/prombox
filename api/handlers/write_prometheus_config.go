/*
 * Copyright 2020 Comcast Cable Communications Management, LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/Comcast/prombox/api/prometheus"
	"github.com/go-kit/log"
)

type RequestBody struct {
	PrometheusConfig string `json:"prometheus_config"`
}

type ResponseBody struct {
	Status      int    `json:"status,omitempty"`
	Message     string `json:"message,omitempty"`
	Error       string `json:"error,omitempty"`
	SavedConfig string `json:"saved_config,omitempty"`
}

//WritePrometheusConfigHandler writes prometheus config
func WritePrometheusConfigHandler(promClient prometheus.Client, logger log.Logger) http.Handler {
	return http.HandlerFunc(WritePrometheusConfigHandlerFunc(promClient, logger))
}

//WritePrometheusConfigHandlerFunc writes prometheus config
func WritePrometheusConfigHandlerFunc(promClient prometheus.Client, logger log.Logger) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {

		var input RequestBody
		err := json.NewDecoder(r.Body).Decode(&input)
		if err != nil {
			logger.Log("msg", "error decoding request body", "err", err.Error())

			w.WriteHeader(http.StatusBadRequest)
			w.Header().Set("Content-Type", "application/json; charset=UTF-8")
			json.NewEncoder(w).Encode(ResponseBody{
				Message: "error decoding request body",
				Error:   err.Error(),
			})
			return
		}

		originalYaml := getOriginalConfig(promClient, logger)

		writtenContent, err := prometheus.WriteFile(promClient.Info.ConfigFile, input.PrometheusConfig, logger)
		if err != nil {
			logger.Log("msg", "error writing file", "err", err.Error())

			w.WriteHeader(http.StatusBadRequest)
			w.Header().Set("Content-Type", "application/json; charset=UTF-8")
			json.NewEncoder(w).Encode(ResponseBody{
				Message: "error writing file",
				Error:   err.Error(),
			})
			return
		}

		respBody, status, err := promClient.Reload()
		if err != nil {
			logger.Log("msg", "error reloading prometheus", "err", err.Error())
			w.WriteHeader(http.StatusInternalServerError)
			w.Header().Set("Content-Type", "application/json; charset=UTF-8")
			json.NewEncoder(w).Encode(ResponseBody{
				Message: "error reloading prometheus",
				Error:   err.Error(),
			})
			defer saveOriginalConfig(originalYaml, promClient, logger)
			return
		}
		if status != http.StatusOK {
			logger.Log("msg", "error reloading prometheus", "status", status, "response", *respBody)
			w.WriteHeader(http.StatusInternalServerError)
			w.Header().Set("Content-Type", "application/json; charset=UTF-8")
			json.NewEncoder(w).Encode(ResponseBody{
				Status:  status,
				Message: "error reloading prometheus",
				Error:   *respBody,
			})
			defer saveOriginalConfig(originalYaml, promClient, logger)
			return
		}

		w.WriteHeader(http.StatusOK)
		w.Header().Set("Content-Type", "application/json; charset=UTF-8")
		json.NewEncoder(w).Encode(ResponseBody{
			Message:     "success",
			SavedConfig: writtenContent,
		})
	}
}

func getOriginalConfig(promClient prometheus.Client, logger log.Logger) string {
	respStr, status, err := promClient.Get("/api/v1/status/config")
	if err != nil {
		logger.Log("msg", "error fetching original configuration", "status", status, "err", err.Error())
		return ""
	}
	if status != http.StatusOK {
		logger.Log("msg", "error fetching original configuration", "status", status, "err", respStr)
		return ""
	}

	var resp struct {
		Status string `json:"status"`
		Data   struct {
			Yaml string `json:"yaml"`
		} `json:"data"`
	}
	if err := json.Unmarshal([]byte(*respStr), &resp); err != nil {
		logger.Log("msg", "error decoding response string", "err", err.Error())
		return ""
	}

	return resp.Data.Yaml
}

func saveOriginalConfig(originalYaml string, promClient prometheus.Client, logger log.Logger) {
	if originalYaml == "" {
		logger.Log("msg", "skip saving original configuration", "err", "original configuration is empty")
		return
	}
	if _, err := prometheus.WriteFile(promClient.Info.ConfigFile, originalYaml, logger); err != nil {
		logger.Log("msg", "error writing file with original configuration", "err", err.Error())
		return
	}
	if respBody, status, err := promClient.Reload(); err != nil {
		logger.Log("msg", "error reloading prometheus with original configuration", "err", err.Error(), "status", status, "response", respBody)
	}
}
