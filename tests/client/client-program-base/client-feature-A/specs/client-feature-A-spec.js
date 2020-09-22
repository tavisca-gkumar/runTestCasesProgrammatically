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

describe('Testing updated feature X of base in client', function() {
    it('Testing updated feature X in client', function() {
        if (config.Enable_Feature_X) {
          expect(1 + 1).equal(2);
        } else {
            this.skip();
        }
    });
});

