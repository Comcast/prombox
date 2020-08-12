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
import NavBar from "@/components/NavBar.vue";

describe("NavBar", () => {
  test("display links", () => {
    const wrapper = shallowMount(NavBar, {
      stubs: ["router-link"]
    });
    //UserDropdown
    //Router-links: Logo(/)
    const links = wrapper.findAll("router-link-stub");
    expect(links.length).toBe(4);
    expect(links.at(0).text()).toBe("Prombox");
    expect(links.at(0).attributes("to")).toBe("/prombox");
    expect(links.at(1).text()).toBe("Prometheus Status");
    expect(links.at(1).attributes("to")).toBe("/prometheus-status");
    expect(links.at(2).text()).toBe("Prometheus Frame");
    expect(links.at(2).attributes("to")).toBe("/prometheus-frame");
    expect(links.at(3).text()).toBe("About");
    expect(links.at(3).attributes("to")).toBe("/about");
  });
});
