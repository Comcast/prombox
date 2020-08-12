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
import Prombox from "@/views/Prombox.vue";
import Api from "@/services/Api.js";

const localVue = createLocalVue();
localVue.use(Vuex);
const mockStore = new Vuex.Store(createStoreConfig());

jest.mock("@/services/Api.js", () => ({
  getPrometheusConfiguration: jest.fn(),
  updatePrometheusConfiguration: jest.fn()
}));

beforeEach(() => {
  mockStore.state.notification.list = [];
  mockStore.state.notification.nextId = 1;
  Api.getPrometheusConfiguration.mockReset();
  Api.updatePrometheusConfiguration.mockReset();
});

describe("Prombox page", () => {
  test("display empty textarea, Reset Button, and Save button", () => {
    const wrapper = mount(Prombox, {
      data() {
        return {
          input: "textarea-input"
        };
      },
      localVue,
      store: mockStore
    });

    expect(wrapper.find("h1").text()).toBe("Prometheus Sandbox");

    expect(wrapper.find("textarea").exists()).toBeTruthy();
    expect(wrapper.find("textarea").element.value).toBe("textarea-input");
    expect(wrapper.find("textarea").attributes("placeholder")).toBe(
      "Click `Reset` to fetch the current configuration"
    );

    expect(wrapper.find("button#resetBtn").text()).toBe("Reset");
    expect(wrapper.find("button#saveBtn").text()).toBe("Save");
  });

  test("display fetched configuration when Reset is clicked", async () => {
    const mockYaml = "raw-yaml";
    Api.getPrometheusConfiguration.mockImplementation(() => {
      return Promise.resolve({
        status: 200,
        statusText: "Ok",
        data: {
          status: "success",
          data: {
            yaml: mockYaml
          }
        }
      });
    });
    const wrapper = mount(Prombox, {
      localVue,
      store: mockStore
    });
    wrapper.find("button#resetBtn").trigger("click");
    await Vue.nextTick();

    expect(wrapper.vm.$data.input).toBe(mockYaml);
    expect(wrapper.find("textarea").element.value).toBe(mockYaml);
    expect(mockStore.state.notification.list.length).toBe(0);
  });

  test("add notification when Reset is clicked and Api call fails (rejected)", async () => {
    Api.getPrometheusConfiguration.mockImplementation(() => {
      return Promise.reject({
        response: {
          status: 500,
          statusText: "Internal Server Error",
          data: "Something went wrong"
        }
      });
    });
    const wrapper = mount(Prombox, {
      localVue,
      store: mockStore
    });
    wrapper.find("button#resetBtn").trigger("click");
    await Vue.nextTick();

    expect(wrapper.vm.$data.input).toBe("");
    expect(wrapper.find("textarea").element.value).toBe("");
    expect(mockStore.state.notification.list.length).toBe(1);
    expect(mockStore.state.notification.list[0]).toMatchObject({
      type: "error",
      message: "There was a problem fetching prometheus configuration.",
      details: '500 Internal Server Error: "Something went wrong"'
    });
  });

  test("add notification when Reset is clicked and Api call fails (data.status=error)", async () => {
    Api.getPrometheusConfiguration.mockImplementation(() => {
      return Promise.resolve({
        status: 200,
        statusText: "Ok",
        data: {
          status: "error",
          data: "Prometheus reporting a weird error"
        }
      });
    });
    const wrapper = mount(Prombox, {
      localVue,
      store: mockStore
    });
    wrapper.find("button#resetBtn").trigger("click");
    await Vue.nextTick();

    expect(wrapper.vm.$data.input).toBe("");
    expect(wrapper.find("textarea").element.value).toBe("");
    expect(mockStore.state.notification.list.length).toBe(1);
    expect(mockStore.state.notification.list[0]).toMatchObject({
      type: "error",
      message: "There was a problem fetching prometheus configuration.",
      details: '{"status":"error","data":"Prometheus reporting a weird error"}'
    });
  });

  test("submit configuration when Saved is clicked, display success", async () => {
    Api.updatePrometheusConfiguration.mockImplementation(() => {
      return Promise.resolve({
        status: 200,
        statusText: "Ok"
      });
    });
    const mockYaml = "raw-yaml";
    const wrapper = mount(Prombox, {
      data() {
        return {
          input: mockYaml
        };
      },
      localVue,
      store: mockStore
    });
    expect(wrapper.vm.$data.input).toBe(mockYaml);
    expect(wrapper.find("textarea").element.value).toBe(mockYaml);
    wrapper.find("button#saveBtn").trigger("click");
    await Vue.nextTick();

    expect(Api.updatePrometheusConfiguration).toHaveBeenCalledWith(mockYaml);
    expect(mockStore.state.notification.list.length).toBe(1);
    expect(mockStore.state.notification.list[0]).toMatchObject({
      type: "success",
      message: "Configuration saved!"
    });
  });

  test("submit configuration when Saved is clicked, display error if fails", async () => {
    Api.updatePrometheusConfiguration.mockImplementation(() => {
      return Promise.reject({
        response: {
          status: 500,
          statusText: "Internal Server Error",
          data: "Something went wrong"
        }
      });
    });
    const mockYaml = "raw-yaml";
    const wrapper = mount(Prombox, {
      data() {
        return {
          input: mockYaml
        };
      },
      localVue,
      store: mockStore
    });
    expect(wrapper.vm.$data.input).toBe(mockYaml);
    expect(wrapper.find("textarea").element.value).toBe(mockYaml);
    wrapper.find("button#saveBtn").trigger("click");
    await Vue.nextTick();

    expect(Api.updatePrometheusConfiguration).toHaveBeenCalledWith(mockYaml);
    expect(mockStore.state.notification.list.length).toBe(1);
    expect(mockStore.state.notification.list[0]).toMatchObject({
      type: "error",
      message: "There was a problem saving prometheus configuration.",
      details: '500 Internal Server Error: "Something went wrong"'
    });
  });
});
