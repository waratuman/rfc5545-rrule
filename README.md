# RFC5545 RRule

RFC5545 RRule library for JavaScript.

## Installation

Using [NPM](https://www.npmjs.com/):

```bash
npm install rfc5545-rrule
```

Using [Yarn](https://yarnpkg.com/):

```bash
yarn add rfc5545-rrule
```

## Usage

### Node.js

```javascript
let { RRule, Day } = require("rfc5545-rrule");

let rrule = RRule.fromString("RRULE:FREQ=YEARLY;INTERVAL=4;BYMONTH=11;BYDAY=TU;BYMONTHDAY=2,3,4,5,6,7,8");

console.log(rrule);
// RRule {
//     interval: 4,
//     weekStart: 1,
//     frequency: 'yearly',
//     byMonth: [ 10 ],
//     byDay: [ Day { value: 2, nth: undefined } ],
//     byMonthDay: [ 2, 3, 4, 5, 6, 7, 8 ]
// }

// A recurrence that repeats every Sunday of the week.
rrule = new RRule({ frequency: "weekly", byDay: [ new Day(0) ] });
rrule.toString(); // RRULE:FREQ=WEEKLY;BYDAY=SU
```

### TypeScript

```typescript
import { RRule } = from "rfc5545-rrule";

let rrule = RRule.fromString("RRULE:FREQ=YEARLY;INTERVAL=4;BYMONTH=11;BYDAY=TU;BYMONTHDAY=2,3,4,5,6,7,8");
```
## License
[ICS](https://github.com/waratuman/rfc5545-rrule/blob/master/LICENSE)
