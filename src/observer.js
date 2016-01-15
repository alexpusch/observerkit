import {observe, unobserve} from './observe';
import SubscriptionManager from './subscription_manager';

export class Observer{
  observe(target, attributes, callback){
    this._ensureInit();
    this.subscriptionManager.subscribeTo(target, attributes, callback);
  }

  stopObservingOn(...args){
    this._ensureInit();
    this.subscriptionManager.unsubscribeFrom(...args);
  }

  stopObserving(){
    this._ensureInit();
    this.subscriptionManager.unsubscribeFromAll();
  }

  isObservingOn(target, attributes, callback){
    this._ensureInit();
    return this.subscriptionManager.isSubscribedTo(target, attributes, callback);
  }

  _ensureInit(){
    if(!this.subscriptionManager){
      this.subscriptionManager = new SubscriptionManager({
        subscribeFn: observe,
        unsubscribeFn: unobserve
      });
    }
  }
}

