import EventsChannel from './events_channel';

export function observe(target, keys, callback){
  if(!target._observe){
    _initObserver(target);
  }

  _forEachAttribute(keys, function(key){
    target._observe.channel.on(`change:${key}`, callback);

    if(!_isObserving(target, key)){
      target._observe.obseveables.add(key);
      let oldValue = target[key];

      _defineProperties(target, key);

      if(oldValue !== undefined){
        target[key] = oldValue;
      }
    }
  });
}

export function unobserve(target, keys, callback){
  _forEachAttribute(keys, function(key){
    target._observe.channel.off(`change:${key}`, callback);
  });
}

function _initObserver(target){
  target._observe = {};
  target._observe.attributes = {};
  target._observe.obseveables = new Set();
  target._observe.channel = new EventsChannel();
}

function _isObserving(target, key){
  target._observe.obseveables.has(key);
}

function _defineProperties(target, key){
  let descriptor = Object.getOwnPropertyDescriptor(target, key);
  let setter, getter;

  if(descriptor){
    setter = descriptor.set;
    getter = descriptor.get;
  }

  Object.defineProperty(target, key, {
    enumerable: true,
    configurable: true,
    get: function(){
      if(getter){
        return getter();
      }
      else{
        return target._observe.attributes[`${key}`];
      }
    },
    set: function(value){
      if(target._observe.attributes[`${key}`] === value){
        return;
      }

      if(setter){
        setter.call(target, value);
      }
      else{
        target._observe.attributes[`${key}`] = value;
      }

      target._observe.channel.trigger(`change:${key}`, value);
    }
  });
}

function _forEachAttribute(attributesString, callback){
  attributesString.split(/\s/g).forEach(callback);
}