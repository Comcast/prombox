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
import NotificationBar from "@/components/NotificationBar.vue";

describe("NotificationBar", () => {
  test("show error notification", () => {
    const wrapper = mount(NotificationBar, {
      propsData: {
        notification: {
          type: "error",
          message: "A mistake was made"
        }
      }
    });
    expect(wrapper.text()).toBe("Oops! A mistake was made  Close");
  });

  test("show error notification with custom header", () => {
    const wrapper = mount(NotificationBar, {
      propsData: {
        notification: {
          type: "error",
          header: "My Bad!",
          message: "A mistake was made"
        }
      }
    });
    expect(wrapper.text()).toBe("My Bad! A mistake was made  Close");
  });

  test("show success notification", () => {
    const wrapper = mount(NotificationBar, {
      propsData: {
        notification: {
          type: "success",
          message: "Good things happened"
        }
      }
    });
    expect(wrapper.text()).toBe("Success! Good things happened  Close");
  });

  test("show success notification with custom header", () => {
    const wrapper = mount(NotificationBar, {
      propsData: {
        notification: {
          type: "success",
          header: "Yay!",
          message: "Good things happened"
        }
      }
    });
    expect(wrapper.text()).toBe("Yay! Good things happened  Close");
  });

  test("show info notification", () => {
    const wrapper = mount(NotificationBar, {
      propsData: {
        notification: {
          type: "info",
          message: "I have something to say"
        }
      }
    });
    expect(wrapper.text()).toBe("FYI: I have something to say  Close");
  });

  test("show info notification with custom header", () => {
    const wrapper = mount(NotificationBar, {
      propsData: {
        notification: {
          type: "info",
          header: "Attention!",
          message: "I have something to say"
        }
      }
    });
    expect(wrapper.text()).toBe("Attention! I have something to say  Close");
  });

  test("info notification is default", () => {
    const wrapper = mount(NotificationBar, {
      propsData: {
        notification: {
          message: "I have something to say"
        }
      }
    });
    expect(wrapper.text()).toBe("FYI: I have something to say  Close");
  });

  test("click to close notification will emit close-notification", () => {
    const wrapper = mount(NotificationBar, {
      propsData: {
        notification: {
          message: "I have something to say"
        }
      }
    });
    wrapper.find("#close-notification-btn").trigger("click");
    expect(wrapper.emitted("close-notification")).toBeTruthy();
  });
});
