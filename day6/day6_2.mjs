import * as fs from 'fs';

const inputFile = process.argv[2] || 'input.txt';

let orbits = {};
const input = fs.readFileSync(inputFile, { encoding: 'utf8' }).split('\n').filter(line => line);
console.log(input);
const [com, orbit] = input.find(el => el.match(/^COM/)).split(')');

orbits[com] = { orbits: {}, level: 0 };
orbits[com].orbits[orbit] = { orbits: {}, level: 1 };
orbits[com].orbits[orbit] = findOrbits(orbit, input, { orbits: {}, level: 1 });

const branch = findNodeWhereBranched('YOU', 'SAN', orbits);
const you = findNode('YOU', orbits);
const santa = findNode('SAN', orbits);

console.log('### Orbital transfers: ', ((you.level - 1) - branch.level) + ((santa.level - 1) - branch.level));

function findNodeWhereBranched(node1, node2, orbits) {
  return Object.keys(orbits).reduce((node, key) => {
    const orbit = orbits[key];
    //Input only has branches of 2 or less
    if (Object.keys(orbit.orbits).length == 2) {
      const keys = Object.keys(orbit.orbits);
      let hasNode1 = findNode(node1, orbit.orbits[keys[0]].orbits);
      let hasNode2 = findNode(node2, orbit.orbits[keys[1]].orbits);
      if (Object.keys(hasNode1).length && Object.keys(hasNode2).length) {
        return orbit;
      }
      hasNode1 = findNode(node1, orbit.orbits[keys[1]].orbits);
      hasNode2 = findNode(node2, orbit.orbits[keys[0]].orbits);
      if (Object.keys(hasNode1).length && Object.keys(hasNode2).length) {
        return orbit;
      }
      const n = findNodeWhereBranched(node1, node2, orbit.orbits);
      return Object.keys(n).length > 0 ? n : node;
    }
    else if (Object.keys(orbit.orbits).length == 1) {
      const n = findNodeWhereBranched(node1, node2, orbit.orbits);
      return Object.keys(n).length > 0 ? n : node;
    }
    return Object.keys(node).length > 0 ? node : {};
  }, {});
}

function findNode(name, orbits) {
  return Object.keys(orbits).reduce((node, key) => {
    const orbit = orbits[key];
    if (key === name) {
      return orbit;
    }
    if (Object.keys(orbit.orbits).length > 0) {
      const n = findNode(name, orbit.orbits);
      return Object.keys(n).length > 0 ? n : node;
    }
    return Object.keys(node).length > 0 ? node : {};
  }, {});
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
    orbits.orbits[orbit.orbit] = findOrbits(orbit.orbit, input, { orbits: {}, level: orbits.level + 1 });
    orbits.isSanta = orbit.orbit === 'SAN'; 
    orbits.isYou = orbit.orbit === 'YOU';
    return orbits;
  }, orbits);
}
