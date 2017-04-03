const https = require('https');
const querystring = require('querystring');

class CPS {
  constructor(subscriberNumber, buildingId, floor) {
    this.buildingId = buildingId;
    this.floor = floor;
    this.agent = new https.Agent({ keepAlive: true });
    this.subscriberNumber = subscriberNumber;

    // ?cmd=startLearning&isIndoor=1&buildingId=167&floor=1&subscribernumber=robotslamimei&timestamp=1490950899
    this.options = {
      hostname: 'cpsdev.combain.com',
      protocol: 'https:',
      path: '/client/wifiscansubmit.php'
    };
  }

  async startSession() {
    try {
      const res = await this._get('startLearning');
      console.log('Successfully started SLAM session.');
    } catch (error) {
      throw error;
    }
  }

  async stopSession() {
    try {
      const res = await this._get('stopLearning');
      console.log('Successfully stopped SLAM session.');
    } catch (error) {
      throw error;
    }
  }

  async sendPoint(data) {
    try {
      const res = await this._post(data);
      //console.log('Successfully sent SLAM point.');
    } catch (error) {
      throw error;
    }
  }

  async _get(cmd) {
    const promise = new Promise((resolve, reject) => {
      const options = this._createOptions({
        data: {
          cmd: cmd,
          isIndoor: 1,
          buildingId: this.buildingId,
          floor: this.floor,
          subscribernumber: this.subscriberNumber,
          timestamp: Math.floor(new Date() / 1000)
        }
      });
      console.log(options);
      const req = https.request(options, (res) => {
        if (res.statusCode !== 200) {
          const error = new Error(`SLAM session stop failed. HTTP status code: ${res.statusCode}`);
          res.resume();
          reject(error);
        } else {
          resolve(res);
        }
      });
      req.end();
    });
    return promise;
  }

  async _post(data) {
    const promise = new Promise((resolve, reject) => {
      const options = this._createOptions({
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
          'Content-Length': Buffer.byteLength(data)
        }
      });
      const req = https.request(options, (res) => {
        if (res.statusCode !== 200) {
          const error = new Error(`SLAM point export failed. HTTP status code: ${res.statusCode}`);
          res.resume();
          reject(error);
        } else {
          resolve(res);
        }
      });
      req.end(data);
    });
    return promise;
  }

  _createOptions(options) {
    // use this.options for default values
    let opt = Object.assign({}, this.options);
    opt = Object.assign(opt, options);
    // format get query string
    if ('data' in opt) {
      opt.path = opt.path + '?' + querystring.stringify(opt.data)
    }
    return opt;
  }
}

module.exports = CPS;
