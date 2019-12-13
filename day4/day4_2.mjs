const min = Number(process.argv[2]) || 111111;
const max = Number(process.argv[3]) || 999999;

if (min < 100000 || min > 999999) {
  throw new Error('min must be exactly 6 digits');
}

if (max < 100000 || max > 999999) {
  throw new Error('max must be exactly 6 digits');
}

let matched = 0;
for (let i = min; i <= max; i++) {
  const digits = i.toString().split('');
  if (!hasAdjacent(digits)) {
    continue;
  }
  if (isDecreasing(digits)) {
    continue;
  }
  matched++;
}
console.log('### matched: ', matched);

function hasAdjacent(digits) {
  const digitsString = digits.join('');
  const matches = digitsString.match(/(0+|1+|2+|3+|4+|5+|6+|7+|8+|9+)/g);
  if (matches && matches.find(match => match.length == 2)) {
    return true;
  }
  return false;
}

function isDecreasing(digits) {
  for (let i = 0; i < digits.length; i++) {
    for (let j = i + 1; j < digits.length; j++) {
      if (digits[i] > digits[j]) {
        return true;
      }
    }
  }
  return false;
}
