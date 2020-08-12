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
  <header
    class="bg-gray-900 sm:flex sm:justify-left sm:items-center sm:px-4 sm:py-3"
  >
    <div class="flex items-center justify-between px-4 py-3 sm:p-0">
      <div class="sm:hidden">
        <button
          @click="isOpen = !isOpen"
          type="button"
          class="block text-gray-500 hover:text-white focus:text-white focus:outline-none"
        >
          <svg class="h-6 w-6 fill-current" viewBox="0 0 24 24">
            <path
              v-if="isOpen"
              fill-rule="evenodd"
              d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
            />
            <path
              v-if="!isOpen"
              fill-rule="evenodd"
              d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
            />
          </svg>
        </button>
      </div>
    </div>
    <div
      :class="isOpen ? 'block' : 'hidden'"
      class="px-2 pt-2 pb-4 sm:flex sm:pb-2"
    >
      <router-link
        class="block px-2 py-1 text-gray-500 font-semibold rounded hover:bg-gray-800"
        to="/prombox"
        >Prombox</router-link
      >
      <router-link
        class="mt-1 block px-2 py-1 text-gray-500 font-semibold rounded hover:bg-gray-800 sm:mt-0 sm:ml-2"
        to="/prometheus-status"
        >Prometheus Status</router-link
      >
      <router-link
        class="mt-1 block px-2 py-1 text-gray-500 font-semibold rounded hover:bg-gray-800 sm:mt-0 sm:ml-2"
        to="/prometheus-frame"
        >Prometheus Frame</router-link
      >
      <router-link
        class="mt-1 block px-2 py-1 text-gray-500 font-semibold rounded hover:bg-gray-800 sm:mt-0 sm:ml-2"
        to="/about"
        >About</router-link
      >
    </div>
  </header>
</template>

<script>
export default {
  data() {
    return {
      isOpen: false
    };
  }
};
</script>

<style scoped>
.router-link-active {
  color: white;
}
</style>
