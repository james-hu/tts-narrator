import { expect } from 'chai';

import { normaliseRate } from '../src/tts-service';

describe('normaliseRate', function () {
  it('handles named rates', function () {
    expect(normaliseRate('x-slow')).to.equal(0.5);
    expect(normaliseRate('slow')).to.equal(0.75);
    expect(normaliseRate('medium')).to.equal(1);
    expect(normaliseRate('fast')).to.equal(1.5);
    expect(normaliseRate('x-fast')).to.equal(2);
  });

  it('handles absolute percentages', function () {
    expect(normaliseRate('150%')).to.equal(1.5);
    expect(normaliseRate('80%')).to.equal(0.8);
    expect(normaliseRate('200%')).to.equal(2);
    expect(normaliseRate('50%')).to.equal(0.5);
  });

  it('handles relative percentages', function () {
    expect(normaliseRate('+10%')).to.equal(1.1);
    expect(normaliseRate('-20%')).to.equal(0.8);
    expect(normaliseRate('+100%')).to.equal(2); // clamped to max
    expect(normaliseRate('-60%')).to.equal(0.5); // clamped to min
  });

  it('handles plain numbers', function () {
    expect(normaliseRate('1')).to.equal(1);
    expect(normaliseRate('1.25')).to.equal(1.25);
    expect(normaliseRate('2')).to.equal(2);
    expect(normaliseRate('0.5')).to.equal(0.5);
  });

  it('returns undefined for null/undefined', function () {
    // eslint-disable-next-line unicorn/no-useless-undefined
    expect(normaliseRate(undefined)).to.be.undefined;
    expect(normaliseRate(null as any)).to.be.undefined;
  });

  it('throws for invalid values', function () {
    expect(() => normaliseRate('abc')).to.throw();
    expect(() => normaliseRate('-10')).to.throw();
    expect(() => normaliseRate('-150%')).to.throw();
  });
});