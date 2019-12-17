import * as fs from 'fs';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  outptu: process.stdout,
});

const inputFile = process.argv[2] || 'input.txt';

console.log('### start');
compute(inputFile).then((result) => {
  console.log('### end');
  process.exit(0);
});

function getOp(opCode) {
  const ops = opCode.toString().split('');

  return {
    op: Number(ops.slice(-2).join('') || ops.slice(-1).join('')),
    modes: ops.length > 2 ? ops.slice(0, -2).reverse() : [],
  }
}

function getParams(opCode, modes, opIdx, input) {
  let idx = 0;
  return opCode.parameters.map(paramIdx => {
    switch(modes[idx++]) {
      case '1':
      case 1:
        return Number(input[opIdx + paramIdx]);
        break;
      default:
        return Number(input[input[opIdx + paramIdx]]);
        break;
    }
  });
}

async function compute(inputFile) {
  const opCodes = {
    1: {
      inputs: [1, 2, 3],
      parameters: [1, 2],
      output: 3,
      c: params => Promise.resolve(params[0] + params[1]),
    },
    2: {
      inputs: [1, 2, 3],
      parameters: [1, 2],
      output: 3,
      c: params => Promise.resolve(params[0] * params[1]),
    },
    3: {
      inputs: [1],
      parameters: [],
      output: 1,
      c: () => new Promise(resolve => {
        rl.question('Enter input: ', answer => {
          resolve(answer);
        });
      }),
    },
    4: {
      inputs: [1],
      parameters: [1],
      output: 1,
      c: params => new Promise(resolve => {
        console.log('### diagnostic: ', params[0]);
        resolve();
      }),
    },
    99: undefined,
  };
  let input = fs.readFileSync(inputFile, { encoding: 'utf8' }).split(',').map(num => Number(num));
  let idx = 0;
  let { modes, op } = getOp(input[idx]);
  while (op !== 99) {
    if (!(op in opCodes)) {
      throw new Error('Invalid op code');
    }

    const params = getParams(opCodes[op], modes, idx, input);
    await opCodes[op].c(params).then(result => {
      if (result !== undefined) {
        input[input[idx + opCodes[op].output]] = result;
      }
    });
    idx = idx + opCodes[op].inputs.length + 1;
    ({ modes, op } = getOp(input[idx]));
  }

  return input[0];
}
