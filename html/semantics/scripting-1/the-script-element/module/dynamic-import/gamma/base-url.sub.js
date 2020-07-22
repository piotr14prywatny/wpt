"use strict";

// This script triggers import(), and thus the base URL of this script
// (either loaded by `<script>` or `importScripts()`) is used as the base URL
// of resolving relative URL-like specifiers in `import()`.

// The following fields should be set by the callers of this script
// (unless loaded as the worker top-level script):
// - self.testName (string)
// - self.baseUrlSanitized (boolean)

// When this script is loaded as the worker top-level script:
if ('DedicatedWorkerGlobalScope' in self &&
    self instanceof DedicatedWorkerGlobalScope &&
    !self.testName) {
  importScripts("/resources/testharness.js");
  self.testName = 'worker top-level script';
  // Worker top-level scripts are always same-origin.
  self.baseUrlSanitized = false;
}

promise_test(((baseUrlSanitized) => {
    const promise = import("./import.js?pipe=header(Access-Control-Allow-Origin,*)&label=" + Math.random());
    if (baseUrlSanitized) {
      // The base URL is "about:blank" and thus import() here should fail.
      return promise.then(module => {
          // This code should be unreached, but assert_equals() is used here
          // to log `module.A["from"]` in case of unexpected resolution.
          assert_equals(module.A["from"], "(unreached)",
            "Relative URL-like specifier resolution should fail");
          assert_unreached();
        },
        () => {});
    } else {
      // The base URL is the response URL of this script, i.e.
      // `.../gamma/base-url.sub.js`.
      return promise.then(module => {
          assert_equals(module.A["from"], "gamma/import.js");
        });
    }
  // `baseUrlSanitized` is bound here because promise_test() body can be
  // executed asynchronously.
  }).bind(undefined, self.baseUrlSanitized),
  "Relative URL-like from " + self.testName);

promise_test(() => {
    return import("http://{{hosts[alt][]}}:{{ports[http][0]}}/html/semantics/scripting-1/the-script-element/module/dynamic-import/gamma/import.js?pipe=header(Access-Control-Allow-Origin,*)&label=" + Math.random())
      .then(module => {
          assert_equals(module.A["from"], "gamma/import.js");
        })
  },
  "Absolute URL-like from " + self.testName);

done();
