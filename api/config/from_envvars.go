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

package config

import (
	"errors"
	"os"
)

//EnvVars Abstract EnvVars for testing (otherwise tests would make real changes to our ENV VARS)
type EnvVars interface {
	LookupEnv(key string) (string, bool)
}

//OsEnvVars Uses the os package
type OsEnvVars struct{}

//LookupEnv looks up env vars
func (OsEnvVars) LookupEnv(key string) (string, bool) {
	return os.LookupEnv(key)
}

//FromEnvironmentVariables gets vars from the ENV
func FromEnvironmentVariables(envVars EnvVars) (*Config, error) {

	//These will not return an error because they are NOT required: DEFAULT is used if envVar is unset/unparsable
	port, _ := getEnv(envVars, "PORT", false, "3000")
	corsAllowOrigin, _ := getEnv(envVars, "CORS_ALLOW_ORIGIN", false, "")

	//These might return an error because they are REQUIRED (without defaults)
	var err error

	var promAddress string
	if promAddress, err = getEnv(envVars, "PROMETHEUS_ADDRESS", true, ""); err != nil {
		return nil, err
	}
	var promFrameAddress string
	if promFrameAddress, err = getEnv(envVars, "PROMETHEUS_FRAME_ADDRESS", true, ""); err != nil {
		return nil, err
	}
	var promConfigFile string
	if promConfigFile, err = getEnv(envVars, "PROMETHEUS_CONFIG", true, ""); err != nil {
		return nil, err
	}

	return &Config{
		Port: port,
		Prometheus: &PrometheusInfo{
			Address:      promAddress,
			FrameAddress: promFrameAddress,
			ConfigFile:   promConfigFile,
		},
		Cors: &CorsConfig{
			AllowOrigin: corsAllowOrigin,
		},
	}, nil
}

/** HELPERS **/

//https://dev.to/craicoverflow/a-no-nonsense-guide-to-environment-variables-in-go-a2f
func getEnv(envVars EnvVars, key string, isRequired bool, defaultVal string) (string, error) {
	if value, exists := envVars.LookupEnv(key); exists {
		return value, nil
	} else if isRequired {
		err := errors.New("Required Environment Variable is not set: " + key)
		return "", err
	}
	return defaultVal, nil
}
