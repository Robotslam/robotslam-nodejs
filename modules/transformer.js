const Matrix = require("transformation-matrix-js").Matrix;
const math = require('mathjs');

class Transformer {
  constructor(description) {
    const offset = description.origin;
    const points = description.gps_references;
    const localPoints = points.map((point) => {return [point.x + offset[0], point.y + offset[1]]});
    const referencePoints = points.map((point) => {return [point.lat, point.lng]});
    const localPointMatrix = math.transpose(math.matrix(localPoints)).resize([3, 3], 1);
    const globalPointMatrix = math.transpose(math.matrix(referencePoints)).resize([3, 3], 1);
    const transformationMatrix = math.multiply(globalPointMatrix, math.inv(localPointMatrix));
    const tM = transformationMatrix.toArray();
    this.m = Matrix.from( tM[0][0], tM[1][0], tM[0][1], tM[1][1], tM[0][2], tM[1][2] );
  }

  transformPoint(x, y) {
    return this.m.applyToPoint(x, y);
  }
}

module.exports = Transformer;
