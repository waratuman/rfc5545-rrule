import "qunit";

import { RRule, Day } from "../rrule";
import { examples } from "./examples";

QUnit.module("RRule.fromString");

QUnit.test("grammar", (assert) => {
    examples.forEach((line) => {
        assert.ok(RRule.fromString(line), line);
    });
});

QUnit.test("FREQ", (assert) => {
    let rrule = RRule.fromString("RRULE:FREQ=YEARLY");
    assert.strictEqual(rrule.frequency, "yearly");

    rrule = RRule.fromString("RRULE:FREQ=MONTHLY");
    assert.strictEqual(rrule.frequency, "monthly");

    rrule = RRule.fromString("RRULE:FREQ=WEEKLY");
    assert.strictEqual(rrule.frequency, "weekly");

    rrule = RRule.fromString("RRULE:FREQ=DAILY");
    assert.strictEqual(rrule.frequency, "daily");

    rrule = RRule.fromString("RRULE:FREQ=HOURLY");
    assert.strictEqual(rrule.frequency, "hourly");

    rrule = RRule.fromString("RRULE:FREQ=MINUTELY");
    assert.strictEqual(rrule.frequency, "minutely");

    rrule = RRule.fromString("RRULE:FREQ=SECONDLY");
    assert.strictEqual(rrule.frequency, "secondly");
});

QUnit.test("UTNIL", (assert) => {
    let rrule = RRule.fromString("RRULE:FREQ=YEARLY;UNTIL=19900101");
    assert.strictEqual(rrule.until.valueOf(), new Date(1990, 0, 1).valueOf());

    rrule = RRule.fromString("RRULE:FREQ=YEARLY;UNTIL=19900101T000000");
    assert.strictEqual(rrule.until.valueOf(), new Date(1990, 0, 1).valueOf());

    rrule = RRule.fromString("RRULE:FREQ=YEARLY;UNTIL=19900101T000000Z");
    assert.strictEqual(rrule.until.valueOf(), Date.UTC(1990, 0, 1));
});

QUnit.test("COUNT", (assert) => {
    let rrule = RRule.fromString("RRULE:FREQ=YEARLY;COUNT=23");
    assert.strictEqual(rrule.count, 23);
});

QUnit.test("INTERVAL", (assert) => {
    let rrule = RRule.fromString("RRULE:FREQ=YEARLY;INTERVAL=23");
    assert.strictEqual(rrule.interval, 23);
});

QUnit.test("BYSECOND", (assert) => {
    let rrule = RRule.fromString("RRULE:FREQ=YEARLY;BYSECOND=1");
    assert.deepEqual(rrule.bySecond, [1]);

    rrule = RRule.fromString("RRULE:FREQ=YEARLY;BYSECOND=12");
    assert.deepEqual(rrule.bySecond, [12]);

    rrule = RRule.fromString("RRULE:FREQ=YEARLY;BYSECOND=1,12");
    assert.deepEqual(rrule.bySecond, [1, 12]);
});


QUnit.test("BYMINUTE", (assert) => {
    let rrule = RRule.fromString("RRULE:FREQ=YEARLY;BYMINUTE=1");
    assert.deepEqual(rrule.byMinute, [1]);

    rrule = RRule.fromString("RRULE:FREQ=YEARLY;BYMINUTE=12");
    assert.deepEqual(rrule.byMinute, [12]);

    rrule = RRule.fromString("RRULE:FREQ=YEARLY;BYMINUTE=1,12");
    assert.deepEqual(rrule.byMinute, [1, 12]);
});

QUnit.test("BYHOUR", (assert) => {
    let rrule = RRule.fromString("RRULE:FREQ=YEARLY;BYHOUR=1");
    assert.deepEqual(rrule.byHour, [1]);

    rrule = RRule.fromString("RRULE:FREQ=YEARLY;BYHOUR=12");
    assert.deepEqual(rrule.byHour, [12]);

    rrule = RRule.fromString("RRULE:FREQ=YEARLY;BYHOUR=1,12");
    assert.deepEqual(rrule.byHour, [1, 12]);
});

/**
 * @todo Only nth (the digit before the day) is valid in the YEARLY and MONTHLY
 * freq
 */
QUnit.test("BYDAY", (assert) => {
    let rrule = RRule.fromString("RRULE:FREQ=YEARLY;BYDAY=MO");
    assert.deepEqual(rrule.byDay, [ new Day(1) ]);

    rrule = RRule.fromString("RRULE:FREQ=YEARLY;BYDAY=MO,TU");
    assert.deepEqual(rrule.byDay, [ new Day(1), new Day(2)  ]);

    rrule = RRule.fromString("RRULE:FREQ=YEARLY;BYDAY=+1MO");
    assert.deepEqual(rrule.byDay, [ new Day(1, 1) ]);

    rrule = RRule.fromString("RRULE:FREQ=YEARLY;BYDAY=-1MO,-2TU");
    assert.deepEqual(rrule.byDay, [ new Day(1, -1), new Day(2, -2)  ]);
});

/**
 * @todo Only valid when freq is not weekly
 */
QUnit.test("BYMONTHDAY", (assert) => {
    let rrule = RRule.fromString("RRULE:FREQ=YEARLY;BYMONTHDAY=1");
    assert.deepEqual(rrule.byMonthDay, [1]);

    rrule = RRule.fromString("RRULE:FREQ=YEARLY;BYMONTHDAY=1,12");
    assert.deepEqual(rrule.byMonthDay, [1, 12]);
});

/**
 * @todo Only valid when freq is not daily, weekly, or monthly
 */
QUnit.test("BYYEARDAY", (assert) => {
    let rrule = RRule.fromString("RRULE:FREQ=YEARLY;BYYEARDAY=1");
    assert.deepEqual(rrule.byYearDay, [1]);

    rrule = RRule.fromString("RRULE:FREQ=YEARLY;BYYEARDAY=1,12");
    assert.deepEqual(rrule.byYearDay, [1, 12]);
});

/**
 * @todo Verify range [-53, -1], [1, 53]
 * @todo Only valid when the freq is yearly
 */
QUnit.test("BYWEEKNO", (assert) => {
    let rrule = RRule.fromString("RRULE:FREQ=YEARLY;BYWEEKNO=1");
    assert.deepEqual(rrule.byWeekNumber, [1]);

    rrule = RRule.fromString("RRULE:FREQ=YEARLY;BYWEEKNO=1,12");
    assert.deepEqual(rrule.byWeekNumber, [1, 12]);
});

QUnit.test("BYMONTH", (assert) => {
    let rrule = RRule.fromString("RRULE:FREQ=YEARLY;BYMONTH=1");
    assert.deepEqual(rrule.byMonth, [0]);

    rrule = RRule.fromString("RRULE:FREQ=YEARLY;BYMONTH=1,12");
    assert.deepEqual(rrule.byMonth, [0, 11]);
});

/**
 * @todo Verify range [-366,-1], [1, 366]
 * @todo Only valid with another BYxxx Rule
 */
QUnit.test("BYSETPOS", (assert) => {
    let rrule = RRule.fromString("RRULE:FREQ=MONTHLY;BYDAY=TU,WE,TH;BYSETPOS=3");
    assert.deepEqual(rrule.bySetPosition, [3]);

    rrule = RRule.fromString("RRULE:FREQ=MONTHLY;BYDAY=MO,TU,WE,TH,FR;BYSETPOS=-1,-10");
    assert.deepEqual(rrule.bySetPosition, [-1, -10]);
});

QUnit.test("WKST", (assert) => {
    let rrule = RRule.fromString("RRULE:FREQ=YEARLY;WKST=SU");
    assert.deepEqual(rrule.weekStart, 0);
});
