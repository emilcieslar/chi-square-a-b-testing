# Statistical significance for A/B testing (using chi-square)

Npm module for calculating chi-square test that gives us p-value for statistical significance with practical use in A/B testing.

## Installation

    `npm install --save-dev chi-square-a-b-testing`

## Usage

Let's consider we have two ad variations - each variation has been displayed 50 times. The first ad was clicked 1, whereas the second ad was clicked 5 times. Is the difference statistically significant? Let's find out using chi-square test
```
* * * * * * * * * * *
* SAMPLE | CLICKED  *
* 50     | 1        * - ad variation 1
* 50     | 5        * - ad variation 2
* * * * * * * * * * *
```

```js
var test = require('chi-square-a-b-testing');

// Set up our sample values
const table = [
    [50, 1],
    [50, 5]
];

// Calculate the p-value
let pValue = test(table); // 0.9078770365273039
```

In this case the `pValue = 0.9078770365273039`, which means we **cannot** consider the difference between those two variations statistically significant if we set our threshold to 0.5 (which is usually the case for a standard experiment).

## Acknowledgement
The JavaScript implementation of chi-square test was done by http://stats.theinfo.org/ ([Aaron Swartz](http://www.aaronsw.com/) and [Ben Wikler](https://twitter.com/benwikler))
