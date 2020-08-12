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

const localVue = createLocalVue();
localVue.use(Vuex);

describe("Vuex Store Actions: notification", () => {
  const underTest = new Vuex.Store(createStoreConfig());
  const notification = { message: "Hello" };

  test("dispatch('notification/add') adds a new notification to store", () => {
    //Check that notification list starts empty
    expect(underTest.state.notification.list.length).toBe(0);

    //Add notification
    underTest.dispatch("notification/add", notification);
    expect(underTest.state.notification.list.length).toBe(1);
    expect(underTest.state.notification.list[0]).toMatchObject(
      notificationWithId(1, notification)
    );

    //Add another notification
    underTest.dispatch("notification/add", notification);
    expect(underTest.state.notification.list.length).toBe(2);
    expect(underTest.state.notification.list[1]).toMatchObject(
      notificationWithId(2, notification)
    );
  });

  test("dispatch('notification/remove') removes the notification from store", () => {
    //Check that we start with two notifications (added in test above)
    expect(underTest.state.notification.list.length).toBe(2);

    //Remove the first notification (id = 1)
    underTest.dispatch("notification/remove", 1);
    expect(underTest.state.notification.list.length).toBe(1);
    expect(underTest.state.notification.list[0]).toMatchObject(
      notificationWithId(2, notification)
    );

    //Remove the second notification (id = 2)
    underTest.dispatch("notification/remove", 2);
    expect(underTest.state.notification.list.length).toBe(0);
  });

  test("dispatch('notification/clearAll') removes all notifications from store", () => {
    //Add two notifications to the store
    underTest.dispatch("notification/add", notification);
    underTest.dispatch("notification/add", notification);
    //Check that we start with two notifications
    expect(underTest.state.notification.list.length).toBe(2);

    //Remove all notifications
    underTest.dispatch("notification/clearAll");
    expect(underTest.state.notification.list.length).toBe(0);
  });
});

function notificationWithId(id, notification) {
  return {
    id: id,
    ...notification
  };
}
