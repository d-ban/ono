const assert = require('assert');
const app = require('../../src/app');

describe('\'feedstore\' service', () => {
  it('registered the service', () => {
    const service = app.service('feedstore');

    assert.ok(service, 'Registered the service');
  });
});
