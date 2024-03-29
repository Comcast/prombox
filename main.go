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

package main

import (
	"net/http"
	"os"
	"path"
	"time"

	"github.com/go-kit/log"

	"github.com/Comcast/prombox/api"
	"github.com/Comcast/prombox/api/config"
	"github.com/Comcast/prombox/api/handlers"
	"github.com/Comcast/prombox/api/version"
	"github.com/Comcast/prombox/ui"
)

//Name of the app
var name = "prombox"
var buildVersion = ""
var buildTime = ""
var buildHost = ""
var gitHash = ""
var gitBranch = ""

func main() {

	var logger log.Logger
	logger = log.NewLogfmtLogger(log.NewSyncWriter(os.Stderr))
	logger = log.With(logger, "ts", log.DefaultTimestampUTC, "caller", log.DefaultCaller)

	//Read configuration from Environment Variables.
	config, err := config.FromEnvironmentVariables(config.OsEnvVars{})
	if err != nil {
		logger.Log("msg", "fatal error loading configuration", "err", err.Error())
		os.Exit(1)
	}

	buildInfo := version.BuildInfo{
		Name:      name,
		Version:   buildVersion,
		BuildTime: buildTime,
		BuildHost: buildHost,
		GitHash:   gitHash,
		GitBranch: gitBranch,
	}

	server := &http.Server{
		Addr:           ":" + config.Port,
		ReadTimeout:    60 * time.Second,
		WriteTimeout:   60 * time.Second,
		MaxHeaderBytes: 1 << 16,
	}

	// Endpoints for the API and Vue client
	apiHandler := api.NewAPI(buildInfo, *config, logger)
	http.Handle("/api/", apiHandler)

	uiHandler := handlers.AccessLogHandler(log.With(logger, "hander", "uiHandler"), http.FileServer(SinglePageApplication{ui.Assets}))
	http.Handle("/", uiHandler)

	logger.Log("port", config.Port, "cors.AllowOrigin", config.Cors.AllowOrigin)
	fatalErr := server.ListenAndServe()
	if fatalErr != nil {
		logger.Log("msg", "fatal serve error", "err", fatalErr.Error())
		os.Exit(1)
	}
}

//SinglePageApplication is a Vue integration
type SinglePageApplication struct {
	fs http.FileSystem
}

//Open overrides the fs function
func (spa SinglePageApplication) Open(name string) (http.File, error) {
	if ext := path.Ext(name); name != "/" && (ext == "" || ext == ".html") {
		name = "index.html"
	}
	return spa.fs.Open(name)
}
