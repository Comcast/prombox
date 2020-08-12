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
	"io/ioutil"
	"log"
)

//ReadFile reads file
func ReadFile(filePath string) (string, error) {
	bytes, err := ioutil.ReadFile(filePath)
	if err != nil {
		log.Println("Read file error", err)
		return "", err
	}
	content := string(bytes)
	return content, nil
}

//WriteFile writes file
func WriteFile(filePath string, content string) (string, error) {
	err := ioutil.WriteFile(filePath, []byte(content), 05555)
	if err != nil {
		log.Println("Write file error", err)
		return "", err
	}
	return ReadFile(filePath)
}
