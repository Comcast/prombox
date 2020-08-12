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

	"github.com/Comcast/prombox/api/config"
)

//GetPromboxInfoHandlerFunc gets prometheus info
func GetPromboxInfoHandlerFunc(promInfo config.PrometheusInfo) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Header().Set("Content-Type", "application/json; charset=UTF-8")
		json.NewEncoder(w).Encode(promInfo)
	}
}

//GetPromboxInfoHandler gets prometheus info
func GetPromboxInfoHandler(promInfo config.PrometheusInfo) http.Handler {
	return http.HandlerFunc(GetPromboxInfoHandlerFunc(promInfo))
}
