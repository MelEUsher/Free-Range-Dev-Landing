import assert from 'node:assert/strict';
import { after, describe, it } from 'node:test';

import { formatDate } from '../src/lib/articles';

// Front matter dates are date-only ISO strings, which JavaScript parses as UTC
// midnight. The displayed date must match the front matter on any build
// machine, so these zones straddle UTC on both sides by up to a full day.
const ZONES = [
  'America/Chicago',
  'Pacific/Pago_Pago', // UTC-11
  'UTC',
  'Pacific/Kiritimati', // UTC+14
];

const originalTZ = process.env.TZ;

after(() => {
  if (originalTZ === undefined) {
    delete process.env.TZ;
  } else {
    process.env.TZ = originalTZ;
  }
});

describe('formatDate', () => {
  for (const zone of ZONES) {
    it(`renders the front matter date unchanged in ${zone}`, () => {
      process.env.TZ = zone;

      assert.equal(formatDate('2026-09-24'), 'September 24, 2026');
      // getAllArticles passes the normalized toISOString() form.
      assert.equal(formatDate('2026-09-24T00:00:00.000Z'), 'September 24, 2026');
      assert.equal(formatDate('2026-01-01'), 'January 1, 2026');
    });
  }
});
