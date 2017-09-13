const assert = require('assert');
const app = require('../../src/app');

describe('\'mystream\' service', () => {
  it('registered the service', () => {
    const service = app.service('mystream');

    assert.ok(service, 'Registered the service');
  });
});
