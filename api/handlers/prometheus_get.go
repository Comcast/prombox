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
	"fmt"
	"net/http"

	"github.com/go-kit/log"

	"github.com/Comcast/prombox/api/prometheus"
)

//GetPrometheusHandlerFunc is the prometheus handler
func GetPrometheusHandlerFunc(promClient prometheus.Client, path string, logger log.Logger) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {

		result, status, err := promClient.Get(path)
		if err != nil {
			logger.Log("err", err.Error(), "path", path)
			w.WriteHeader(http.StatusInternalServerError)
			w.Header().Set("Content-Type", "plain/text; charset=UTF-8")
			fmt.Fprint(w, fmt.Sprintf("Error executing GET %s: %s", path, err.Error()))
			return
		}
		w.WriteHeader(status)
		w.Header().Set("Content-Type", "application/json; charset=UTF-8")
		fmt.Fprint(w, *result)
	}
}

//GetPrometheusHandler is the prometheus handler
func GetPrometheusHandler(promClient prometheus.Client, path string, logger log.Logger) http.Handler {
	return http.HandlerFunc(GetPrometheusHandlerFunc(promClient, path, logger))
}
