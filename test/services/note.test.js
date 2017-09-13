const assert = require('assert');
const app = require('../../src/app');

describe('\'note\' service', () => {
  it('registered the service', () => {
    const service = app.service('note');

    assert.ok(service, 'Registered the service');
  });
});
