import config from '../test-config.json';
import expect from 'expect.js';

describe('Testing feature A of base', () => {
    it('Testing feature A', () => {
      if (config.Enable_Feature_A) {
          expect(true).ok();
      } else {
          this.skip();
      }
    });
  
});
describe('Testing feature X of base', () => {
    it('Testing feature X', () =>{
      if (config.Enable_Feature_X) {
          expect(true).ok();
      } else {
          this.skip();
      }
    });
});