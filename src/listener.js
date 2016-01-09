import SubscriptionManager from './subscription_manager';

export default class Listner{
  listenTo(channel, eventName, callback){
    this._ensureInit();
    this.subscriptionManager.subscribeTo(channel, eventName, callback);
  }

  stopListeningTo(...args){
    this._ensureInit();
    this.subscriptionManager.unsubscribeFrom(...args);
  }

  stopListening(){
    this._ensureInit();
    this.subscriptionManager.unsubscribeFromAll();
  }

  isListeningTo(channel, eventName, callback){
    this._ensureInit();
    return this.subscriptionManager.isSubscribedTo(channel, eventName, callback);
  }

  _ensureInit(){
    if(!this.subscriptionManager){
      this.subscriptionManager = new SubscriptionManager({
        subscribeFn: function(channel, eventName, callback){
          channel.on(eventName, callback);
        },
        unsubscribeFn: function(channel, eventName, callback){
          channel.off(eventName, callback);
        }
      });
    }
  }
}

