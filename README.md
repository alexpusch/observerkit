ObserverKit
==============
ObserverKit offers an ES5 compatible observe, and events API. To make your life easier I've included methods to mixin the API into your objects and classes.

The kit provides three main components: Observer, EventsChannel and Listener. These components allows you to observe attribute changes and events, while managing the subscriptions, allowing you to easily remove them, avoiding common memory management pitfalls.

Examples
-------------
### Observer

``` js
var Position = function(x, y){
  this.x = x;
  thix.y = y;
}

var observer = new Observer();

var p = new Position();

observer.observe(p, 'x', function(value){
  console.log('x has changed to', value);
}));

p.x = 20; // x has changed to 20

observer.stopObserving();
```

### Listener and EventsChannel

``` js
var Model = function(){};
mixinEvents(Model.prototype); // mixin an EventsChannel into Model prototype

Model.prototype.sellOut = function(){
  this.trigger('soldOut');
}

var View = function(model){
  this.listener = new Listener();
  this.model = model;

  this.listener.listenTo(model, 'soldOut', this.update.bind(this));
};

View.prototype.destroy(){
  this.listener.stopListening();
}

var model = new Model();
var view = new View(model);

model.sellOut(); // view is updated

view.destroy(); // subscriptions to events are removed, memory is freed.
```

Usage
------
### Node.js
```bash
npm install --save observerkit
```

```js
ObserverKit = require('observerkit');
```

### Browser
```html
<script type="text/javascript" src='observerkit.js'></script>
```

API
-----
* __Observer__
  * [observe(target, attributes, callback)](#observetarget-attributes-callback)
  * [stopObservingOn(target, attributes, callback)](#stopobservingontarget-attributes-callback)
  * [stopObserving()](#stopobserving)
* __Events Channel__
  * [on(eventNames, callback)](#oneventnames-callback)
  * [trigger(eventNames, ...args)](#triggereventnames-args)
  * [off(eventNames, callback)](#offeventnames-callback)
  * [resetEvents()](#resetevents)
* __[mixinEvents(object)](#mixinevents-object)__
* __Listener__
  * [listenTo(channel, eventNames, callback)](#listentochannel-eventnames-callback)
  * [stopListeningTo(channel, eventNames, callback)](#stoplisteningtochannel-eventnames-callback)
  * [stopListening()](#stoplistening)
  * [isListeningTo(channel, eventName, callback)](#islisteningtochannel-eventname-callback)

Observer
----------
The Observer manages observations. It allows you to define a function to be called when a certain attribute of an object changes.

### Observer()
Constructor. Creates a new observer

### observe(target, attributes, callback)
Wire up an attribute of an object to call a function when changed.

* Arguments:
  * { object } target - object to observe
  * { string } attributes - attribute, or attributes to observe. attributes list should be space delimited, e.g 'x y'
  * { function } callback - function to be called when given attributes are changed.

* Example:
```js
var observer = new Observer();

var position = { x: 0, y: 0 };
observer.observe(position, 'x', function(value){
  console.log('x position has changed to ', value);
});

position.x = 10; // x position has changed to 10
observer.stopObserving();
```

### stopObservingOn(target, attributes, callback)
Remove the subscription from some attribute change in an object.

* Arguments:
  * { object } target - object to stop observing on. if no attributes and callback are given, all observation on object are removed.
  * { string } [optional] attributes - attribute, or attributes to stop observing. If no callback is given, all observation on attributes are removed.
  * { function } [optional] callback - function to remove from subscription list.

### stopObserving()
Removes all observations set up using this observer

Events Channel
---------------
Manages subscriptions to named events.

### EventsChannel()
Constructor. Creates an empty events channel.

### on(eventNames, callback)
* Arguments:
  * { string } eventsNames - the name or names of the events to subscribe to. events list should be space delimited, e.g 'submit cancel'
  * { function } callback - function to be called when events are triggered

### trigger(eventNames, ...args)
* Arguments:
  * { string } eventNames - the name or names of the events trigger. events list should be space delimited, e.g 'submit cancel'
  * ...args - Every argument passed to the trigger method would be passed to event handlers.
* Example:

```js
var channel = new EventsChannel();
channel.on('cancel', function(message){
  console.log('cancel event have been triggered by', message);
});

channel.trigger('cancel', 'user'); //cancel event have been triggered by user
```

### off(eventNames, callback)
* Arguments:
  * { string } eventsNames - the name or names of the events to unsubscribe from. events list should be space delimited, e.g 'submit cancel'
  * { function } callback - function to remove from subscription list.

* Example:

```js
var channel = new EventsChannel();
var handler = function(){
  console.log('cancel event have been triggered');
};

channel.on('cancel', handler);
channel.off('cancel', handler);

channel.trigger('cancel'); // nothing happens
```

### resetEvents()
removes all events and handlers from channel

mixinEvents(object)
---------------------
Adds events methods(on, off, trigger, resetEvents) to any object or prototype

* Arguments:
  * {object} object - the object to mixin the events channel methods to. For example you can mixin the methods into a class prototype and get the events methods in all instances.

* Example:
```js
var FormView = function(){};
FormView.prototype.submit = function(data){
  this.trigger('submit', data);
};
mixinEvents(FormView.prototype);

var formView = new FormView();
formView.on('submit', function(data){
  console.log('data submitted', data);
});
formView.submit({title: 'Observer kit'}); // data submitted: { title: Observer kit }
```

Listener
-----------
The listener is a highly recommended counterpart to an EventaChannel. In real life application there is a need to aggregate subscriptions to several event channels, and removing some, or all of the subscriptions easily. For example, a controller might listen to events from several models and views. When the controller is destroyed there is a need to remove all the subscriptions made by current controller. Using a Listener this can be achieved easily. This is the same approach as Backbone's listenTo method.

### listenTo(channel, eventNames, callback)
Subscribes to given channels event with given callback.

* Arguments:
  * { EventsChannel } channel - channel to listen to
  * { string } eventsNames - the name or names of the events to subscribe to. events list should be space delimited, e.g. 'submit cancel'
  * { function } callback - function to be called when events are triggered
* Example:
```js
// function handler() ...

var channel = new EventsChannel();
var listener = new Listener();

listener.on(channel, 'submit', handler);
channel.trigger('submit'); // handler is called

listener.stopObservingOn(channel);
```

### stopListeningTo(channel, eventNames, callback)
Remove the subscription from some events in given channel

* Arguments:
  * { EventsChannel } channel - channel to stop listening to. if no eventNames and callback are given, all subscriptions made by current listener are removed.
  * { string } [optional] eventNames - event or events to stop listening to. If no callback is given, all event handlers defined by current listener to given events are removed.
  * { function } [optional] callback - function to remove from subscription list.

* Example:
```js
// function handler() ...

var channel = new EventsChannel();
var listener = new Listener();
var listener2 = new Listener();

listener.on(channel, 'submit', handler);
listener.on(channel, 'cancel', handler2);
listener2.on(channel, 'submit', handler3);

listener.stopObservingOn(channel); // handler, handler2 are removed. handler3 is not removed since it was not defined by listener
```

### stopListening()
Removes all listeners defined by this listener

### isListeningTo(channel, eventName, callback)
Checks if this listener is subscribed to given event in given channel with given callback
* Arguments:
  * { EventsChannel } channel - if no eventName and callback are given, check any subscription to given channel
  * { string } [optional] eventName - if no callback is given, check any subscription to given event on given channel
  * { function } [optional] callback
