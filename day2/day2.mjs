import * as fs from 'fs';

const inputFile = process.argv[2] || 'input.txt';

let input = fs.readFileSync(inputFile, { encoding: 'utf8' }).split(',').map(num => Number(num));

const opCodes = {
  1: (a, b) => a + b,
  2: (a, b) => a * b,
  99: undefined,
};

let idx = 0;
let op = input[idx];
while (op !== 99) {
  if (!op in opCodes) {
    throw new Error('Invalid op code');
  }
  input[input[idx + 3]] = opCodes[op](input[input[idx + 1]], input[input[idx + 2]]);
  idx = idx + 4; 
  op = input[idx];
}
console.log(input.join(','));
