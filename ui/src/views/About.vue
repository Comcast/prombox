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
  <div>
    <div class="text-center my-6">
      <h1 class="text-4xl font-bold">Prombox</h1>
      <h3>A Sandbox for your Prometheus Configuration</h3>
    </div>

    <div id="prometheus_info" class="my-4">
      <h2 class="font-semibold">Prometheus Info</h2>
      <table class="w-full table-fixed border-collapse border-2 border-gray-500 rounded">
        <tbody>
          <tr class="m-1" v-for="(value, name) in promInfo" :key="name">
            <th class="w-1/3 border border-gray-400 px-4 py-2 font-medium text-left">{{ name }}</th>
            <td class="w-2/3 border border-gray-400 px-4 py-2 bg-gray-200 text-gray-800">{{ value }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div id="version" class="my-4">
      <h2 class="font-semibold">Prombox Version</h2>
      <table class="w-full table-fixed border-collapse border-2 border-gray-500 rounded">
        <tbody>
          <tr class="m-1" v-for="(value, name) in version" :key="name">
            <th class="w-1/3 border border-gray-400 px-4 py-2 font-medium text-left">{{ name }}</th>
            <td class="w-2/3 border border-gray-400 px-4 py-2 bg-gray-200 text-gray-800">{{ value }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    promInfo() {
      return this.$store.state.prombox.info;
    },
    version() {
      return this.$store.state.prombox.version;
    }
  }
};
</script>

<style scoped>
td {
  word-break: break-all;
}
</style>
