import * as chai from 'chai';
import * as sinon from 'sinon';
import sinonChai from 'sinon-chai';

import Listener from '../src/listener'
import EventsChannel from '../src/events_channel'

let expect = chai.expect;
chai.use(sinonChai);

describe('Listener', function () {
  let channel, channel2, spy, spy2, listener;

  beforeEach(function () {
    channel = new EventsChannel();
    channel2 = new EventsChannel();
    spy = sinon.spy();
    spy2 = sinon.spy();
    listener = new Listener();
  });

  describe('listen', function () {
    it('subscribes to an event of a given object', function () {
      listener.listenTo(channel, 'eventName', spy);
      channel.trigger('eventName');

      expect(spy).to.have.been.called;
    });

    it('can subscribes to several events of a single channel', function (){
      listener.listenTo(channel, 'eventName', spy);
      listener.listenTo(channel, 'eventName2', spy2);
      channel.trigger('eventName');
      channel.trigger('eventName2');

      expect(spy).to.have.been.called;
      expect(spy2).to.have.been.called;
    });

    it('can subscribes to different channels', function (){
      listener.listenTo(channel, 'eventName', spy);
      listener.listenTo(channel2, 'eventName2', spy2);
      channel.trigger('eventName');
      channel2.trigger('eventName2');

      expect(spy).to.have.been.called;
      expect(spy2).to.have.been.called;
    });
  });

  describe('isListeningTo', function () {
    it('returns true if the listener listens to the given channel', function () {
      listener.listenTo(channel, 'eventName', spy);
      expect(listener.isListeningTo(channel)).to.equal(true);
    });

    it('returns false if the listener does not listens to the given channel', function () {
      listener.listenTo(channel, 'eventName', spy);
      expect(listener.isListeningTo(channel2)).to.equal(false);
    });

    it('returns true if the listener listens to the given event', function () {
      listener.listenTo(channel, 'eventName', spy);
      expect(listener.isListeningTo(channel, 'eventName')).to.equal(true);
    });

    it('returns false if the listener listens to the given event', function () {
      listener.listenTo(channel, 'eventName', spy);
      expect(listener.isListeningTo(channel, 'eventName2')).to.equal(false);
    });

    it('returns true if the listener listens to the given event with a given callback', function () {
      listener.listenTo(channel, 'eventName', spy);
      expect(listener.isListeningTo(channel, 'eventName', spy)).to.equal(true);
    });

    it('returns false if the listener listens to the given event with a given callback', function () {
      listener.listenTo(channel, 'eventName', spy);
      expect(listener.isListeningTo(channel, 'eventName', spy2)).to.equal(false);
    });
  });

  describe('stopListeningTo', function () {
    it('removes a subscribtion from an event in the givven channel', function () {
      listener.listenTo(channel, 'eventName', spy);
      listener.stopListeningTo(channel, 'eventName', spy);
      channel.trigger('eventName');

      expect(spy).not.to.have.been.called;
    });

    it('does nothing if called with not listened to event', function () {
      listener.listenTo(channel, 'eventName', spy);
      let fn = function(){
        listener.stopListeningTo(channel, 'eventName2', spy);
      };
      expect(fn).not.to.throw();
    });

    it('does not effect other subscriptions', function () {
      listener.listenTo(channel, 'eventName', spy);
      listener.listenTo(channel, 'eventName2', spy);
      listener.stopListeningTo(channel, 'eventName2', spy);
      channel.trigger('eventName');

      expect(spy).to.have.been.called;
    });

    it('stops listening to an event if called without a specific callback', function () {
      listener.listenTo(channel, 'eventName', spy);
      listener.listenTo(channel, 'eventName', spy2);

      listener.stopListeningTo(channel, 'eventName');

      channel.trigger('eventName');

      expect(spy).not.to.have.been.called;
      expect(spy2).not.to.have.been.called;
    });

    it('stops listening to an entire channel if called without event name', function () {
      listener.listenTo(channel, 'eventName', spy);
      listener.listenTo(channel, 'eventName2', spy);

      listener.stopListeningTo(channel);

      channel.trigger('eventName');
      channel.trigger('eventName2');

      expect(spy).not.to.have.been.called;
    });
  });

  describe('stopListening', function () {
    it('stop listening to subscribed channel and event', function () {
      listener.listenTo(channel, 'eventName', spy);
      listener.stopListening();

      channel.trigger('eventName');

      expect(spy).not.to.have.been.called;
    });

    it('stop listening to several subscribed channels and events', function () {
      listener.listenTo(channel, 'eventName', spy);
      listener.listenTo(channel, 'eventName2', spy);
      listener.listenTo(channel2, 'eventName', spy);
      listener.listenTo(channel2, 'eventName2', spy);

      listener.stopListening();

      channel.trigger('eventName');
      channel.trigger('eventName2');
      channel2.trigger('eventName');
      channel2.trigger('eventName2');

      expect(spy).not.to.have.been.called;
    });

    it('stop listening to several callbacks subscribed to same event', function () {
      listener.listenTo(channel, 'eventName', spy);
      listener.listenTo(channel, 'eventName', spy2);

      listener.stopListening();

      channel.trigger('eventName');

      expect(spy).not.to.have.been.called;
      expect(spy2).not.to.have.been.called;
    });
  });
});