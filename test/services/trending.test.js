const assert = require('assert');
const app = require('../../src/app');

describe('\'trending\' service', () => {
  it('registered the service', () => {
    const service = app.service('trending');

    assert.ok(service, 'Registered the service');
  });
});
