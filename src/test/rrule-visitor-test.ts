import "qunit";
import { RRule, Frequency, Day } from "../rrule";

QUnit.module("RRule.toString");

QUnit.test("FREQ", (assert) => {
    let rrule = new RRule({ frequency: "yearly" });
    assert.strictEqual(rrule.toString(), "RRULE:FREQ=YEARLY");

    let frequencies: Frequency[] = ["monthly", "weekly", "daily", "hourly", "minutely", "secondly"];
    frequencies.forEach((freq) => {
        rrule.frequency = freq;
        assert.strictEqual(rrule.toString(), "RRULE:FREQ=" + freq.toUpperCase());
    });
});

/**
 * @todo Deal with just dates and timezones
 * RRULE:FREQ=YEARLY;UNTIL=19900101
 * RRULE:FREQ=YEARLY;UNTIL=19900101T000000
 */
QUnit.test("UTNIL", (assert) => {
    let rrule = new RRule({ frequency: "yearly", until: new Date(Date.UTC(1990, 0, 1)) });
    assert.strictEqual(rrule.toString(), "RRULE:FREQ=YEARLY;UNTIL=19900101T000000Z");
});

QUnit.test("COUNT", (assert) => {
    let rrule = new RRule({ frequency: "yearly", count: 20 });
    assert.strictEqual(rrule.toString(), "RRULE:FREQ=YEARLY;COUNT=20");
});

QUnit.test("INTERVAL", (assert) => {
    let rrule = new RRule({ frequency: "yearly", count: 20, interval: 23 });
    assert.strictEqual(rrule.toString(), "RRULE:FREQ=YEARLY;COUNT=20;INTERVAL=23");

    rrule.interval = 1;
    assert.strictEqual(rrule.toString(), "RRULE:FREQ=YEARLY;COUNT=20");
});

QUnit.test("BYSECOND", (assert) => {
    let rrule = new RRule({ frequency: "yearly", count: 20, bySecond: [30] });
    assert.strictEqual(rrule.toString(), "RRULE:FREQ=YEARLY;COUNT=20;BYSECOND=30");

    rrule.bySecond = [0, 30];
    assert.strictEqual(rrule.toString(), "RRULE:FREQ=YEARLY;COUNT=20;BYSECOND=0,30");
});

QUnit.test("BYMINUTE", (assert) => {
    let rrule = new RRule({ frequency: "yearly", count: 20, byMinute: [30] });
    assert.strictEqual(rrule.toString(), "RRULE:FREQ=YEARLY;COUNT=20;BYMINUTE=30");

    rrule.byMinute = [0, 30];
    assert.strictEqual(rrule.toString(), "RRULE:FREQ=YEARLY;COUNT=20;BYMINUTE=0,30");
});

QUnit.test("BYHOUR", (assert) => {
    let rrule = new RRule({ frequency: "yearly", count: 20, byHour: [30] });
    assert.strictEqual(rrule.toString(), "RRULE:FREQ=YEARLY;COUNT=20;BYHOUR=30");

    rrule.byHour = [0, 30];
    assert.strictEqual(rrule.toString(), "RRULE:FREQ=YEARLY;COUNT=20;BYHOUR=0,30");
});

QUnit.test("BYDAY", (assert) => {
    let rrule = new RRule({ frequency: "yearly", count: 20, byDay: [new Day(0)] });
    assert.strictEqual(rrule.toString(), "RRULE:FREQ=YEARLY;COUNT=20;BYDAY=SU");

    rrule.byDay = [ new Day(0), new Day(1) ];
    assert.strictEqual(rrule.toString(), "RRULE:FREQ=YEARLY;COUNT=20;BYDAY=SU,MO");

    rrule.byDay = [ new Day(0), new Day(1, 1) ];
    assert.strictEqual(rrule.toString(), "RRULE:FREQ=YEARLY;COUNT=20;BYDAY=SU,1MO");

    rrule.byDay = [ new Day(0), new Day(1, -1) ];
    assert.strictEqual(rrule.toString(), "RRULE:FREQ=YEARLY;COUNT=20;BYDAY=SU,-1MO");

    rrule.byDay = [ new Day(0, -1), new Day(1, -2) ];
    assert.strictEqual(rrule.toString(), "RRULE:FREQ=YEARLY;COUNT=20;BYDAY=-1SU,-2MO");
});

QUnit.test("BYMONTHDAY", (assert) => {
    let rrule = new RRule({ frequency: "yearly", count: 20, byMonthDay: [1] });
    assert.strictEqual(rrule.toString(), "RRULE:FREQ=YEARLY;COUNT=20;BYMONTHDAY=1");

    rrule.byMonthDay = [1, 12];
    assert.strictEqual(rrule.toString(), "RRULE:FREQ=YEARLY;COUNT=20;BYMONTHDAY=1,12");
});

QUnit.test("BYYEARDAY", (assert) => {
    let rrule = new RRule({ frequency: "yearly", count: 20, byYearDay: [1] });
    assert.strictEqual(rrule.toString(), "RRULE:FREQ=YEARLY;COUNT=20;BYYEARDAY=1");

    rrule.byYearDay = [1, 12];
    assert.strictEqual(rrule.toString(), "RRULE:FREQ=YEARLY;COUNT=20;BYYEARDAY=1,12");
});

QUnit.test("BYWEEKNO", (assert) => {
    let rrule = new RRule({ frequency: "yearly", count: 20, byWeekNumber: [1] });
    assert.strictEqual(rrule.toString(), "RRULE:FREQ=YEARLY;COUNT=20;BYWEEKNO=1");

    rrule.byWeekNumber = [1, 12];
    assert.strictEqual(rrule.toString(), "RRULE:FREQ=YEARLY;COUNT=20;BYWEEKNO=1,12");
});

QUnit.test("BYMONTH", (assert) => {
    let rrule = new RRule({ frequency: "yearly", count: 20, byMonth: [0] });
    assert.strictEqual(rrule.toString(), "RRULE:FREQ=YEARLY;COUNT=20;BYMONTH=1");

    rrule.byMonth = [0, 11];
    assert.strictEqual(rrule.toString(), "RRULE:FREQ=YEARLY;COUNT=20;BYMONTH=1,12");
});

QUnit.test("BYSETPOS", (assert) => {
    let rrule = new RRule({ frequency: "yearly", count: 20, byDay: [new Day(0)], bySetPosition: [3] });
    assert.strictEqual(rrule.toString(), "RRULE:FREQ=YEARLY;COUNT=20;BYDAY=SU;BYSETPOS=3");

    rrule.bySetPosition = [-1, -18];
    assert.strictEqual(rrule.toString(), "RRULE:FREQ=YEARLY;COUNT=20;BYDAY=SU;BYSETPOS=-1,-18");
});

QUnit.test("WKST", (assert) => {
    let rrule = new RRule({ frequency: "weekly", interval: 2, weekStart: 0 });
    assert.strictEqual(rrule.toString(), "RRULE:FREQ=WEEKLY;INTERVAL=2;WKST=SU");

    rrule.weekStart = 2;
    assert.strictEqual(rrule.toString(), "RRULE:FREQ=WEEKLY;INTERVAL=2;WKST=TU");

    rrule.weekStart = 1;
    assert.strictEqual(rrule.toString(), "RRULE:FREQ=WEEKLY;INTERVAL=2");
});
