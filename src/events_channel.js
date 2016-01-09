import { removeFromArray } from './helpers'

export default class EventsChannel {
  on(eventNames, callback){
    if(this.directory === undefined){
      this.directory = {};
    }

    this._forEachEvent(eventNames, (eventName) => {
      if (this.directory[eventName] === undefined){
        this.directory[eventName] = [];
      }

      let callbackList = this.directory[eventName];
      callbackList.push(callback);
    });
  }

  off(eventNames, callback){
    this._forEachEvent(eventNames, (eventName) => {
      if (this.directory === undefined || this.directory[eventName] === undefined){
        return;
      }

      if(callback === undefined){
        delete this.directory[eventName];
      } else {
        let callbackList = this.directory[eventName];
        removeFromArray(callbackList, callback);
      }
    });
  }

  trigger(eventNames, ...args){
    this._forEachEvent(eventNames, (eventName) => {
      if (this.directory === undefined || this.directory[eventName] === undefined){
        return;
      }

      let callbackList = this.directory[eventName];

      callbackList.forEach(function(callback){
        callback( ...args );
      });
    });
  }

  resetEvents(){
    this.directory = {};
  }

  _forEachEvent(eventsString, callback){
    eventsString.split(/\s/g).forEach(callback);
  }
}

