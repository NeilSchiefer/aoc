import * as fs from 'fs';

const inputFile = process.argv[2] || 'input.txt';

const input = fs.readFileSync(inputFile, { encoding: 'utf8' }).split('\n').filter(mass => mass);
const totalFuel = input
  .map(mass => Math.floor(mass / 3) - 2)
  .reduce((sum, mass) => sum + mass, 0);
console.log('### total fuel: ', totalFuel);
