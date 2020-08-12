<!--
@license
Copyright 2020 Comcast Cable Communications Management, LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.

You may obtain a copy of the License at
http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->

<template>
  <div
    class="border m-1 px-4 py-3 rounded relative"
    :class="notificationClass(notification.type)"
    role="alert"
  >
    <div class="block sm:inline">
      <strong class="font-bold">{{ notificationHeader }}</strong>
      <span>{{ notification.message }}</span>
    </div>
    <div v-if="notification.details" class="block">{{ notification.details }}</div>

    <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
      <svg
        id="close-notification-btn"
        @click="$emit('close-notification')"
        class="fill-current h-6 w-6"
        role="button"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
      >
        <title>Close</title>
        <path
          d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"
        />
      </svg>
    </span>
  </div>
</template>

<script type="text/javascript">
export default {
  props: {
    notification: {
      type: Object,
      required: true
    }
  },
  computed: {
    notificationHeader() {
      if (this.notification.header) {
        return this.notification.header;
      } else if (this.notification.type === "error") {
        return "Oops!";
      } else if (this.notification.type === "success") {
        return "Success!";
      } else {
        return "FYI:";
      }
    }
  },
  methods: {
    notificationClass(type) {
      if (type === "error") {
        return "bg-red-100 border-red-400 text-red-700";
      } else if (type === "success") {
        return "bg-green-100 border-green-400 text-green-700";
      } else {
        return "bg-blue-100 border-blue-400 text-blue-700";
      }
    }
  }
};
</script>
