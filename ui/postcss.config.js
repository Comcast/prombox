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

const autoprefixer = require("autoprefixer");
const tailwindcss = require("tailwindcss");
const postcssPurgecss = require(`@fullhuman/postcss-purgecss`);

const purgecss = postcssPurgecss({
  // Specify the paths to all of the template files in your project.
  content: ["./public/**/*.html", "./src/**/*.vue"],
  // Include any special characters you're using in this regular expression.
  // See: https://tailwindcss.com/docs/controlling-file-size/#understanding-the-regex
  defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
  // Whitelist auto generated classes for transitions and router links.
  // From: https://github.com/ky-is/vue-cli-plugin-tailwind
  whitelistPatterns: [
    /-(leave|enter|appear)(|-(to|from|active))$/,
    /^(?!(|.*?:)cursor-move).+-move$/,
    /^router-link(|-exact)-active$/
  ]
});

module.exports = {
  plugins: [
    tailwindcss,
    autoprefixer,
    ...(process.env.NODE_ENV === "production" ? [purgecss] : [])
  ]
};
