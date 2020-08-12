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

import Vue from "vue";
import NProgress from "nprogress";
import App from "./App.vue";
import router from "./router.js";
import store from "./store";

import "./assets/styles/index.css";

Vue.config.productionTip = false;
NProgress.configure({ showSpinner: false });

new Vue({
  router,
  store,
  created() {
    store.dispatch("prombox/getInfo");
    store.dispatch("prombox/getVersion");
  },
  render: h => h(App)
}).$mount("#app");
