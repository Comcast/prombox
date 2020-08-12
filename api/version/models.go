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

package version

//BuildInfo defines the application build and version information
type BuildInfo struct {
	Name      string `json:"name"`
	Version   string `json:"version"`
	BuildTime string `json:"buildTime"`
	BuildHost string `json:"buildHost"`
	GitHash   string `json:"gitHash"`
	GitBranch string `json:"gitBranch"`
}
