export default class EventsChannel {
  on(eventName, callback){
    if(this.directory === undefined){
      this.directory = {};
    }

    if (this.directory[eventName] === undefined){
      this.directory[eventName] = [];
    }

    let callbackList = this.directory[eventName];
    callbackList.push(callback);
  }

  off(eventName, callback){
    if (this.directory === undefined || this.directory[eventName] === undefined){
      return;
    }

    let callbackList = this.directory[eventName];
    _removeFromArray(callbackList, callback);
  }

  trigger(eventName, ...args){
    if (this.directory === undefined || this.directory[eventName] === undefined){
      return;
    }

    let callbackList = this.directory[eventName];

    callbackList.forEach(function(callback){
      callback( ...args );
    });
  }

  resetEvents(){
    this.directory = {};
  }
}

function _removeFromArray(array, item){
  let index = array.indexOf(item);
  if ( index > -1){
    array.splice(index, 1);
  }
}
