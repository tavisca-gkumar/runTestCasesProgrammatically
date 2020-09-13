import config from '../test-config.json';
var expect = require('expect.js');

describe('Testing feature B', () => {
  if (config.Enable_Feature_B) {
    expect(true).toBeTruthy();
  } else {
    this.skip();
  }
});
