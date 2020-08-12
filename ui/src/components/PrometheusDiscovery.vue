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
    <h1 class="font-semibold p-2">Service Discovery</h1>
    <pre id="discovery" class="bg-gray-200 text-gray-900 text-sm border rounded p-2">{{ targets }}</pre>
  </div>
</template>
<script>
import Api from "@/services/Api.js";
import { getStringFromApiError } from "@/services/utils.js";

export default {
  data() {
    return {
      targets: ""
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      Api.getPrometheusTargets()
        .then(response => {
          if (response.data.status == "success") {
            this.targets = response.data.data;
          } else {
            const notification = {
              type: "error",
              message: "There was a problem fetching prometheus targets.",
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
            message: "There was a problem fetching prometheus targets.",
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
