const fs = require('fs');
const roslib = require('roslib');

class MoveBaseClient {
  constructor(ros) {
    this._ros = ros;

    this.actionClient = new roslib.ActionClient({
      ros: this._ros,
      serverName: '/move_base_persistent',
      actionName: 'move_base_msgs/MoveBaseAction',
      omitFeedback: true,
      omitStatus: true,
      omitResult: true
    });
  }

  moveTo(position, orientation) {
    if (position === undefined) {
      // Hector exploration doesn't play well with move_base when
      // the goal is placed exactly where the robot is. This usually
      // happens when gmapping has just started and the position is
      // set to (0, 0, 0) by default. Therefore, set something random below.
      position = { x: 1.11, y: 2.22, z: 0.0 };
    }

    if (orientation === undefined) {
      // z cant be zero or ros complains:
      // Quaternion has length close to zero... discarding as navigation goal
      orientation = { x: 0.0, y: 0.0, z: 1.0, w: 0.0 };
    }

    const goal = new roslib.Goal({
      actionClient : this.actionClient,
      goalMessage : {
        target_pose: {
          header: {
            seq: 0,
            stamp: {
              secs: 0,
              nsecs: 0
            },
            frame_id: 'map'
          },
          pose: {
            position: position,
            orientation: orientation
          }
        }
      }
    });

    // Print out their output into the terminal. We don't care.
    // goal.on('feedback', function(feedback) {
    //   console.log('Feedback: ' + feedback.sequence);
    // });

    // goal.on('result', function(result) {
    //   console.log('Final Result: ' + result.sequence);
    // });

    goal.send();
  }

  stop() {
    this.actionClient.cancel();
  }

}
module.exports = MoveBaseClient;

