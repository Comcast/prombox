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
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/Comcast/prombox/api/prometheus"
	"github.com/prometheus/prometheus/config"
)

//ConfigurationInput models config input
type ConfigurationInput struct {
	Content string `json:"content"`
}

//WritePrometheusConfigHandlerFunc writes prometheus config
func WritePrometheusConfigHandlerFunc(promClient prometheus.Client) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {

		configInput := ConfigurationInput{}
		err := json.NewDecoder(r.Body).Decode(&configInput)
		if err != nil {
			errMsg := fmt.Sprintf("error decoding request body: %s", err.Error())
			log.Println(errMsg)
			w.WriteHeader(http.StatusBadRequest)
			w.Header().Set("Content-Type", "plain/text; charset=UTF-8")
			fmt.Fprint(w, errMsg)
			return
		}

		validatedConfig, err := config.Load(strings.TrimLeft(configInput.Content, " "))
		if err != nil {
			errMsg := fmt.Sprintf("error validating prometheus configuration: %s", err.Error())
			log.Println(errMsg)
			w.WriteHeader(http.StatusBadRequest)
			w.Header().Set("Content-Type", "plain/text; charset=UTF-8")
			fmt.Fprint(w, errMsg)
			return
		}

		writtenContent, err := prometheus.WriteFile(promClient.Info.ConfigFile, validatedConfig.String())
		if err != nil {
			errMsg := fmt.Sprintf("error writting file: %s", err.Error())
			log.Println(errMsg)
			w.WriteHeader(http.StatusBadRequest)
			w.Header().Set("Content-Type", "plain/text; charset=UTF-8")
			fmt.Fprint(w, errMsg)
			return
		}

		_, status, err := promClient.Reload()
		if err != nil {
			errMsg := fmt.Sprintf("error reloading prometheus: %s", err.Error())
			log.Println(errMsg)
			w.WriteHeader(http.StatusInternalServerError)
			w.Header().Set("Content-Type", "plain/text; charset=UTF-8")
			fmt.Fprint(w, errMsg)
			return
		}
		if status != http.StatusOK {
			errMsg := fmt.Sprintf("error reloading prometheus: response status %d", status)
			log.Println(errMsg)
			w.WriteHeader(http.StatusInternalServerError)
			w.Header().Set("Content-Type", "plain/text; charset=UTF-8")
			fmt.Fprint(w, errMsg)
			return
		}

		w.WriteHeader(http.StatusOK)
		w.Header().Set("Content-Type", "application/json; charset=UTF-8")
		fmt.Fprint(w, `{"saved": "`+writtenContent+`"}`)
	}
}

//WritePrometheusConfigHandler writes prometheus config
func WritePrometheusConfigHandler(promClient prometheus.Client) http.Handler {
	return http.HandlerFunc(WritePrometheusConfigHandlerFunc(promClient))
}
