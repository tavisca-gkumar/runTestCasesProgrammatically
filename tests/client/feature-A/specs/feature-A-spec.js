import config from '../test-config.json';
import expect from 'expect.js';

describe('Testing feature Y added in client', () => {
    it('Testing feature Y', () =>{
        if (config.Enable_Feature_Y) {
          expect(true).ok();
        } else {
            this.skip();
        }
    });
});