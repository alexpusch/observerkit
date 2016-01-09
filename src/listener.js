import { removeFromArray, shallowCopy } from './helpers';

export default class Listner{
  // handlers is of the form:
  //   Map(
  //     channel1: {
  //       event1: [callback1, callback2, ...]
  //       event2: [...]
  //     },
  //     channel2: {...}
  //   )

  listenTo(channel, eventName, callback){
    this._ensureStructure(channel, eventName);

    this._register(channel, eventName, callback);
    channel.on(eventName, callback);
  }

  stopListeningTo(channel, eventName, callback){
    if(!this.isListeningTo(channel, eventName, callback)){
      return;
    }

    if(arguments.length === 1){
      this._stopListeningToChannel(channel);
    } else if (arguments.length === 2){
      this._stopListeningToEvent(channel, eventName);
    } else {
      this._stopListeningToEventCallback(channel, eventName, callback);
    }
  }

  stopListening(){
    if(!this.handlers){
      return;
    }

    for(let channel of this.handlers.keys()){
      this._stopListeningToChannel(channel);
    }
  }

  isListeningTo(channel, eventName, callback){
    if(!this.handlers){
      return false;
    }

    let channelHandlers = this.handlers.get(channel);
    if(channel && !channelHandlers){
      return false;
    }

    let eventHandlers = channelHandlers[eventName];
    if(eventName && !eventHandlers){
      return false;
    }

    if(callback && eventHandlers.indexOf(callback) === -1){
      return false;
    }

    return true;
  }

  _stopListeningToChannel(channel){
    let channelHandlers = this.handlers.get(channel);

    for(let eventName in channelHandlers){
      this._stopListeningToEvent(channel, eventName);
    }
  }

  _stopListeningToEvent(channel, eventName){
    let channelHandlers = this.handlers.get(channel);
    let callbacks = shallowCopy(channelHandlers[eventName]);

    callbacks.forEach((callback) => {
      this._stopListeningToEventCallback(channel, eventName, callback);
    });
  }

  _stopListeningToEventCallback(channel, eventName, callback){
    this._unregister(channel, eventName, callback);
    channel.off(eventName, callback);
  }

  _register(channel, eventName, callback){
    let channelHandlers = this.handlers.get(channel);
    let eventHandlers = channelHandlers[eventName];

    eventHandlers.push(callback);

    channelHandlers[eventName] = eventHandlers;
    this.handlers.set(channel, channelHandlers);
  }

  _unregister(channel, eventName, callback){
    let channelHandlers = this.handlers.get(channel);

    if(channelHandlers && channelHandlers[eventName]){
      removeFromArray(channelHandlers[eventName], callback);
    }
  }

  _ensureStructure(channel, eventName){
    if(!this.handlers){
      this.handlers = new Map();
    }

    if(channel && !this.handlers.has(channel)){
      this.handlers.set(channel, {});
    }

    if(eventName && !this.handlers.get(channel)[eventName]){
      this.handlers.get(channel)[eventName] = [];
    }
  }
}

