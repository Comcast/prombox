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
    <ul class="flex items-center border-b">
      <li :class="liClass(hash === '#runtime')">
        <router-link :class="aClass(hash === '#runtime')" to="#runtime">Runtime & Build</router-link>
      </li>
      <li :class="liClass(hash === '#flags')">
        <router-link :class="aClass(hash === '#flags')" to="#flags">Command-Line Flags</router-link>
      </li>
      <li :class="liClass(hash === '#config')">
        <router-link :class="aClass(hash === '#config')" to="#config">Configuration</router-link>
      </li>
      <li :class="liClass(hash === '#rules')">
        <router-link :class="aClass(hash === '#rules')" to="#rules">Rules</router-link>
      </li>
      <li :class="liClass(hash === '#targets')">
        <router-link :class="aClass(hash === '#targets')" to="#targets">Targets</router-link>
      </li>
      <li :class="liClass(hash === '#discovery')">
        <router-link :class="aClass(hash === '#discovery')" to="#discovery">Service Discovery</router-link>
      </li>
    </ul>
    <PrometheusRuntime v-if="hash === '#runtime'" />
    <PrometheusFlags v-if="hash === '#flags'" />
    <PrometheusConfiguration v-if="hash === '#config'" />
    <PrometheusRules v-if="hash === '#rules'" />
    <PrometheusTargets v-if="hash === '#targets'" />
    <PrometheusDiscovery v-if="hash === '#discovery'" />
  </div>
</template>
<script>
import PrometheusRuntime from "@/components/PrometheusRuntime.vue";
import PrometheusFlags from "@/components/PrometheusFlags.vue";
import PrometheusConfiguration from "@/components/PrometheusConfiguration.vue";
import PrometheusRules from "@/components/PrometheusRules.vue";
import PrometheusTargets from "@/components/PrometheusTargets.vue";
import PrometheusDiscovery from "@/components/PrometheusDiscovery.vue";

export default {
  components: {
    PrometheusRuntime,
    PrometheusFlags,
    PrometheusConfiguration,
    PrometheusRules,
    PrometheusTargets,
    PrometheusDiscovery
  },
  props: {
    hash: {
      type: String,
      required: true
    }
  },
  methods: {
    liClass(isActive) {
      const base = "mr-1";
      if (isActive) {
        return base + " -mb-px";
      } else {
        return base;
      }
    },
    aClass(isActive) {
      const base =
        "bg-white inline-block py-2 px-4 hover:text-blue-800 font-semibold";
      if (isActive) {
        return base + " text-blue-700 border-l border-t border-r rounded-t";
      } else {
        return base + " text-blue-500";
      }
    }
  }
};
</script>
