import config from '../test-config.json';
import expect from 'expect.js';

describe('Testing feature A of base', function() {
    it('Testing feature A', function() {
      if (config.Enable_Feature_A_1389) {
          expect(true).ok();
      } else {
          this.skip();
      }
    });
  
});
describe('Testing feature X of base', function() {
    it('Testing feature X', function () {
      if (config.Enable_Feature_X_1389) {
          expect(true).ok();
      } else {
          this.skip();
      }
    });
});