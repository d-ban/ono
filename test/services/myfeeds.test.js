const assert = require('assert');
const app = require('../../src/app');

describe('\'myfeeds\' service', () => {
  it('registered the service', () => {
    const service = app.service('myfeeds');

    assert.ok(service, 'Registered the service');
  });
});
