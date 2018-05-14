#!/usr/local/bin/bash

set -e

tsc -p ./src

rollup -u rfc5545-rrule  -f amd -i lib/rrule.js -o builds/rrule.amd.js
rollup -f cjs -i lib/rrule.js -o builds/rrule.cjs.js
rollup -f es -i lib/rrule.js -o builds/rrule.es.js
rollup -n rfc5545-rrule -f iife -i lib/rrule.js -o builds/rrule.iife.js
rollup -n rfc5545-rrule -f umd -i lib/rrule.js -o builds/rrule.umd.js

rollup -f cjs -i lib/test/rrule-parser-test.js -o builds/test/rrule-parser-test.js
rollup -f cjs -i lib/test/rrule-test.js -o builds/test/rrule-test.js
rollup -f cjs -i lib/test/rrule-visitor-test.js -o builds/test/rrule-visitor-test.js
