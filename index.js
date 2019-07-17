// @flow

/*
  This module is a copy of https://github.com/emilcieslar/chi-square-a-b-testing/blob/master/index.js
  with a few modifications.

  We found that, when running in app, the for..in loops were resulting in unexpected results in our
  confidence calculations.

  Eventually, all of these calculations will be moved server-side so that we aren't performing
  this calculation in multiple places
*/

/**
 * Chi-squared statistical significance calculator from http://stats.theinfo.org/
 * which was created by Aaron Swartz (me@aaronsw.com, http://www.aaronsw.com/) and Ben Wikler (https://twitter.com/benwikler)
 */

function degrees_of_freedom(table) {
  return (table.length - 1) * (table[0].length - 1);
}

function expected_value(table, row, column) {
  let sum_row;
  let sum_column;
  let sum_total;
  let i;
  let j;
  sum_row = 0;
  for (i = 0; i < table[row].length; i += 1) {
    sum_row += table[row][i];
  }
  sum_column = 0;
  for (i = 0; i < table.length; i += 1) {
    sum_column += table[i][column];
  }
  sum_total = 0;
  for (i = 0; i < table.length; i += 1) {
    for (j = 0; j < table[i].length; j += 1) {
      sum_total += table[i][j];
    }
  }
  return (sum_row * sum_column) / sum_total;
}

function chisq(table) {
  let result;
  let i;
  let j;
  let unexpected;
  result = 0;
  for (i = 0; i < table.length; i += 1) {
    for (j = 0; j < table[i].length; j += 1) {
      unexpected = table[i][j] - expected_value(table, i, j);
      // eslint-disable-next-line no-restricted-properties
      result += Math.pow(unexpected, 2) / expected_value(table, i, j);
    }
  }
  return result;
}

/* from http://www.fourmilab.ch/rpkp/experiments/analysis/chiCalc.js */

function poz(z) {
  let y;
  let x;
  let w;
  const Z_MAX = 6.0; /* Maximum meaningful z value */

  if (z === 0.0) {
    x = 0.0;
  } else {
    y = 0.5 * Math.abs(z);
    if (y >= Z_MAX * 0.5) {
      x = 1.0;
    } else if (y < 1.0) {
      w = y * y;
      x =
        ((((((((0.000124818987 * w - 0.001075204047) * w + 0.005198775019) * w -
          0.019198292004) *
          w +
          0.059054035642) *
          w -
          0.151968751364) *
          w +
          0.319152932694) *
          w -
          0.5319230073) *
          w +
          0.797884560593) *
        y *
        2.0;
    } else {
      y -= 2.0;
      x =
        (((((((((((((-0.000045255659 * y + 0.00015252929) * y -
          0.000019538132) *
          y -
          0.000676904986) *
          y +
          0.001390604284) *
          y -
          0.00079462082) *
          y -
          0.002034254874) *
          y +
          0.006549791214) *
          y -
          0.010557625006) *
          y +
          0.011630447319) *
          y -
          0.009279453341) *
          y +
          0.005353579108) *
          y -
          0.002141268741) *
          y +
          0.000535310849) *
          y +
        0.999936657524;
    }
  }
  return z > 0.0 ? (x + 1.0) * 0.5 : (1.0 - x) * 0.5;
}

const BIGX = 20.0; /* max value to represent exp(x) */

function ex(x) {
  return x < -BIGX ? 0.0 : Math.exp(x);
}

function pochisq(x, df) {
  const a = 0.5 * x;
  let x1 = x;
  let y;
  let s;
  let e;
  let c;
  let z;
  // eslint-disable-next-line no-bitwise
  const even = !(df & 1); /* True if df is an even number */

  const LOG_SQRT_PI = 0.5723649429247000870717135; /* log(sqrt(pi)) */
  const I_SQRT_PI = 0.5641895835477562869480795; /* 1 / sqrt(pi) */

  if (x1 <= 0.0 || df < 1) {
    return 1.0;
  }

  if (df > 1) {
    y = ex(-a);
  }
  s = even ? y : 2.0 * poz(-Math.sqrt(x1));
  if (df > 2) {
    x1 = 0.5 * (df - 1.0);
    z = even ? 1.0 : 0.5;
    if (a > BIGX) {
      e = even ? 0.0 : LOG_SQRT_PI;
      c = Math.log(a);
      while (z <= x1) {
        e = Math.log(z) + e;
        s += ex(c * z - a - e);
        z += 1.0;
      }
      return s;
    } else {
      e = even ? 1.0 : I_SQRT_PI / Math.sqrt(a);
      c = 0.0;
      while (z <= x1) {
        e *= a / z;
        c += e;
        z += 1.0;
      }
      // $FlowFixMe
      return c * y + s;
    }
  } else {
    return s;
  }
}

function significance(table) {
  // $FlowFixMe
  return 1 - pochisq(chisq(table), degrees_of_freedom(table));
}

// $FlowFixMe
function pValue(table) {
  const sample1 = table[0][0];
  const affected1 = table[0][1];
  const sample2 = table[1][0];
  const affected2 = table[1][1];

  return significance([
    [affected1, sample1 - affected1],
    [affected2, sample2 - affected2]
  ]);
}

module.exports = pValue;
