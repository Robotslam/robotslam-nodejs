const Point = require('./point');

// Stolen from Leaflet.js source
function Bounds(a, b) {
  if (!a) { return; }

  var points = b ? [a, b] : a;

  for (var i = 0, len = points.length; i < len; i++) {
    this.extend(points[i]);
  }
}


Bounds.prototype = {
  // @method extend(point: Point): this
  // Extends the bounds to contain the given point.
  extend: function (point) { // (Point)
    // @property min: Point
    // The top left corner of the rectangle.
    // @property max: Point
    // The bottom right corner of the rectangle.
    if (!this.min && !this.max) {
      this.min = point.clone();
      this.max = point.clone();
    } else {
      this.min.x = Math.min(point.x, this.min.x);
      this.max.x = Math.max(point.x, this.max.x);
      this.min.y = Math.min(point.y, this.min.y);
      this.max.y = Math.max(point.y, this.max.y);
    }
    return this;
  },

  // @method getCenter(round?: Boolean): Point
  // Returns the center point of the bounds.
  getCenter: function (round) {
    return new Point(
            (this.min.x + this.max.x) / 2,
            (this.min.y + this.max.y) / 2, round);
  },

  // @method getBottomLeft(): Point
  // Returns the bottom-left point of the bounds.
  getBottomLeft: function () {
    return new Point(this.min.x, this.max.y);
  },

  // @method getTopRight(): Point
  // Returns the top-right point of the bounds.
  getTopRight: function () { // -> Point
    return new Point(this.max.x, this.min.y);
  },

  // @method getSize(): Point
  // Returns the size of the given bounds
  getSize: function () {
    return this.max.subtract(this.min);
  }
}

module.exports = Bounds;
