import * as chai from 'chai';
import * as sinon from 'sinon';
import sinonChai from 'sinon-chai';

import Observer from '../src/observer'

let expect = chai.expect;
chai.use(sinonChai);

describe('Observer', function () {
  let target, target2, spy, spy2, observer;

  beforeEach(function () {
    target = {};
    target2 = {};
    spy = sinon.spy();
    spy2 = sinon.spy();
    observer = new Observer();
  });

  describe('observe', function () {
    it('subscribes to a change of a given attribute in a given object', function () {
      observer.observe(target, 'attr', spy);
      target.attr = 'value';

      expect(spy).to.have.been.called;
    });

    it('can subscribes to several attributes of a single target', function (){
      observer.observe(target, 'attr', spy);
      observer.observe(target, 'attr2', spy2);
      target.attr = 'value';
      target.attr2 = 'value';

      expect(spy).to.have.been.called;
      expect(spy2).to.have.been.called;
    });

    it('can subscribes to several several space seperated attributes', function (){
      observer.observe(target, 'attr attr2', spy);
      target.attr = 'value';
      target.attr2 = 'value';

      expect(spy).to.have.been.calledTwice;
    });

    it('can subscribes to different targets', function (){
      observer.observe(target, 'attr', spy);
      observer.observe(target2, 'attr', spy2);
      target.attr = 'value';
      target2.attr = 'value';

      expect(spy).to.have.been.called;
      expect(spy2).to.have.been.called;
    });
  });

  describe('isObservingOn', function () {
    it('returns true if observing a given target', function () {
      observer.observe(target, 'attr', spy);
      expect(observer.isObservingOn(target)).to.equal(true);
    });

    it('returns false if not observing given target', function () {
      observer.observe(target, 'attr', spy);
      expect(observer.isObservingOn(target2)).to.equal(false);
    });

    it('returns true if observing given attribute', function () {
      observer.observe(target, 'attr', spy);
      expect(observer.isObservingOn(target, 'attr')).to.equal(true);
    });

    it('returns false if not observing given attribute', function () {
      observer.observe(target, 'attr', spy);
      expect(observer.isObservingOn(target, 'attr2')).to.equal(false);
    });

    it('returns true if observing given attribute with a given callback', function () {
      observer.observe(target, 'attr', spy);
      expect(observer.isObservingOn(target, 'attr', spy)).to.equal(true);
    });

    it('returns false if not observing given attribute with a given callback', function () {
      observer.observe(target, 'attr', spy);
      expect(observer.isObservingOn(target, 'attr', spy2)).to.equal(false);
    });
  });

  describe('stopObservingOn', function () {
    it('removes a subscribtion from an attribute in the given target', function () {
      observer.observe(target, 'attr', spy);
      observer.stopObservingOn(target, 'attr', spy);
      target.attr = 'value';

      expect(spy).not.to.have.been.called;
    });

    it('removes a subscribtion from a spaced seperated attribute list', function () {
      observer.observe(target, 'attr', spy);
      observer.observe(target, 'attr2', spy);
      observer.stopObservingOn(target, 'attr attr2', spy);
      target.attr = 'value';
      target.attr2 = 'value';

      expect(spy).not.to.have.been.called;
    });

    it('does nothing if called with a non observed attribute', function () {
      observer.observe(target, 'attr', spy);
      let fn = function(){
        observer.stopObservingOn(target, 'attr2', spy);
      };
      expect(fn).not.to.throw();
    });

    it('does not effect other subscriptions', function () {
      observer.observe(target, 'attr', spy);
      observer.observe(target, 'attr2', spy);
      observer.stopObservingOn(target, 'attr2', spy);
      target.attr = 'value';

      expect(spy).to.have.been.called;
    });

    it('stops observing attribute if called without a specific callback', function () {
      observer.observe(target, 'attr', spy);
      observer.observe(target, 'attr', spy2);

      observer.stopObservingOn(target, 'attr');

      target.attr = 'value';

      expect(spy).not.to.have.been.called;
      expect(spy2).not.to.have.been.called;
    });

    it('stops observing an entire target if called without an attribute', function () {
      observer.observe(target, 'attr', spy);
      observer.observe(target, 'attr2', spy);

      observer.stopObservingOn(target);

      target.attr = 'value';
      target.attr2 = 'value';

      expect(spy).not.to.have.been.called;
    });

    it('stops observing an entire target when attributes where subscribed in on call', function () {
      observer.observe(target, 'attr attr2', spy);

      observer.stopObservingOn(target);

      target.attr = 'value';
      target.attr2 = 'value';

      expect(spy).not.to.have.been.called;
    });
  });

  describe('stopObserving', function () {
    it('stop observing to subscribed target', function () {
      observer.observe(target, 'attr', spy);
      observer.stopObserving();

      target.attr = 'value';

      expect(spy).not.to.have.been.called;
    });

    it('stop observing to several subscribed targets and attributes', function () {
      observer.observe(target, 'attr', spy);
      observer.observe(target, 'attr2', spy);
      observer.observe(target2, 'attr', spy);
      observer.observe(target2, 'attr2', spy);

      observer.stopObserving();

      target.attr = 'value';
      target.attr2 = 'value';
      target2.attr = 'value';
      target2.attr2 = 'value';

      expect(spy).not.to.have.been.called;
    });

    it('stop observing to several callbacks subscribed to same attribute', function () {
      observer.observe(target, 'attr', spy);
      observer.observe(target, 'attr', spy2);

      observer.stopObserving();

      target.attr = 'value';

      expect(spy).not.to.have.been.called;
      expect(spy2).not.to.have.been.called;
    });
  });
});