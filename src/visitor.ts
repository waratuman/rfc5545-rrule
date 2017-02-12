import { RRule, Frequency, Weekday, Day } from "./rrule";

const weekdays = [ "SU", "MO", "TU", "WE", "TH", "FR", "SA" ];

function pad(num: number) {
    return num < 10 ? "0" + num : num;
}

export function visitRRule(rrule: RRule): string {
    const recur: string[] = [];
    let collected: string | undefined;

    recur.push(visitRRuleFrequency(rrule.frequency));

    if (rrule.until) {
        recur.push(visitRRuleUntil(rrule.until));
    }

    if (rrule.count) {
        collected = visitRRuleCount(rrule.count);
        if (collected) {
            recur.push(collected);
        }
    }

    if (rrule.interval !== 1) {
        collected = visitRRuleInterval(rrule.interval);
        if (collected) {
            recur.push(collected);
        }
    }

    if (rrule.bySecond) {
        collected = visitRRuleBySecond(rrule.bySecond);
        if (collected) {
            recur.push(collected);
        }
    }

    if (rrule.byMinute) {
        collected = visitRRuleByMinute(rrule.byMinute);
        if (collected) {
            recur.push(collected);
        }
    }

    if (rrule.byHour) {
        collected = visitRRuleByHour(rrule.byHour);
        if (collected) {
            recur.push(collected);
        }
    }

    if (rrule.byDay) {
        collected = visitRRuleByDay(rrule.byDay);
        if (collected) {
            recur.push(collected);
        }
    }

    if (rrule.byMonthDay) {
        collected = visitRRuleByMonthDay(rrule.byMonthDay);
        if (collected) {
            recur.push(collected);
        }
    }

    if (rrule.byYearDay) {
        collected = visitRRuleByYearDay(rrule.byYearDay);
        if (collected) {
            recur.push(collected);
        }
    }

    if (rrule.byWeekNumber) {
        collected = visitRRuleByWeekNumber(rrule.byWeekNumber);
        if (collected) {
            recur.push(collected);
        }
    }

    if (rrule.byMonth) {
        collected = visitRRuleByMonth(rrule.byMonth);
        if (collected) {
            recur.push(collected);
        }
    }

    if (rrule.bySetPosition) {
        collected = visitRRuleBySetPosition(rrule.bySetPosition);
        if (collected) {
            recur.push(collected);
        }
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

function visitNumber(field: string, values: number | number[]): string | undefined {
    if (Array.isArray(values)) {
        if (values.length > 0) {
            return field + "=" + values.join(",");
        }

        return;
    }

    return field + "=" + values;
}

const visitRRuleCount = (count: number): string | undefined => visitNumber("COUNT", count);

const visitRRuleInterval = (interval: number): string | undefined => visitNumber("INTERVAL", interval);

const visitRRuleBySecond = (v: number[]) => visitNumber("BYSECOND", v);

const visitRRuleByMinute = (v: number[]) => visitNumber("BYMINUTE", v);

const visitRRuleByHour = (v: number[]) => visitNumber("BYHOUR", v);

function visitRRuleByDay(values: Day[]): string | undefined {
    if (values.length === 0) {
        return;
    }
    return "BYDAY=" + values.map(v => (v.nth || "") + weekdays[v.value]).join(",");
}

const visitRRuleByMonthDay = (v: number[]) => visitNumber("BYMONTHDAY", v);

const visitRRuleByYearDay = (v: number[]) => visitNumber("BYYEARDAY", v);

const visitRRuleByWeekNumber = (v: number[]) => visitNumber("BYWEEKNO", v);

const visitRRuleByMonth = (v: number[]) => visitNumber("BYMONTH", v.map(x => x + 1));

const visitRRuleBySetPosition = (v: number[]) => visitNumber("BYSETPOS", v);

function visitRRuleWeekstart(start: Weekday | number) {
    return "WKST=" + weekdays[start];
}
