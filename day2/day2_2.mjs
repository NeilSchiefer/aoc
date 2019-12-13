import * as fs from 'fs';

const inputFile = process.argv[2] || 'input.txt';

const { noun, verb } = findTarget(19690720);
console.log(`### noun: ${noun} verb: ${verb}`);
console.log(100 * noun + verb);

function findTarget(target) {
  for (let noun = 0; noun <= 99; noun++) {
    for (let verb = 0; verb <= 99; verb++) {
      if (compute(noun, verb) === target) {
        return { noun, verb };
      }
    }
  }
  return undefined;
}

function compute(noun, verb) {
  const opCodes = {
    1: (a, b) => a + b,
    2: (a, b) => a * b,
    99: undefined,
  };
  let input = fs.readFileSync(inputFile, { encoding: 'utf8' }).split(',').map(num => Number(num));
  input[1] = noun;
  input[2] = verb;
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

  return input[0];
}
