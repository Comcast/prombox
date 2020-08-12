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

package utils

import (
	"bytes"
	"errors"
	"io/ioutil"
	"net/http"
)

//Build200Response Used to create 200 Response for testing
func Build200Response(req *http.Request, body string) http.Response {
	return http.Response{
		Status:        "200 OK",
		StatusCode:    200,
		Proto:         "HTTP/1.1",
		ProtoMajor:    1,
		ProtoMinor:    1,
		Body:          ioutil.NopCloser(bytes.NewBufferString(body)),
		ContentLength: int64(len(body)),
		Request:       req,
		Header:        make(http.Header, 0),
	}
}

//SimpleMockClient is used for testing
//will either always return an error (with the given ErrorMsg), or always return the given response
type SimpleMockClient struct {
	Status     string
	StatusCode int
	Body       string
	ErrorMsg   string
}

//Do runs the tests
func (c *SimpleMockClient) Do(req *http.Request) (*http.Response, error) {
	if c.ErrorMsg != "" {
		return nil, errors.New(c.ErrorMsg)
	}
	resp := http.Response{
		Status:        c.Status,
		StatusCode:    c.StatusCode,
		Proto:         "HTTP/1.1",
		ProtoMajor:    1,
		ProtoMinor:    1,
		Body:          ioutil.NopCloser(bytes.NewBufferString(c.Body)),
		ContentLength: int64(len(c.Body)),
		Request:       req,
		Header:        make(http.Header, 0),
	}
	return &resp, nil
}
