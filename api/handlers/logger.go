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
	"log"
	"net/http"
	"time"
)

//LoggerHandler wraps the handler to log requests and response
func LoggerHandler(name string, inner http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		lrw := NewLoggingResponseWriter(w)
		inner.ServeHTTP(lrw, r)

		log.Printf(
			"type=access_log method=%s uri=%s statusCode=%d name=%s duration=%s",
			r.Method,
			r.RequestURI,
			lrw.statusCode,
			name,
			time.Since(start),
		)
	})
}

//Capturing the statusCode from ResponseWriter so we can include it in the access log
//https://gist.github.com/Boerworz/b683e46ae0761056a636

//LoggingResponseWriter is log response writer is a log response writer
type LoggingResponseWriter struct {
	http.ResponseWriter
	statusCode int
}

//NewLoggingResponseWriter wirtes out logs
func NewLoggingResponseWriter(w http.ResponseWriter) *LoggingResponseWriter {
	// WriteHeader(int) is not called if our response implicitly returns 200 OK, so
	// we default to that status code.
	return &LoggingResponseWriter{w, http.StatusOK}
}

//WriteHeader writes log header
func (lrw *LoggingResponseWriter) WriteHeader(code int) {
	lrw.statusCode = code
	lrw.ResponseWriter.WriteHeader(code)
}
