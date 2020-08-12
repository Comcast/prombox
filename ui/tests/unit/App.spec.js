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

import { shallowMount, createLocalVue } from "@vue/test-utils";
import VueRouter from "vue-router";
import App from "@/App.vue";

const localVue = createLocalVue();
localVue.use(VueRouter);
const router = new VueRouter();

describe("App", () => {
  test("display NavBar, NotificationContainer, and router-view", () => {
    const wrapper = shallowMount(App, {
      localVue,
      router,
      stubs: ["router-view", "NavBar", "NotificationContainer"]
    });
    expect(wrapper.find("navbar-stub").exists()).toBe(true);
    expect(wrapper.find("notificationcontainer-stub").exists()).toBe(true);
    expect(wrapper.find("router-view-stub").exists()).toBe(true);
  });
});
