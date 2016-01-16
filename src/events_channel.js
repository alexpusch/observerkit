import { removeFromArray, forEachDelimited } from './helpers';

export function mixinEvents(prototype) {
  let methodNames = Object.getOwnPropertyNames(EventsChannel.prototype);

  methodNames.forEach(function(methodName) {
    if (methodName === 'constructor') {
      return;
    }

    let method = EventsChannel.prototype[methodName];
    prototype[methodName] = method;
  });
}

export class EventsChannel {
  on(eventNames, callback) {
    if (this.eventsDirectory === undefined) {
      this.eventsDirectory = {};
    }

    this._forEachEvent(eventNames, (eventName) => {
      if (this.eventsDirectory[eventName] === undefined) {
        this.eventsDirectory[eventName] = [];
      }

      let callbackList = this.eventsDirectory[eventName];
      callbackList.push(callback);
    });
  }

  off(eventNames, callback) {
    this._forEachEvent(eventNames, (eventName) => {
      if (this.eventsDirectory === undefined || this.eventsDirectory[eventName] === undefined) {
        return;
      }

      if (callback === undefined) {
        delete this.eventsDirectory[eventName];
      } else {
        let callbackList = this.eventsDirectory[eventName];
        removeFromArray(callbackList, callback);
      }
    });
  }

  trigger(eventNames, ...args) {
    this._forEachEvent(eventNames, (eventName) => {
      if (this.eventsDirectory === undefined || this.eventsDirectory[eventName] === undefined) {
        return;
      }

      let callbackList = this.eventsDirectory[eventName];

      callbackList.forEach(function(callback) {
        callback(...args);
      });
    });
  }

  resetEvents() {
    this.eventsDirectory = {};
  }

  _forEachEvent(eventsString, callback) {
    forEachDelimited(eventsString, callback);
  }
}
