import { removeFromArray, shallowCopy, forEachDelimited } from './helpers';

export default class SubscriptionManager{
  // handlers is of the form:
  //   Map(
  //     target1: {
  //       name1: [callback1, callback2, ...]
  //       name2: [...]
  //     },
  //     target2: {...}
  //   )
  constructor(options){
    this._subscribe = options.subscribeFn;
    this._unsubscribe = options.unsubscribeFn;
  }

  subscribeTo(target, messages, callback){
    this._forEachMessage(messages, (message) => {
      this._ensureStructure(target, message);

      this._register(target, message, callback);
      this._subscribe(target, message, callback);
    });
  }

  unsubscribeFrom(target, messages, callback){
    if(arguments.length === 1){
      if(this.isSubscribedTo(target)){
        this._unsubscribeFromTarget(target);
      }
      return;
    }

    this._forEachMessage(messages, (message) => {
      if(!this.isSubscribedTo(target, message, callback)){
        return;
      }

      if (arguments.length === 2){
        this._unsubscribeFromMessage(target, message);
      } else {
        this._unsubscribeFromMessageCallback(target, message, callback);
      }
    });
  }

  unsubscribeFromAll(){
    if(!this.handlers){
      return;
    }

    for(let target of this.handlers.keys()){
      this._unsubscribeFromTarget(target);
    }
  }

  isSubscribedTo(target, message, callback){
    if(!this.handlers){
      return false;
    }

    let targetHandlers = this.handlers.get(target);
    if(target && !targetHandlers){
      return false;
    }

    let messageHandlers = targetHandlers[message];
    if(message && !messageHandlers){
      return false;
    }

    if(callback && messageHandlers.indexOf(callback) === -1){
      return false;
    }

    return true;
  }

  _unsubscribeFromTarget(target){
    let targetHandlers = this.handlers.get(target);

    for(let message in targetHandlers){
      this._unsubscribeFromMessage(target, message);
    }
  }

  _unsubscribeFromMessage(target, message){
    let targetHandlers = this.handlers.get(target);
    let callbacks = shallowCopy(targetHandlers[message]);

    callbacks.forEach((callback) => {
      this._unsubscribeFromMessageCallback(target, message, callback);
    });
  }

  _unsubscribeFromMessageCallback(target, message, callback){
    this._unregister(target, message, callback);
    this._unsubscribe(target, message, callback);
  }

  _register(target, message, callback){
    let targetHandlers = this.handlers.get(target);
    let messageHandlers = targetHandlers[message];

    messageHandlers.push(callback);

    targetHandlers[message] = messageHandlers;
    this.handlers.set(target, targetHandlers);
  }

  _unregister(target, message, callback){
    let targetHandlers = this.handlers.get(target);

    if(targetHandlers && targetHandlers[message]){
      removeFromArray(targetHandlers[message], callback);
    }
  }

  _ensureStructure(target, message){
    if(!this.handlers){
      this.handlers = new Map();
    }

    if(target && !this.handlers.has(target)){
      this.handlers.set(target, {});
    }

    if(message && !this.handlers.get(target)[message]){
      this.handlers.get(target)[message] = [];
    }
  }

  _forEachMessage(messageString, callback){
    forEachDelimited(messageString, callback);
  }
}

