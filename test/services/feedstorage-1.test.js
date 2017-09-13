const assert = require('assert');
const app = require('../../src/app');

describe('\'feedstorage1\' service', () => {
  it('registered the service', () => {
    const service = app.service('feedstorage-1');

    assert.ok(service, 'Registered the service');
  });
});
