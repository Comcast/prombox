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
import PrometheusFrame from "@/views/PrometheusFrame.vue";

const localVue = createLocalVue();
localVue.use(Vuex);
const mockStore = new Vuex.Store(createStoreConfig());

beforeEach(() => {
  mockStore.state.prombox.info = null;
});

describe("PrometheusFrame page", () => {
  test("display iframe for http://localhost:9090", () => {
    mockStore.state.prombox.info = {
      prometheus_address: "http://prometheus:9090",
      prometheus_frame_address: "http://localhost:9090",
      prometheus_config_file: "/prometheus/prometheus.yml"
    };
    const wrapper = mount(PrometheusFrame, {
      localVue,
      store: mockStore
    });
    expect(
      wrapper
        .find("h2")
        .find("a")
        .text()
    ).toBe("http://localhost:9090");
    expect(wrapper.find("iframe").attributes("src")).toBe(
      "http://localhost:9090/config"
    );
  });
});
