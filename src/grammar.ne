@{%

import { RRule, Day, Options } from "./rrule";

function flatten<T>(arr: T[]): T[] {
    return arr.reduce<T[]>((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);
}

function id(x: any[]): any {
    return x[0];
}

function joiner(d: any[]): string {
    return d.join("");
}

function arrconcat(d: any[]): any[] {
    return [d[0]].concat(d[1]);
}

function noresult(): void {
    return undefined;
}

function integer(d: string[]): number {
    return parseInt(d.join(""), 10);
}

function rrule(data: any[]): RRule {
    let options = {};
    data[3].forEach((recurRule: any[]) => {
        options[recurRule[0]] = recurRule[1];
    });

    return new RRule(options as Options);
}

%}

rrule -> "RRULE" rrulparam ":" recur CRLF:?
    {% rrule %}

rrulparam -> (";" otherParam):*

otherParam -> ianaParam
 | xParam

ianaParam -> ianaToken "=" paramValue ("," paramValue):*

ianaToken -> (ALPHA | DIGIT | "-"):+

paramValue -> paramtext | quotedString

paramtext -> SAFECHAR:*

quotedString -> DQUOTE QSAFECHAR:* DQUOTE

xParam -> xName "=" paramValue ("," paramValue):*

xName -> "X-" (vendorid "-"):? (ALPHA | DIGIT | "-"):+

vendorid -> (ALPHA | DIGIT) (ALPHA | DIGIT) (ALPHA | DIGIT):+

recur -> recurRulePart ( ";" recurRulePart ):* {% (data: any[]) => [data[0]].concat(data[1].map((d: any) => d[1])) %}

recurRulePart -> "FREQ" "=" freq    {% (data: any[]) => [ "frequency", data[2][0].toLowerCase()] %}
    | "UNTIL" "=" enddate           {% (data: any[]) => [ "until", data[2][0]] %}
    | "COUNT" "=" DIGIT:+           {% (data: any[]) => [ "count", parseInt(data[2].join(""), 10) ] %}
    | "INTERVAL" "=" DIGIT:+        {% (data: any[]) => [ "interval", parseInt(data[2].join(""), 10) ] %}
    | "BYSECOND" "=" byseclist      {% (data: any[]) => [ "bySecond", data[2] ] %}
    | "BYMINUTE" "=" byminlist      {% (data: any[]) => [ "byMinute", data[2] ] %}
    | "BYHOUR" "=" byhrlist         {% (data: any[]) => [ "byHour",   data[2] ] %}
    | "BYDAY" "=" bywdaylist        {% (data: any[]) => [ "byDay",   data[2] ] %}
    | "BYMONTHDAY" "=" bymodaylist  {% (data: any[]) => [ "byMonthDay",   data[2] ] %}
    | "BYYEARDAY" "=" byyrdaylist   {% (data: any[]) => [ "byYearDay",   data[2] ] %}
    | "BYWEEKNO" "=" bywknolist     {% (data: any[]) => [ "byWeekNumber",   data[2] ] %}
    | "BYMONTH" "=" bymolist        {% (data: any[]) => [ "byMonth",   data[2] ] %}
    | "BYSETPOS" "=" bysplist       {% (data: any[]) => [ "bySetPosition",   data[2] ] %}
    | "WKST" "=" weekday            {% (data: any[]) => [ "weekStart",   data[2] ] %}

freq -> "SECONDLY"
    | "MINUTELY"
    | "HOURLY"
    | "DAILY"
    | "WEEKLY"
    | "MONTHLY"
    | "YEARLY"

enddate ->  date
    | dateTime

date -> dateValue
    {% (d: any) => new Date(d[0][0], d[0][1], d[0][2]) %}

dateValue -> dateFullyear dateMonth dateMday

dateFullyear -> DIGIT DIGIT DIGIT DIGIT
    {% integer %}

dateMonth -> DIGIT DIGIT
    {% (d: any) => (integer(d) - 1) %}

dateMday -> DIGIT DIGIT
    {% integer %}

dateTime -> dateValue "T" time
    {% (d: any) => {
        if (d[2][3]) {
            return new Date(Date.UTC(d[0][0], d[0][1], d[0][2], d[2][0], d[2][1], d[2][2]));
        }

        return new Date(d[0][0], d[0][1], d[0][2], d[2][0], d[2][1], d[2][2]);
    } %}

time -> timeHour timeMinute timeSecond timeUTC:?

timeHour -> DIGIT DIGIT
    {% integer %}

timeMinute -> DIGIT DIGIT
    {% integer %}

timeSecond -> DIGIT DIGIT
    {% integer %}

timeUTC -> "Z" {% () => true %}

byseclist -> seconds ("," seconds):*
    {% (data: any[]) => [data[0]].concat(data[1].map((d: any) => d[1])) %}

seconds -> DIGIT DIGIT:?
    {% integer %}

byminlist -> minutes ("," minutes):*
    {% (data: any[]) => [data[0]].concat(data[1].map((d: any) => d[1])) %}

minutes -> DIGIT DIGIT:?
    {% integer %}

byhrlist -> hour ("," hour):*
    {% (data: any[]) => [data[0]].concat(data[1].map((d: any) => d[1])) %}

hour -> DIGIT DIGIT:?
    {% integer %}

bywdaylist -> weekdaynum ("," weekdaynum):*
    {% (data: any[]) => [data[0]].concat(data[1].map((d: any) => d[1])) %}

weekdaynum -> ((plus | minus):? ordwk):? weekday
    {%
        (data: any[]) => new Day(data[1], data[0] ? integer(flatten<string>(data[0])) : undefined)
    %}

plus -> "+"

minus -> "-"

ordwk -> DIGIT DIGIT:?

weekday -> "SU" {% () => 0 %}
    | "MO"      {% () => 1 %}
    | "TU"      {% () => 2 %}
    | "WE"      {% () => 3 %}
    | "TH"      {% () => 4 %}
    | "FR"      {% () => 5 %}
    | "SA"      {% () => 6 %}

bymodaylist -> monthdaynum ("," monthdaynum):*
    {% (data: any[]) => [data[0]].concat(data[1].map((d: any) => d[1])) %}

monthdaynum -> (plus | minus):? ordmoday
    {% integer %}

ordmoday -> DIGIT DIGIT:?
    {% integer %}

byyrdaylist -> yeardaynum ("," yeardaynum):*
    {% (data: any[]) => [data[0]].concat(data[1].map((d: any) => d[1])) %}

yeardaynum -> (plus | minus):? ordyrday
    {% integer %}

ordyrday -> DIGIT (DIGIT DIGIT:?):?
    {% (data: any[]) => integer(flatten(data)) %}

bywknolist -> weeknum ("," weeknum):*
    {% (data: any[]) => [data[0]].concat(data[1].map((d: any) => d[1])) %}

weeknum -> (plus | minus):? ordwk
    {% (data: any[]) => integer(flatten(data)) %}

bymolist -> monthnum ("," monthnum):*
    {% (data: any[]) => [data[0]].concat(data[1].map((d: any) => d[1])) %}

monthnum -> DIGIT DIGIT:?
    {% (d: any) => (integer(d) - 1) %}

bysplist -> setposday ("," setposday):*
    {% (data: any[]) => [data[0]].concat(data[1].map((d: any) => d[1])) %}

setposday -> yeardaynum
    {% (d: any) => d[0] %}

ALPHA -> [\x41-\x5A]
    | [\x61-\x7A]

DIGIT -> [\x30-\x39]

DQUOTE -> [\x22]

CRLF -> CR LF

CR -> [\x0D]

LF -> [\x0A]

WSP -> SP
    | HTAB

SP -> [\x20]

HTAB -> [\x09]

QSAFECHAR -> WSP
    | [\x21]
    | [\x23-\x7E]
    | NONUSASCII

SAFECHAR -> WSP
    | [\x21]
    | [\x23-\x2B]
    | [\x2D-\x39]
    | [\x3C-\x7E]

NONUSASCII -> UTF82 | UTF83 | UTF84

UTF82 -> [\xC2-\xDF] UTF8Tail

UTF83 -> [\xE0] [\xA0-\xBF] UTF8Tail
    | [\xE1-\xEC] UTF8Tail UTF8Tail
    | [\xED] [\x80-\x9F] UTF8Tail
    | [\xEE-\xEF] UTF8Tail UTF8Tail

UTF84 -> [\xF0] [\x90-\xBF] UTF8Tail UTF8Tail
    | [\xF1-\xF3] UTF8Tail UTF8Tail UTF8Tail
    | [\xF4] [\x80-\x8F] UTF8Tail UTF8Tail

UTF8Tail -> [\x80-\xBF]
