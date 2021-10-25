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
    <h1 class="text-center font-bold">Prometheus Sandbox</h1>

    <div class="flex flex-col shadow m-2">
      <div class="bg-gray-300 px-3 py-2 border-b rounded-t">
        <h2 class="font-medium">Edit Prometheus Configuration</h2>
      </div>
      <textarea
        class="flex-1 p-2 text-grey-800 bg-transparent"
        rows="15"
        placeholder="Click `Fetch` to fetch the current configuration"
        v-model="input"
      />
    </div>

    <div class="m-1">
      <Button class="m-1" id="fetchBtn" @click="getConfiguration">Fetch</Button>
      <Button class="m-1" id="saveBtn" @click="updateConfiguration">Save</Button>
    </div>
  </div>
</template>

<script>
import Button from "@/components/Button.vue";
import Api from "@/services/Api.js";
import { getStringFromApiError } from "@/services/utils.js";
export default {
  components: {
    Button
  },
  data() {
    return {
      loading: false,
      input: ""
    };
  },
  methods: {
    getConfiguration() {
      this.loading = true;
      return Api.getPrometheusConfiguration()
        .then(response => {
          this.loading = false;
          if (response.data.status == "success") {
            this.input = response.data.data.yaml;
          } else {
            const notification = {
              type: "error",
              message: "There was a problem fetching prometheus configuration.",
              details: JSON.stringify(response.data)
            };
            this.$store.dispatch("notification/add", notification, {
              root: true
            });
          }
        })
        .catch(error => {
          this.loading = false;
          const errorMsg = getStringFromApiError(error);
          const notification = {
            type: "error",
            message: "There was a problem fetching prometheus configuration.",
            details: errorMsg
          };
          this.$store.dispatch("notification/add", notification, {
            root: true
          });
        });
    },
    updateConfiguration() {
      this.loading = true;
      return Api.updatePrometheusConfiguration(this.input)
        .then(() => {
          this.loading = false;
          const notification = {
            type: "success",
            message: "Configuration saved!"
          };
          this.$store.dispatch("notification/add", notification, {
            root: true
          });
        })
        .catch(error => {
          this.loading = false;
          var notification;
          if (error.response && error.response.data && error.response.data.message && error.response.data.error) {
            notification = {
              type: "error",
              message: "There was a problem saving prometheus configuration: " + error.response.data.message,
              details: error.response.data.error
            };
          } else {
            notification = {
              type: "error",
              message: "There was a problem saving prometheus configuration.",
              details: getStringFromApiError(error)
            };
          }
          this.$store.dispatch("notification/add", notification, {
            root: true
          });
        });
    }
  }
};
</script>

<style scoped>
textarea {
  font-family: monospace;
  font-size: 1.25rem;
  resize: none;
  white-space: pre;
  overflow-wrap: normal;
  overflow-x: scroll;
}
</style>
