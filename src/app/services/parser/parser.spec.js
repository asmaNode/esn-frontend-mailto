/* global chai: false */

const { expect } = chai;

describe('The inboxMailtoParser factory', function() {

  var inboxMailtoParser;

  beforeEach(function() {
    angular.mock.module('linagora.esn.unifiedinbox.mailto');
  });

  beforeEach(angular.mock.inject(function(_inboxMailtoParser_) {
    inboxMailtoParser = _inboxMailtoParser_;
  }));

  function recipient(email) {
    return { name: email, email: email };
  }

  function extendMessage(message) {
    return angular.extend({
      to: [],
      cc: [],
      bcc: [],
      subject: undefined,
      textBody: undefined,
      htmlBody: undefined
    }, message);
  }

  it('should return an empty object when no mailto URL given', function() {
    expect(inboxMailtoParser()).to.deep.equal({});
  });

  it('should return an empty object when null given', function() {
    expect(inboxMailtoParser(null)).to.deep.equal({});
  });

  it('should return an empty object when an empty mailto URL is given', function() {
    expect(inboxMailtoParser('')).to.deep.equal({});
  });

  it('should parse the simplest mailto URL', function() {

    expect(inboxMailtoParser({ uri: 'a@a.com' })).to.deep.equal(extendMessage({
      to: [recipient('a@a.com')]
    }));
  });

  it('should parse multiple recipients, considering , and ; as separators', function() {
    expect(inboxMailtoParser({ uri: 'a@a.com,b@b.com;c@c.com' })).to.deep.equal(extendMessage({
      to: [recipient('a@a.com'), recipient('b@b.com'), recipient('c@c.com')]
    }));
  });

  it('should parse subject, body, cc and bcc optional parameters', function() {
    expect(inboxMailtoParser({
      uri: 'a@a.com', subject: 'subject@mail', body: 'b', cc: 'copy@mail', bcc: 'blank carbon copy'
    })).to.deep.equal(extendMessage({
      to: [recipient('a@a.com')],
      subject: 'subject@mail',
      cc: [recipient('copy@mail')],
      bcc: [recipient('blank carbon copy')],
      textBody: 'b',
      htmlBody: 'b'
    }));
  });
});
