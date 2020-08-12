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

import { createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import createStoreConfig from "@/store/config.js";
import Api from "@/services/Api.js";

const localVue = createLocalVue();
localVue.use(Vuex);

const store = new Vuex.Store(createStoreConfig());

jest.mock("@/services/Api.js", () => ({
  getPromboxInfo: jest.fn(),
  getPromboxVersion: jest.fn()
}));

beforeEach(() => {
  store.state.prombox.info = null;
  store.state.prombox.version = null;
  store.state.notification.list = [];
  store.state.notification.nextId = 1;
  Api.getPromboxInfo.mockReset();
  Api.getPromboxVersion.mockReset();
});

describe("Vuex Store Actions: prombox", () => {
  test("dispatch('prombox/getInfo') saves to store when Api.getPromboxInfo is successful", async () => {
    //Setup Mock
    const mockInfo = {
      prometheus_address: "http://prometheus:9090",
      prometheus_config_file: "/prometheus/prometheus.yml"
    };
    Api.getPromboxInfo.mockImplementation(() => {
      return Promise.resolve({
        status: 200,
        statusText: "Ok",
        data: mockInfo
      });
    });
    await store.dispatch("prombox/getInfo");

    expect(store.state.prombox.info).toStrictEqual(mockInfo);
    expect(store.state.notification.list.length).toBe(0);
  });

  test("dispatch('prombox/getInfo') adds notification to store when Api.getPromboxInfo fails", async () => {
    //Setup Mock
    Api.getPromboxInfo.mockImplementation(() => {
      return Promise.reject({
        response: {
          status: 500,
          statusText: "Internal Server Error",
          data: "Something went wrong"
        }
      });
    });
    await store.dispatch("prombox/getInfo");

    expect(store.state.prombox.info).toBeNull();
    expect(store.state.notification.list.length).toBe(1);
    expect(store.state.notification.list[0]).toMatchObject({
      type: "error",
      message: "There was a problem fetching prombox prometheus information.",
      details: '500 Internal Server Error: "Something went wrong"'
    });
  });

  test("dispatch('prombox/getVersion') saves to store when Api.getPromboxVersion is successful", async () => {
    //Setup Mock
    const mockVersion = {
      name: "prombox",
      version: "v.0.0.1",
      buildTime: "123",
      buildHost: "ABC",
      gitHash: "a1b2c3",
      gitBranch: "dev"
    };
    Api.getPromboxVersion.mockImplementation(() => {
      return Promise.resolve({
        status: 200,
        statusText: "Ok",
        data: mockVersion
      });
    });
    await store.dispatch("prombox/getVersion");

    expect(store.state.prombox.version).toStrictEqual(mockVersion);
    expect(store.state.notification.list.length).toBe(0);
  });

  test("dispatch('prombox/getVersion') adds notification to store when Api.getPromboxVersion fails", async () => {
    //Setup Mock
    Api.getPromboxVersion.mockImplementation(() => {
      return Promise.reject({
        response: {
          status: 500,
          statusText: "Internal Server Error",
          data: "Something went wrong"
        }
      });
    });
    await store.dispatch("prombox/getVersion");

    expect(store.state.prombox.version).toBeNull();
    expect(store.state.notification.list.length).toBe(1);
    expect(store.state.notification.list[0]).toMatchObject({
      type: "error",
      message: "There was a problem fetching prombox version.",
      details: '500 Internal Server Error: "Something went wrong"'
    });
  });
});
