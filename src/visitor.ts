import { RRule, Frequency, Weekday, Day } from "./rrule";

const weekdays = [ "SU", "MO", "TU", "WE", "TH", "FR", "SA" ];

function pad(num: number) {
    return num < 10 ? "0" + num : num;
}

export function visitRRule(rrule: RRule): string {
    const recur = [];

    recur.push(visitRRuleFrequency(rrule.frequency));

    if (rrule.until) {
        recur.push(visitRRuleUntil(rrule.until));
    }

    if (rrule.count) {
        recur.push(visitRRuleCount(rrule.count));
    }

    if (rrule.interval !== 1) {
        recur.push(visitRRuleInterval(rrule.interval));
    }

    if (rrule.bySecond) {
        recur.push(visitRRuleBySecond(rrule.bySecond));
    }

    if (rrule.byMinute) {
        recur.push(visitRRuleByMinute(rrule.byMinute));
    }

    if (rrule.byHour) {
        recur.push(visitRRuleByHour(rrule.byHour));
    }

    if (rrule.byDay) {
        recur.push(visitRRuleByDay(rrule.byDay));
    }

    if (rrule.byMonthDay) {
        recur.push(visitRRuleByMonthDay(rrule.byMonthDay));
    }

    if (rrule.byYearDay) {
        recur.push(visitRRuleByYearDay(rrule.byYearDay));
    }

    if (rrule.byWeekNumber) {
        recur.push(visitRRuleByWeekNumber(rrule.byWeekNumber));
    }

    if (rrule.byMonth) {
        recur.push(visitRRuleByMonth(rrule.byMonth));
    }

    if (rrule.bySetPosition) {
        recur.push(visitRRuleBySetPosition(rrule.bySetPosition));
    }

    if (rrule.weekStart !== 1) {
        recur.push(visitRRuleWeekstart(rrule.weekStart));
    }

    return "RRULE:" + recur.join(";");
}

function visitRRuleFrequency(freq: Frequency): string {
    return "FREQ=" + freq.toUpperCase();
}

function visitRRuleUntil(until: Date): string {
    return "UNTIL=" +
        until.getUTCFullYear() +
        pad(until.getUTCMonth() + 1) +
        pad(until.getUTCDate()) +
        "T" +
        pad(until.getUTCHours()) +
        pad(until.getUTCMinutes()) +
        pad(until.getUTCSeconds()) +
        "Z";
}

function visitNumber(field: string, values: number | number[]) {
    if (Array.isArray(values)) {
        return field + "=" + values.join(",");
    }

    return field + "=" + values;
}

const visitRRuleCount = (count: number): string => visitNumber("COUNT", count);

const visitRRuleInterval = (interval: number): string => visitNumber("INTERVAL", interval);

const visitRRuleBySecond = (v: number[]) => visitNumber("BYSECOND", v);

const visitRRuleByMinute = (v: number[]) => visitNumber("BYMINUTE", v);

const visitRRuleByHour = (v: number[]) => visitNumber("BYHOUR", v);

function visitRRuleByDay(values: Day[]) {
    return "BYDAY=" + values.map(v => (v.nth || "") + weekdays[v.value]).join(",");
}

const visitRRuleByMonthDay = (v: number[]) => visitNumber("BYMONTHDAY", v);

const visitRRuleByYearDay = (v: number[]) => visitNumber("BYYEARDAY", v);

const visitRRuleByWeekNumber = (v: number[]) => visitNumber("BYWEEKNO", v);

const visitRRuleByMonth = (v: number[]) => visitNumber("BYMONTH", v.map(x => x + 1));

const visitRRuleBySetPosition = (v: number[]) => visitNumber("BYSETPOS", v);

function visitRRuleWeekstart(start: Weekday) {
    return "WKST=" + weekdays[start];
}
