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

import { mount, createLocalVue } from "@vue/test-utils";
import Vue from "vue";
import Vuex from "vuex";
import createStoreConfig from "@/store/config.js";
import PrometheusRules from "@/components/PrometheusRules.vue";
import Api from "@/services/Api.js";

const localVue = createLocalVue();
localVue.use(Vuex);

const mockStore = new Vuex.Store(createStoreConfig());

jest.mock("@/services/Api.js", () => ({
  getPrometheusRules: jest.fn()
}));

beforeEach(() => {
  mockStore.state.notification.list = [];
  mockStore.state.notification.nextId = 1;
  Api.getPrometheusRules.mockReset();
});

describe("PrometheusRules", () => {
  test("display flags", async () => {
    const mockRules = {
      groups: []
    };
    Api.getPrometheusRules.mockImplementation(() => {
      return Promise.resolve({
        status: 200,
        statusText: "Ok",
        data: {
          status: "success",
          data: mockRules
        }
      });
    });

    const wrapper = mount(PrometheusRules, {
      localVue,
      store: mockStore
    });

    await Vue.nextTick(); //wait for API call to finish
    expect(Api.getPrometheusRules).toHaveBeenCalledTimes(1);

    expect(wrapper.find("h1").exists()).toBeTruthy();
    expect(wrapper.find("h1").text()).toBe("Rules");
    expect(wrapper.find("pre#rules").exists()).toBeTruthy();
    expect(wrapper.find("pre#rules").text()).toBe(
      JSON.stringify(mockRules, null, 2)
    );

    expect(mockStore.state.notification.list.length).toBe(0);
  });

  test("add error notification if api call fails", async () => {
    Api.getPrometheusRules.mockImplementation(() => {
      return Promise.resolve({
        status: 200,
        statusText: "Ok",
        data: {
          status: "error",
          data: "Prometheus reporting a weird error"
        }
      });
    });

    const wrapper = mount(PrometheusRules, {
      localVue,
      store: mockStore
    });

    await Vue.nextTick(); //wait for API call to finish
    expect(Api.getPrometheusRules).toHaveBeenCalledTimes(1);

    expect(wrapper.find("pre#rules").text()).toBe("");

    expect(mockStore.state.notification.list.length).toBe(1);
    expect(mockStore.state.notification.list[0]).toMatchObject({
      type: "error",
      message: "There was a problem fetching prometheus rules.",
      details: '{"status":"error","data":"Prometheus reporting a weird error"}'
    });
  });

  test("add error notification if api call throws error", async () => {
    Api.getPrometheusRules.mockImplementation(() => {
      return Promise.reject({
        response: {
          status: 500,
          statusText: "Internal Server Error",
          data: "Something went wrong"
        }
      });
    });

    const wrapper = mount(PrometheusRules, {
      localVue,
      store: mockStore
    });

    await Vue.nextTick(); //wait for API call to finish
    expect(Api.getPrometheusRules).toHaveBeenCalledTimes(1);

    expect(wrapper.find("pre#rules").text()).toBe("");

    expect(mockStore.state.notification.list.length).toBe(1);
    expect(mockStore.state.notification.list[0]).toMatchObject({
      type: "error",
      message: "There was a problem fetching prometheus rules.",
      details: '500 Internal Server Error: "Something went wrong"'
    });
  });
});
