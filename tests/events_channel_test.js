import * as chai from 'chai';
import * as sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { EventsChannel, mixinEvents } from '../dist/observerkit';

let expect = chai.expect;
chai.use(sinonChai);

describe('EventsChannel', function() {
  let channel, callback;

  beforeEach(function() {
    channel = new EventsChannel();
    callback = sinon.spy();
  });

  describe('on', function() {
    it('subscribes a callback to a named event', function() {
      channel.on('name', callback);
      channel.trigger('name');

      expect(callback).to.have.been.called;
    });

    it('subscribes a callback to a space seperatd events list', function() {
      channel.on('name other', callback);
      channel.trigger('name');
      channel.trigger('other');

      expect(callback).to.have.been.calledTwice;
    });
  });

  describe('trigger', function() {
    it('calls a subscribed callback with given arguments', function() {
      channel.on('name', callback);
      channel.trigger('name', 'arg');

      expect(callback).to.have.been.calledWith('arg');
    });

    it('calls subscribed callbacks of several space seperated event list', function() {
      let callback2 = sinon.spy();
      channel.on('name', callback);
      channel.on('other', callback2);
      channel.trigger('name other', 'arg');

      expect(callback).to.have.been.calledWith('arg');
      expect(callback2).to.have.been.calledWith('arg');
    });

    it('does nothing if no callback was registerd', function() {
      let emptyTriggerFn = function() { channel.trigger('empty'); };

      expect(emptyTriggerFn).not.throw();
    });
  });

  describe('off', function() {
    it('remove callback subscription from a named event', function() {
      channel.on('name', callback);
      channel.off('name', callback);
      channel.trigger('name');

      expect(callback).not.to.have.been.called;
    });

    it('remove callback subscription from a space seperated named event list', function() {
      channel.on('name', callback);
      channel.on('other', callback);
      channel.off('name other', callback);
      channel.trigger('name');
      channel.trigger('other');

      expect(callback).not.to.have.been.called;
    });

    it('removes all callbacks of an event, if no callback was given', function() {
      channel.on('name', callback);
      channel.off('name');

      channel.trigger('name');

      expect(callback).not.to.have.been.called;
    });

    it('does not remove subscription if a different callback is passed', function() {
      let spy2 = sinon.spy();

      channel.on('name', callback);
      channel.off('name', spy2);
      channel.trigger('name');

      expect(callback).to.have.been.called;
    });
  });

  describe('resetEvents', function() {
    it('clears all channel', function() {
      channel.on('name', callback);
      channel.resetEvents();
      channel.trigger('name');

      expect(callback).not.to.have.been.called;
    });
  });
});

describe('mixinEvents', function() {
  class Target{}

  beforeEach(function() {
    Target.prototype = {};
    mixinEvents(Target.prototype);
  });

  it('mixes eventsChannels methods into object', function() {
    expect(Target.prototype.on).to.exist;
  });

  it('on works', function() {
    let target = new Target();
    let spy = sinon.spy();
    target.on('name', spy);
    target.trigger('name');

    expect(spy).to.have.been.called;
  });

  it('off works', function() {
    let target = new Target();
    let spy = sinon.spy();
    target.on('name', spy);
    target.off('name', spy);
    target.trigger('name');

    expect(spy).not.to.have.been.called;
  });
});
