import config from '../test-config.json';
const expect = require('expect.js');

describe('Testing feature A', () => {
  if (config.Enable_Feature_A) {
    expect(true).toBeTruthy();
  } else {
    this.skip();
  }
});
