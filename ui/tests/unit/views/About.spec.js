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
import Vuex from "vuex";
import createStoreConfig from "@/store/config.js";
import About from "@/views/About.vue";

const localVue = createLocalVue();
localVue.use(Vuex);
const mockStore = new Vuex.Store(createStoreConfig());

beforeEach(() => {
  mockStore.state.prombox.info = null;
  mockStore.state.prombox.version = null;
});

describe("About page", () => {
  test("display prombox info if it exists in store", () => {
    mockStore.state.prombox.info = {
      prometheus_address: "http://prometheus:9090",
      prometheus_frame_address: "http://localhost:9090",
      prometheus_config_file: "/prometheus/prometheus.yml"
    };
    mockStore.state.prombox.version = {
      name: "prombox",
      version: "v0.0.1",
      buildTime: "123",
      buildHost: "ABC",
      gitHash: "a1b2c3",
      gitBranch: "dev"
    };
    const wrapper = mount(About, {
      localVue,
      store: mockStore
    });

    expect(wrapper.find("h1").text()).toBe("Prombox");
    expect(wrapper.find("h3").text()).toBe(
      "A Sandbox for your Prometheus Configuration"
    );

    const promInfoDiv = wrapper.find("div#prometheus_info");
    expect(promInfoDiv.find("h2").text()).toBe("Prometheus Info");
    const promInfoTableRows = promInfoDiv.findAll("table>tbody>tr");
    expect(promInfoTableRows.length).toBe(3);
    expect(
      promInfoTableRows
        .at(0)
        .find("th")
        .text()
    ).toBe("prometheus_address");
    expect(
      promInfoTableRows
        .at(0)
        .find("td")
        .text()
    ).toBe("http://prometheus:9090");
    expect(
      promInfoTableRows
        .at(1)
        .find("th")
        .text()
    ).toBe("prometheus_frame_address");
    expect(
      promInfoTableRows
        .at(1)
        .find("td")
        .text()
    ).toBe("http://localhost:9090");
    expect(
      promInfoTableRows
        .at(2)
        .find("th")
        .text()
    ).toBe("prometheus_config_file");
    expect(
      promInfoTableRows
        .at(2)
        .find("td")
        .text()
    ).toBe("/prometheus/prometheus.yml");

    const versionDiv = wrapper.find("div#version");
    expect(versionDiv.find("h2").text()).toBe("Prombox Version");
    const verisonTableRows = versionDiv.findAll("table>tbody>tr");
    expect(verisonTableRows.length).toBe(6);
    expect(
      verisonTableRows
        .at(0)
        .find("th")
        .text()
    ).toBe("name");
    expect(
      verisonTableRows
        .at(0)
        .find("td")
        .text()
    ).toBe("prombox");
    expect(
      verisonTableRows
        .at(1)
        .find("th")
        .text()
    ).toBe("version");
    expect(
      verisonTableRows
        .at(1)
        .find("td")
        .text()
    ).toBe("v0.0.1");
    expect(
      verisonTableRows
        .at(2)
        .find("th")
        .text()
    ).toBe("buildTime");
    expect(
      verisonTableRows
        .at(2)
        .find("td")
        .text()
    ).toBe("123");
    expect(
      verisonTableRows
        .at(3)
        .find("th")
        .text()
    ).toBe("buildHost");
    expect(
      verisonTableRows
        .at(3)
        .find("td")
        .text()
    ).toBe("ABC");
    expect(
      verisonTableRows
        .at(4)
        .find("th")
        .text()
    ).toBe("gitHash");
    expect(
      verisonTableRows
        .at(4)
        .find("td")
        .text()
    ).toBe("a1b2c3");
    expect(
      verisonTableRows
        .at(5)
        .find("th")
        .text()
    ).toBe("gitBranch");
    expect(
      verisonTableRows
        .at(5)
        .find("td")
        .text()
    ).toBe("dev");
  });

  test("display prombox info if it doesn't exist in store", () => {
    mockStore.state.prombox.info = null;
    const wrapper = mount(About, {
      localVue,
      store: mockStore
    });

    const promInfoDiv = wrapper.find("div#prometheus_info");
    expect(promInfoDiv.find("h2").text()).toBe("Prometheus Info");
    expect(promInfoDiv.findAll("table>tbody>tr").length).toBe(0);

    const versionDiv = wrapper.find("div#version");
    expect(versionDiv.find("h2").text()).toBe("Prombox Version");
    expect(versionDiv.findAll("table>tbody>tr").length).toBe(0);
  });
});
