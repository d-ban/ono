const assert = require('assert');
const app = require('../../src/app');

describe('\'watchword\' service', () => {
  it('registered the service', () => {
    const service = app.service('watchword');

    assert.ok(service, 'Registered the service');
  });
});
