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

import Api from "@/services/Api.js";
import { getStringFromApiError } from "@/services/utils.js";

export default {
  namespaced: true,
  state: {
    info: null,
    version: null
  },
  mutations: {
    SET_INFO(state, info) {
      state.info = info;
    },
    SET_VERSION(state, version) {
      state.version = version;
    }
  },
  actions: {
    getInfo({ commit, dispatch }) {
      return Api.getPromboxInfo()
        .then(response => {
          commit("SET_INFO", response.data);
        })
        .catch(error => {
          const errorMsg = getStringFromApiError(error);
          const notification = {
            type: "error",
            message:
              "There was a problem fetching prombox prometheus information.",
            details: errorMsg
          };
          dispatch("notification/add", notification, { root: true });
        });
    },
    getVersion({ commit, dispatch }) {
      return Api.getPromboxVersion()
        .then(response => {
          commit("SET_VERSION", response.data);
        })
        .catch(error => {
          const errorMsg = getStringFromApiError(error);
          const notification = {
            type: "error",
            message: "There was a problem fetching prombox version.",
            details: errorMsg
          };
          dispatch("notification/add", notification, { root: true });
        });
    }
  }
};
