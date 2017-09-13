const assert = require('assert');
const app = require('../../src/app');

describe('\'following\' service', () => {
  it('registered the service', () => {
    const service = app.service('following');

    assert.ok(service, 'Registered the service');
  });
});
