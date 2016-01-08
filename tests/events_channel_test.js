import * as chai from 'chai';
import * as sinon from 'sinon';
import sinonChai from 'sinon-chai';

import EventsChannel from '../src/events_channel';


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
  });

  describe('trigger', function() {
    it('calls a subscribed callback with given arguments', function() {
      channel.on('name', callback);
      channel.trigger('name', 'arg');

      expect(callback).to.have.been.calledWith('arg');
    });

    it('does nothing if no callback was registerd', function() {
      let emptyTriggerFn = function(){ channel.trigger('empty'); };

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
