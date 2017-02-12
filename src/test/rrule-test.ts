import "qunit";

import { RRule } from "../rrule";

QUnit.module("RRule");

QUnit.test("toJSON", (assert) => {
    let rrule = new RRule({ frequency: "yearly", count: 20, byMonth: [0] });
    assert.strictEqual(rrule.toJSON(), "RRULE:FREQ=YEARLY;COUNT=20;BYMONTH=1");
});
