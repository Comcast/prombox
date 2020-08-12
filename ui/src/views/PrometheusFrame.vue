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
    <div class="text-center">
      <h2 class="font-semibold">
        Viewing
        <a class="hover:text-blue-500" :href="address" target="_blank">{{ address }}</a>
      </h2>
    </div>
    <div class="iframe-container rounded-md border">
      <iframe :src="address + '/config'" />
    </div>
  </div>
</template>
<script>
export default {
  computed: {
    address() {
      return this.$store.state.prombox.info.prometheus_frame_address;
    }
  }
};
</script>

<style scoped>
.iframe-container {
  position: relative;
  padding-top: 56.25%;
  overflow: hidden;
}
.iframe-container iframe {
  position: absolute;
  height: 100%;
  width: 100%;
  border: 0;
  top: 0;
  left: 0;
}
</style>
