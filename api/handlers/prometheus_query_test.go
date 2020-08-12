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
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/Comcast/prombox/api/config"
	"github.com/Comcast/prombox/api/prometheus"
	"github.com/Comcast/prombox/api/utils"
)

type MockHTTPClient struct {
	expectedBody string
}

func (c MockHTTPClient) Do(req *http.Request) (*http.Response, error) {
	resp := utils.Build200Response(req, c.expectedBody)
	return &resp, nil
}

func TestPrometheusQueryHandler(t *testing.T) {

	//Set up mocks
	expectedBody := "{\"data\":{\"status\":\"success\",\"data\":{\"resultType\":\"vector\",\"result\":[{\"metric\":{},\"value\":[1582142908.346,\"12\"]}]}}}"
	mockClient := MockHTTPClient{expectedBody}
	mockPromClient := prometheus.Client{
		Info: &config.PrometheusInfo{
			Address:      "http:localhost:9090",
			FrameAddress: "http:localhost:9090",
			ConfigFile:   "/prometheus/prometheus.yml"},
		HTTPClient: mockClient,
	}

	//Build request
	req, err := http.NewRequest("GET", "/api/prometheus/query", nil)
	if err != nil {
		t.Fatalf("GetPrometheusQueryHandler returned unexpected error in test: %v", err)
	}
	query := "count(up)"
	q := req.URL.Query()
	q.Add("query", query)
	req.URL.RawQuery = q.Encode()

	//Execute
	rr := httptest.NewRecorder()
	handler := GetPrometheusQueryHandler(mockPromClient)
	handler.ServeHTTP(rr, req)

	//Validate
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("GetPrometheusQueryHandler returned wrong status code:\nEXPECTED: %v\nRECEIVED: %v\n", http.StatusOK, status)
	}
	isEqual, marshalErr := utils.AreEqualJSON(rr.Body.String(), expectedBody)
	if marshalErr != nil {
		t.Fatalf("GetPrometheusQueryHandler returned unexpected error in test: %v", marshalErr)
	}
	if !isEqual {
		t.Errorf("GetPrometheusQueryHandler returned unexpected body:\nEXPECTED: %v\nRECEIVED: %v\n", expectedBody, rr.Body.String())
	}
}
