import * as fs from 'fs';

const inputFile = process.argv[2] || 'input.txt';

const input = fs.readFileSync(inputFile, { encoding: 'utf8' }).split('\n').filter(mass => mass);
const totalFuel = input
  .map(mass => {
    let fuel = mass;
    let total = 0;
    while (fuel > 0) {
      fuel = Math.floor(fuel/ 3) - 2;
      if (fuel > 0) {
        total = total + fuel;
      }
    }
    return total;
  })
  .reduce((sum, mass) => sum + mass, 0);
console.log('### total fuel: ', totalFuel);
