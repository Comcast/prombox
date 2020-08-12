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

package prometheus

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/Comcast/prombox/api/config"
)

//HTTPClient Interface for http.Client
type HTTPClient interface {
	Do(req *http.Request) (*http.Response, error)
}

//Client prometheus client
type Client struct {
	Info       *config.PrometheusInfo
	HTTPClient HTTPClient
}

//Get gets client
func (promClient Client) Get(path string) (*string, int, error) {
	//Build Request
	url := fmt.Sprintf("%s%s", promClient.Info.Address, path)
	request, err := http.NewRequest("GET", url, nil)
	if err != nil {
		log.Println(err)
		return nil, 0, err
	}
	//Execute
	responseBody, statusCode, err := executeRequest(promClient.HTTPClient, request)
	return responseBody, statusCode, err
}

//GetQuery https://prometheus.io/docs/prometheus/latest/querying/api/#instant-queries
func (promClient Client) GetQuery(query string) (*string, int, error) {

	//Build Request
	url := fmt.Sprintf("%s/api/v1/query", promClient.Info.Address)
	request, err := http.NewRequest("GET", url, nil)
	if err != nil {
		log.Println(err)
		return nil, 0, err
	}
	q := request.URL.Query()
	q.Add("query", query)
	request.URL.RawQuery = q.Encode()
	//Execute
	responseBody, statusCode, err := executeRequest(promClient.HTTPClient, request)
	return responseBody, statusCode, err
}

//Reload https://prometheus.io/docs/prometheus/latest/management_api/#reload
func (promClient Client) Reload() (*string, int, error) {

	//Build Request
	url := fmt.Sprintf("%s/-/reload", promClient.Info.Address)
	request, err := http.NewRequest("POST", url, nil)
	if err != nil {
		log.Println(err)
		return nil, 0, err
	}
	//Execute
	responseBody, statusCode, err := executeRequest(promClient.HTTPClient, request)
	return responseBody, statusCode, err
}

func executeRequest(client HTTPClient, request *http.Request) (*string, int, error) {
	//Execute Request
	response, err := client.Do(request)
	if err != nil {
		log.Println(err)
		return nil, http.StatusInternalServerError, err
	}
	//Read Response
	defer response.Body.Close()
	responseData, err := ioutil.ReadAll(response.Body)
	if err != nil {
		log.Println(err)
		return nil, http.StatusInternalServerError, err
	}
	result := string(responseData)
	return &result, response.StatusCode, nil
}
