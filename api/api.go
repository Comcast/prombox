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

package api

import (
	"net/http"
	"time"

	"github.com/go-kit/log"
	"github.com/gorilla/mux"

	"github.com/Comcast/prombox/api/config"
	"github.com/Comcast/prombox/api/handlers"
	"github.com/Comcast/prombox/api/prometheus"
	"github.com/Comcast/prombox/api/version"
)

//NewAPI creates a new API
func NewAPI(version version.BuildInfo, conf config.Config, logger log.Logger) http.Handler {

	httpClient := &http.Client{
		Timeout: 60 * time.Second,
	}
	prometheusClient := prometheus.Client{
		Info:       conf.Prometheus,
		HTTPClient: httpClient,
		Logger:     logger,
	}

	router := mux.NewRouter().StrictSlash(true)

	router.Path("/api/health").Methods(http.MethodGet, http.MethodOptions).Handler(
		handlers.CorsHandler(*conf.Cors,
			handlers.AccessLogHandler(log.With(logger, "handler", "Healthcheck"),
				handlers.HealthCheckHandler())))

	router.Path("/api/version").Methods(http.MethodGet, http.MethodOptions).Handler(
		handlers.CorsHandler(*conf.Cors,
			handlers.AccessLogHandler(log.With(logger, "handler", "Version"),
				handlers.VersionHandler(version, logger))))

	router.Path("/api/prombox/info").Methods(http.MethodGet, http.MethodOptions).Handler(
		handlers.CorsHandler(*conf.Cors,
			handlers.AccessLogHandler(log.With(logger, "handler", "PromboxInfo"),
				handlers.GetPromboxInfoHandler(*conf.Prometheus))))

	router.Path("/api/prombox/configuration").Methods(http.MethodPost, http.MethodOptions).Handler(
		handlers.CorsHandler(*conf.Cors,
			handlers.AccessLogHandler(log.With(logger, "handler", "WritePrometheusConfig"),
				handlers.WritePrometheusConfigHandler(prometheusClient, logger))))

	router.Path("/api/prometheus/status/config").Methods(http.MethodGet, http.MethodOptions).Handler(
		handlers.CorsHandler(*conf.Cors,
			handlers.AccessLogHandler(log.With(logger, "handler", "GetPrometheus"),
				handlers.GetPrometheusHandler(prometheusClient, "/api/v1/status/config", logger))))

	router.Path("/api/prometheus/status/flags").Methods(http.MethodGet, http.MethodOptions).Handler(
		handlers.CorsHandler(*conf.Cors,
			handlers.AccessLogHandler(log.With(logger, "handler", "GetPrometheus"),
				handlers.GetPrometheusHandler(prometheusClient, "/api/v1/status/flags", logger))))

	router.Path("/api/prometheus/status/runtimeinfo").Methods(http.MethodGet, http.MethodOptions).Handler(
		handlers.CorsHandler(*conf.Cors,
			handlers.AccessLogHandler(log.With(logger, "handler", "GetPrometheus"),
				handlers.GetPrometheusHandler(prometheusClient, "/api/v1/status/runtimeinfo", logger))))

	router.Path("/api/prometheus/status/buildinfo").Methods(http.MethodGet, http.MethodOptions).Handler(
		handlers.CorsHandler(*conf.Cors,
			handlers.AccessLogHandler(log.With(logger, "handler", "GetPrometheus"),
				handlers.GetPrometheusHandler(prometheusClient, "/api/v1/status/buildinfo", logger))))

	router.Path("/api/prometheus/status/tsdb").Methods(http.MethodGet, http.MethodOptions).Handler(
		handlers.CorsHandler(*conf.Cors,
			handlers.AccessLogHandler(log.With(logger, "handler", "GetPrometheus"),
				handlers.GetPrometheusHandler(prometheusClient, "/api/v1/status/tsdb", logger))))

	router.Path("/api/prometheus/targets").Methods(http.MethodGet, http.MethodOptions).Handler(
		handlers.CorsHandler(*conf.Cors,
			handlers.AccessLogHandler(log.With(logger, "handler", "GetPrometheus"),
				handlers.GetPrometheusHandler(prometheusClient, "/api/v1/targets", logger))))

	router.Path("/api/prometheus/rules").Methods(http.MethodGet, http.MethodOptions).Handler(
		handlers.CorsHandler(*conf.Cors,
			handlers.AccessLogHandler(log.With(logger, "handler", "GetPrometheus"),
				handlers.GetPrometheusHandler(prometheusClient, "/api/v1/rules", logger))))

	router.Path("/api/prometheus/query").Methods(http.MethodGet, http.MethodOptions).Name("PrometheusQuery").Handler(
		handlers.CorsHandler(*conf.Cors,
			handlers.AccessLogHandler(log.With(logger, "handler", "PrometheusQuery"),
				handlers.GetPrometheusQueryHandler(prometheusClient))))

	router.Use(mux.CORSMethodMiddleware(router))

	return router
}
