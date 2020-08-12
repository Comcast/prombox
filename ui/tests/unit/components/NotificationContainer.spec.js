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

import { mount } from "@vue/test-utils";
import NotificationContainer from "@/components/NotificationContainer.vue";
import NotificationBar from "@/components/NotificationBar.vue";

describe("NotificationContainer", () => {
  test("show nothing when state.notification.list is empty", () => {
    const wrapper = mount(NotificationContainer, {
      computed: {
        list: () => []
      },
      methods: {
        remove: jest.fn()
      }
    });
    expect(wrapper.findAll(NotificationBar).exists()).toBe(false);
  });

  test("show all notification when list is not empty", () => {
    const wrapper = mount(NotificationContainer, {
      computed: {
        list: () => [
          { id: 1, type: "error", message: "Sorry about that." },
          { id: 2, type: "success", message: "We have good news!" },
          { id: 3, type: "info", message: "I want to say something." }
        ]
      },
      methods: {
        remove: jest.fn()
      }
    });
    const notificationBars = wrapper.findAll(NotificationBar);
    expect(notificationBars.exists()).toBe(true);
    expect(notificationBars.length).toBe(3);
  });

  test("call remove(id) when notification is closed", () => {
    const removeHandler = jest.fn();
    const wrapper = mount(NotificationContainer, {
      computed: {
        list: () => [{ id: 99, type: "error", message: "Sorry about that." }]
      },
      methods: {
        remove: removeHandler
      }
    });
    const notificationBar = wrapper.find(NotificationBar);
    expect(notificationBar.exists()).toBe(true);

    notificationBar.find("#close-notification-btn").trigger("click");
    expect(removeHandler).toHaveBeenCalledWith(99);
  });
});
