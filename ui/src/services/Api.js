/*
 * *
 *  Copyright 2020 Comcast Cable Communications Management, LLC
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 * /
 */

import axios from "axios";

const client = axios.create({
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
});

export default {
  getPromboxInfo() {
    return client.get("/api/prombox/info");
  },
  getPromboxVersion() {
    return client.get("/api/version");
  },
  updatePrometheusConfiguration(promConfig) {
    return client.post("/api/prombox/configuration", {
      prometheus_config: promConfig
    });
  },
  getPrometheusConfiguration() {
    return client.get("/api/prometheus/status/config");
  },
  getPrometheusRuntime() {
    return client.get("/api/prometheus/status/runtimeinfo");
  },
  getPrometheusBuild() {
    return client.get("/api/prometheus/status/buildinfo");
  },
  getPrometheusFlags() {
    return client.get("/api/prometheus/status/flags");
  },
  getPrometheusTargets() {
    return client.get("/api/prometheus/targets");
  },
  getPrometheusRules() {
    return client.get("/api/prometheus/rules");
  }
};
