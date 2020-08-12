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
    <h1 class="font-semibold p-2">Runtime Information</h1>
    <pre id="runtime" class="bg-gray-200 text-gray-900 text-sm border rounded p-2">{{ runtime }}</pre>
    <h1 class="font-semibold p-2">Build Information</h1>
    <pre id="build" class="bg-gray-200 text-gray-900 text-sm border rounded p-2">{{ build }}</pre>
  </div>
</template>
<script>
import Api from "@/services/Api.js";
import { getStringFromApiError } from "@/services/utils.js";

export default {
  data() {
    return {
      runtime: "",
      build: ""
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      Api.getPrometheusRuntime()
        .then(response => {
          if (response.data.status == "success") {
            this.runtime = response.data.data;
          } else {
            const notification = {
              type: "error",
              message: "There was a problem fetching prometheus runtime info.",
              details: JSON.stringify(response.data)
            };
            this.$store.dispatch("notification/add", notification, {
              root: true
            });
          }
        })
        .catch(error => {
          const errorMsg = getStringFromApiError(error);
          const notification = {
            type: "error",
            message: "There was a problem fetching prometheus runtime info.",
            details: errorMsg
          };
          this.$store.dispatch("notification/add", notification, {
            root: true
          });
        });
      Api.getPrometheusBuild()
        .then(response => {
          if (response.data.status == "success") {
            this.build = response.data.data;
          } else {
            const notification = {
              type: "error",
              message: "There was a problem fetching prometheus build info.",
              details: JSON.stringify(response.data)
            };
            this.$store.dispatch("notification/add", notification, {
              root: true
            });
          }
        })
        .catch(error => {
          const errorMsg = getStringFromApiError(error);
          const notification = {
            type: "error",
            message: "There was a problem fetching prometheus build info.",
            details: errorMsg
          };
          this.$store.dispatch("notification/add", notification, {
            root: true
          });
        });
    }
  }
};
</script>
