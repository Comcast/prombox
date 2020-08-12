/*
 * Copyright 2020 Comcast Cable Communications Management, LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package utils

import (
	"testing"
)

func TestAreEquals(t *testing.T) {
	jsonStr1 := `{"dog": 5, "cat": 3}`
	jsonStr2 := `{"cat":3, "dog": 5}`
	areEqual, err := AreEqualJSON(jsonStr1, jsonStr2)
	if err != nil {
		t.Fatal(err)
	}
	if !areEqual {
		t.Errorf("Should have been equal json values %v", jsonStr1)
	}
}
