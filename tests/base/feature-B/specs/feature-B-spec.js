import config from '../test-config.json';
import expect from 'expect.js';

describe('Testing feature B of base', () => {
    it('Testing feature B', ()=> {
      if (config.Enable_Feature_B) {
          expect(true).ok();
      } else {
          this.skip();
      }
    });
});
