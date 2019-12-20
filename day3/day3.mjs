import * as fs from 'fs';

const inputFile = process.argv[2] || 'input.txt';

const input = fs.readFileSync(inputFile, { encoding: 'utf8' }).split('\n');

const w1 = input[0].split(',').map(parseDirections);
const w2 = input[1].split(',').map(parseDirections);

const points1Set = new Set();
w1.reduce(reduceEndpoints, [{ start: { x: 0, y: 0 } }])
  .reduce(reduceExpandedPoints, []).forEach(point => {
    points1Set.add(`${point.x}_${point.y}`);
  });
const points2Set = new Set();
w2.reduce(reduceEndpoints, [{ start: { x: 0, y: 0 } }])
  .reduce(reduceExpandedPoints, []).forEach(point => {
    points2Set.add(`${point.x}_${point.y}`);
  });

const crossings = new Set(
  [...points1Set].filter(point => points2Set.has(point) && point !== '0_0'),
);

const mDistance = Array.from(crossings).reduce((min, cross) => {
  const [x, y] = cross.split('_');
  const distance = Math.abs(x) + Math.abs(y);
  if (distance < min) {
    min = distance;
  }
  return min;
}, 9999);
console.log('### Manhattan distance: ', mDistance);

function reduceEndpoints (points, dir, idx, src)  {
  const direction = getDirection(dir.dir);
  points[idx].end = {
    x: (points[idx].start.x + (dir.len * direction.x)),
    y: (points[idx].start.y + (dir.len * direction.y)),
  };
  points[idx].points = generatePoints(points[idx].start, points[idx].end, direction);
  if (idx !== src.length - 1) {
    points = points.concat({
      start: points[idx].end,
    });
  }
  return points;
}

function reduceExpandedPoints(expandedPoints, point)  {
  return expandedPoints.concat(point.points);
}

function generateUp(start, end) {
  let points = [];
  const x = start.x;
  for (let y=start.y; y<=end.y; y++) {
    points.push({ x, y });
  }
  return points;
}

function generateDown(start, end) {
  let points = [];
  const x = start.x;
  for (let y=start.y; y>=end.y; y--) {
    points.push({ x, y });
  }
  return points;
}

function generateLeft(start, end) {
  let points = [];
  const y = start.y;
  for (let x=start.x; x>=end.x; x--) {
    points.push({ x, y });
  }
  return points;
}

function generateRight(start, end) {
  let points = [];
  const y = start.y;
  for (let x=start.x; x<=end.x; x++) {
    points.push({ x, y });
  }
  return points;
}

function generatePoints(start, end, direction) {
  if (direction.x === 0 &&  direction.y === 1) {
    return generateUp(start, end);
  }
  if (direction.x === 0 &&  direction.y === -1) {
    return generateDown(start, end);
  }
  if (direction.x === 1 &&  direction.y === 0) {
    return generateRight(start, end);
  }
  if (direction.x === -1 &&  direction.y === 0) {
    return generateLeft(start, end);
  }
  return [];
}

function getDirection(dir) {
  switch(dir) {
    case 'U':
      return { x: 0, y: 1 };
      break;
    case 'D':
      return { x: 0, y: -1 };
      break;
    case 'R':
      return { x: 1, y: 0 };
      break;
    case 'L':
      return { x: -1, y: 0 };
      break;
  }
}

function parseDirections(dir) {
  const matches = dir.split(/^(.)(.+)/);
  return {
    dir: matches[1].trim(),
    len: Number(matches[2]),
  };
}
