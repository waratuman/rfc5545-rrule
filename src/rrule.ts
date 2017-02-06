import { Parser } from "nearley";

import { visitRRule } from "./visitor";
import { ParserRules, ParserStart } from "./grammar";

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type Frequency = "secondly" | "minutely" | "hourly" | "daily" | "weekly" | "monthly" | "yearly";

export type Month = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export class Day {

    /**
     * If present, it indicates the nth occurence of a specific day within the
     * yearly or monthly frequency. Only valid if the freq is yearly or monthly.
     * Valid values are [-53, -1] and [1, 53]
     */
    nth?: number;

    /** The number representation of the week day (0 for Sunday, 1 for Monday, etc). */
    value: Weekday;

    constructor(weekDay: Weekday, nth?: number) {
        this.value = weekDay;
        this.nth = nth;
    }

}

export interface Options {
    frequency: Frequency;
    until?: Date;
    count?: number;
    interval?: number;
    bySecond?: number[];
    byMinute?: number[];
    byHour?: number[];
    byDay?: Day[];
    byMonthDay?: number[];
    byYearDay?: number[];
    byWeekNumber?: number[];
    byMonth?: number[];
    bySetPosition?: number[];
    weekStart?: number;
}

export class RRule implements Options {

    /**
     * The frequency of the recurrence. Valid values are "secondly",
     * "minutely", "hourly", "daily", "weekly", "monthly", and "yearly".
     */
    frequency: Frequency;

    /**
     * The datetime that is the upper bound of the recurrence (inclusive). If
     * neither the `until` or `count` property is present this recurrence is
     * considered to repeat forever.
     *
     * Either the `until` or the `count` property may be specified, but no both.
     */
    until: Date;

    /**
     * The number of occurences in this recurrence.
     *
     * Either the `until` or the `count` property may be specified, but no both.
     */
    count: number;

    /** The interval at which the recurrence repeats. Defaults to 1. */
    interval: number = 1;

    /** The second(s) on which the recurrence repeats. Valid values are 0 - 60. */
    bySecond: number[];

    /** The minute(s) on which the recurrence repeats. Valid values are 0 - 59 */
    byMinute: number[];

    /** The hour(s) on which the recurrence repeats. Valid values are 0 - 23 */
    byHour: number[];

    /** The day(s) on which this recurrence repeats. See Day */
    byDay: Day[];

    /** The month day(s) of the month on which this recurrence repeats. Valid values are
     * [-31, -1] and [1, 31]. Not valid when the frequency is weekly.
     */
    byMonthDay: number[];

    /** The year day(s) of the year on which this recurrence repeats. Valid values are
     * [-366, -1] and [1, 366]. Not valid when the frequency is daily, weekly,
     * or monthly.
     */
    byYearDay: number[];

    /**
     * The week number(s) (as defined by [ISO.8601.2004](https://tools.ietf.org/html/rfc5545#ref-ISO.8601.2004))
     * on which this occurence repeats. Valid values are [-53, -1] and [1, 53].
     * A week is defined as a seven day period, starting on the day of the week
     * defined to be the week start. Not valid when the frequency is not yearly.
     */
    byWeekNumber: number[];

    /** The month(s) on which the recurrence repeats. Valid values are 0 - 11,
     * with 0 being January and 11 being December.
     */
    byMonth: Month[];

    bySetPosition: number[];

    /**
     * Specifies the day on which the week starts. Defaults to 1 (Monday).
     */
    weekStart: Weekday = 1;

    constructor(options: Options) {
        (Object as any).assign(this, options);
    }

    static fromString(value: string): RRule {
        let parser = new Parser(ParserRules, ParserStart);
        parser.feed(value);
        let results = parser.finish();

        if (results.length > 1) {
            throw new Error("Ambiguous parsing of RRule");
        }

        return results[0];
    }

    toString() {
        return visitRRule(this);
    }

}