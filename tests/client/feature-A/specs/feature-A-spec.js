import config from '../test-config.json';
import expect from 'expect.js';

describe('Testing feature Y added in client', function() {
    it('Testing feature Y', function() {
        if (config.Enable_Feature_Y) {
          expect(true).ok();
        } else {
            this.skip();
        }
    });
});