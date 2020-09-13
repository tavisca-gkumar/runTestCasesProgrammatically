import config from '../test-config.json';
import expect from 'expect.js';

describe('Testing feature B added for client', () => {
    it('Testing Feature B', ()=> {
      if (config.Enable_Feature_B_Client) {
          expect(true).ok();
      } else {
          this.skip();
      }
    });
 
});
