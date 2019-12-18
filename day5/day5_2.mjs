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
}).catch(err => {
  console.log('### error: ', err);
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
      c: params => Promise.resolve({ jmp: false, result: params[0] + params[1] }),
    },
    2: {
      inputs: [1, 2, 3],
      parameters: [1, 2],
      output: 3,
      c: params => Promise.resolve({ jmp: false, result: params[0] * params[1] }),
    },
    3: {
      inputs: [1],
      parameters: [],
      output: 1,
      c: () => new Promise(resolve => {
        rl.question('Enter input: ', answer => {
          resolve({ jmp: false, result: answer });
        });
      }),
    },
    4: {
      inputs: [1],
      parameters: [1],
      output: undefined,
      c: params => new Promise(resolve => {
        console.log('### diagnostic: ', params[0]);
        resolve({});
      }),
    },
    5: {
      inputs: [1, 2],
      parameters: [1, 2],
      output: undefined,
      c: params => Promise.resolve({ jmp: params[0] !== 0, result: params[0] !== 0 ? params[1] : undefined }),
    },
    6: {
      inputs: [1, 2],
      parameters: [1, 2],
      output: undefined,
      c: params => Promise.resolve({ jmp: params[0] === 0, result: params[0] === 0 ? params[1] : undefined }),
    },
    7: {
      inputs: [1, 2, 3],
      parameters: [1, 2],
      output: 3,
      c: params => Promise.resolve({ jmp: false, result: params[0] < params[1] ? 1 : 0 }),
    },
    8: {
      inputs: [1, 2, 3],
      parameters: [1, 2],
      output: 3,
      c: params => Promise.resolve({ jmp: false, result: params[0] === params[1] ? 1 : 0 }),
    },
    99: undefined,
  };
  let input = fs.readFileSync(inputFile, { encoding: 'utf8' }).split(',').map(num => Number(num));
  let idx = 0;
  let { modes, op } = getOp(input[idx]);
  let jumped = false;
  while (op !== 99) {
    if (!(op in opCodes)) {
      throw new Error('Invalid op code');
    }

    const params = getParams(opCodes[op], modes, idx, input);
    await opCodes[op].c(params).then(result => {
      if (!result.jmp && result.result !== undefined) {
        input[input[idx + opCodes[op].output]] = Number(result.result);
      } else if (result.jmp) {
        idx = result.result;
        jumped = true;
      }
    });
    if (!jumped) {
      idx = idx + opCodes[op].inputs.length + 1;
    }
    ({ modes, op } = getOp(input[idx]));
    jumped = false;
  }

  return input[0];
}
