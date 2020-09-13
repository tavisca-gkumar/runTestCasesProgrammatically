import config from '../test-config.json';
import expect from 'expect.js';

describe('Testing feature B added for client', function() {
    it('Testing Feature B', function() {
      if (config.Enable_Feature_B_Client) {
          expect(true).ok();
      } else {
          this.skip();
      }
    });
 
});
