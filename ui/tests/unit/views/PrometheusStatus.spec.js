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

import { shallowMount } from "@vue/test-utils";
import PrometheusStatus from "@/views/PrometheusStatus.vue";
import PrometheusRuntime from "@/components/PrometheusRuntime.vue";
import PrometheusFlags from "@/components/PrometheusFlags.vue";
import PrometheusConfiguration from "@/components/PrometheusConfiguration.vue";
import PrometheusRules from "@/components/PrometheusRules.vue";
import PrometheusTargets from "@/components/PrometheusTargets.vue";
import PrometheusDiscovery from "@/components/PrometheusDiscovery.vue";

describe("Prometheus Status page", () => {
  test("display tabs", () => {
    const wrapper = shallowMount(PrometheusStatus, {
      propsData: {
        hash: "#"
      },
      stubs: ["router-link"]
    });

    const tabs = wrapper.findAll("router-link-stub");
    expect(tabs.length).toBe(6);
    expect(tabs.at(0).text()).toBe("Runtime & Build");
    expect(tabs.at(0).attributes("to")).toBe("#runtime");
    expect(tabs.at(1).text()).toBe("Command-Line Flags");
    expect(tabs.at(1).attributes("to")).toBe("#flags");
    expect(tabs.at(2).text()).toBe("Configuration");
    expect(tabs.at(2).attributes("to")).toBe("#config");
    expect(tabs.at(3).text()).toBe("Rules");
    expect(tabs.at(3).attributes("to")).toBe("#rules");
    expect(tabs.at(4).text()).toBe("Targets");
    expect(tabs.at(4).attributes("to")).toBe("#targets");
    expect(tabs.at(5).text()).toBe("Service Discovery");
    expect(tabs.at(5).attributes("to")).toBe("#discovery");
  });

  test("display PrometheusRuntime when props.hash='#runtime'", () => {
    const wrapper = shallowMount(PrometheusStatus, {
      propsData: {
        hash: "#runtime"
      },
      stubs: ["router-link"]
    });
    expect(wrapper.find(PrometheusRuntime).exists()).toBeTruthy();

    expect(wrapper.find(PrometheusFlags).exists()).toBeFalsy();
    expect(wrapper.find(PrometheusConfiguration).exists()).toBeFalsy();
    expect(wrapper.find(PrometheusRules).exists()).toBeFalsy();
    expect(wrapper.find(PrometheusTargets).exists()).toBeFalsy();
    expect(wrapper.find(PrometheusDiscovery).exists()).toBeFalsy();
  });

  test("display PrometheusFlags when props.hash='#flags'", () => {
    const wrapper = shallowMount(PrometheusStatus, {
      propsData: {
        hash: "#flags"
      },
      stubs: ["router-link"]
    });
    expect(wrapper.find(PrometheusFlags).exists()).toBeTruthy();

    expect(wrapper.find(PrometheusRuntime).exists()).toBeFalsy();
    expect(wrapper.find(PrometheusConfiguration).exists()).toBeFalsy();
    expect(wrapper.find(PrometheusRules).exists()).toBeFalsy();
    expect(wrapper.find(PrometheusTargets).exists()).toBeFalsy();
    expect(wrapper.find(PrometheusDiscovery).exists()).toBeFalsy();
  });

  test("display PrometheusConfiguration when props.hash='#config'", () => {
    const wrapper = shallowMount(PrometheusStatus, {
      propsData: {
        hash: "#config"
      },
      stubs: ["router-link"]
    });
    expect(wrapper.find(PrometheusConfiguration).exists()).toBeTruthy();

    expect(wrapper.find(PrometheusRuntime).exists()).toBeFalsy();
    expect(wrapper.find(PrometheusFlags).exists()).toBeFalsy();
    expect(wrapper.find(PrometheusRules).exists()).toBeFalsy();
    expect(wrapper.find(PrometheusTargets).exists()).toBeFalsy();
    expect(wrapper.find(PrometheusDiscovery).exists()).toBeFalsy();
  });

  test("display PrometheusRules when props.hash='#rules'", () => {
    const wrapper = shallowMount(PrometheusStatus, {
      propsData: {
        hash: "#rules"
      },
      stubs: ["router-link"]
    });
    expect(wrapper.find(PrometheusRules).exists()).toBeTruthy();

    expect(wrapper.find(PrometheusRuntime).exists()).toBeFalsy();
    expect(wrapper.find(PrometheusFlags).exists()).toBeFalsy();
    expect(wrapper.find(PrometheusConfiguration).exists()).toBeFalsy();
    expect(wrapper.find(PrometheusTargets).exists()).toBeFalsy();
    expect(wrapper.find(PrometheusDiscovery).exists()).toBeFalsy();
  });
  test("display PrometheusTargets when props.hash='#targets'", () => {
    const wrapper = shallowMount(PrometheusStatus, {
      propsData: {
        hash: "#targets"
      },
      stubs: ["router-link"]
    });
    expect(wrapper.find(PrometheusTargets).exists()).toBeTruthy();

    expect(wrapper.find(PrometheusRuntime).exists()).toBeFalsy();
    expect(wrapper.find(PrometheusFlags).exists()).toBeFalsy();
    expect(wrapper.find(PrometheusConfiguration).exists()).toBeFalsy();
    expect(wrapper.find(PrometheusRules).exists()).toBeFalsy();
    expect(wrapper.find(PrometheusDiscovery).exists()).toBeFalsy();
  });
  test("display PrometheusDiscovery when props.hash='#discovery'", () => {
    const wrapper = shallowMount(PrometheusStatus, {
      propsData: {
        hash: "#discovery"
      },
      stubs: ["router-link"]
    });
    expect(wrapper.find(PrometheusDiscovery).exists()).toBeTruthy();

    expect(wrapper.find(PrometheusRuntime).exists()).toBeFalsy();
    expect(wrapper.find(PrometheusFlags).exists()).toBeFalsy();
    expect(wrapper.find(PrometheusConfiguration).exists()).toBeFalsy();
    expect(wrapper.find(PrometheusRules).exists()).toBeFalsy();
    expect(wrapper.find(PrometheusTargets).exists()).toBeFalsy();
  });
});
