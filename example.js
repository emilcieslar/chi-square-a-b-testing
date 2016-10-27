var test = require('./index');

/**
 * Let's consider a two ad variations
 * Each ad has been displayed 50 times.
 * The first ad was clicked 1, whereas the second ad was clicked 5 times.
 * Is the difference statistically significant?
 * Let's find out using chi-square test
 *
 *    * * * * * * * * * * *
 *    * SAMPLE | AFFECTED *
 * 1. * 50     | 1        *
 * 2. * 50     | 5        *
 *    * * * * * * * * * * *
 */

let sample1 = 50,
    affected1 = 1,
    sample2 = 50,
    affected2 = 5;

const table = [
    [50, 1],
    [50, 5]
];

let pValue = test(table);

console.log(pValue);
