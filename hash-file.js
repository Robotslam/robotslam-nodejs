const Matrix = require("transformation-matrix-js").Matrix;
const Point = require('./point');
const math = require('mathjs');

const localPoints = [
  [0.0, 1.0],
  [1.0, 1.0],
  [0.0, 0.0]
];

const referencePoints = [
  [55.71901325474455, 13.210973739624023],
  [55.71940000720435, 13.226466178894043],
  [55.708955, 13.210666]
];

const localPointMatrix = math.transpose(math.matrix(localPoints)).resize([3, 3], 1);
const globalPointMatrix = math.transpose(math.matrix(referencePoints)).resize([3, 3], 1);
const transformationMatrix = math.multiply(globalPointMatrix, math.inv(localPointMatrix));
const tM = transformationMatrix.toArray();
const m = Matrix.from( tM[0][0], tM[1][0], tM[0][1], tM[1][1], tM[0][2], tM[1][2] );

for (let i = 0; i <= 1; i += 0.1) {
  result = m.applyToPoint( i, i );
  console.log(result.x + ',' + result.y);
}

for (let i = referencePoints.length - 1; i >= 0; i--) {
  console.log(referencePoints[i][0] + ',' + referencePoints[i][1]);
}
