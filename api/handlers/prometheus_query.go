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

	"github.com/Comcast/prombox/api/prometheus"
)

//GetPrometheusQueryHandlerFunc is the prometheus query handler
func GetPrometheusQueryHandlerFunc(promClient prometheus.Client) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		query := r.FormValue("query")

		result, status, err := promClient.GetQuery(query)
		w.WriteHeader(status)
		if err != nil {
			fmt.Fprint(w, err.Error())
			return
		}

		w.Header().Set("Content-Type", "application/json; charset=UTF-8")
		fmt.Fprint(w, *result)
	}
}

//GetPrometheusQueryHandler is the prometheus query handler
func GetPrometheusQueryHandler(promClient prometheus.Client) http.Handler {
	return http.HandlerFunc(GetPrometheusQueryHandlerFunc(promClient))
}
