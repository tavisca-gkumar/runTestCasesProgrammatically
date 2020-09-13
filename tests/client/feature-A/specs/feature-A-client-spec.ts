import config from '../test-config.json';
import configData from '../test-config.json';

var expect = require('expect.js');

describe('Testing feature A Client', () => {
  if (config.Enable_Feature_A) {
    expect(true).toBeTruthy();
  } else {
    this.skip();
  }
});

describe('Testing feature A', () => {
  if (config.Enable_Feature_A) {
    expect(true).toBeTruthy();
  } else {
    this.skip();
  }
});


describe('Testing feature A', () => {
  if (config.Enable_Feature_A) {
    expect(true).toBeTruthy();
    expect(false).toBeFalsy();
  } else {
    this.skip();
  }
});


