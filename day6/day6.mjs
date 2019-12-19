import * as fs from 'fs';

const inputFile = process.argv[2] || 'input.txt';

let orbits = {};
const input = fs.readFileSync(inputFile, { encoding: 'utf8' }).split('\n').filter(line => line);
console.log(input);
const [com, orbit] = input.find(el => el.match(/^COM/)).split(')');

orbits[com] = { orbits: {}, count: 0 };
orbits[com].orbits[orbit] = { orbits: {}, count: 1 };
orbits[com].orbits[orbit] = findOrbits(orbit, input, { orbits: {}, count: 1 });

console.log('### orbit count: ', countOrbits(orbits));

function countOrbits(orbits) {
  return Object.keys(orbits).reduce((count, key) => {
    const orbit = orbits[key];
    return count + orbit.count + (Object.keys(orbit.orbits).length > 0 ? countOrbits(orbit.orbits) : 0);
  }, 0);
}

function findOrbits(com, input, orbits) {
  const reg = new RegExp(`^${com}[)]`);
  return input.filter(el => el.match(reg)).map(el => {
    const [com, orbit] = el.split(')');
    return {
      com,
      orbit
    };
  }).reduce((orbits, orbit) => {
    orbits.orbits[orbit.orbit] = findOrbits(orbit.orbit, input, { orbits: {}, count: orbits.count + 1 });
    return orbits;
  }, orbits);
}
