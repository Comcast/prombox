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
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/prombox"
  },
  {
    path: "/prombox",
    name: "prombox",
    component: () => import("@/views/Prombox.vue")
  },
  {
    path: "/prometheus-frame",
    name: "prometheus-frame",
    component: () => import("@/views/PrometheusFrame.vue")
  },
  {
    path: "/prometheus-status",
    name: "prometheus-status",
    component: () => import("@/views/PrometheusStatus.vue"),
    props: route => ({
      hash: route.hash || "#config"
    })
  },
  {
    path: "/about",
    name: "about",
    component: () => import("@/views/About.vue")
  },
  {
    path: "*",
    name: "page-not-found",
    component: () => import("@/views/PageNotFound.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
