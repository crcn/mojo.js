hurryUp.js
==========

timeout library for callbacks


## API

### hurryUp(timedCallback, optionsOrTimeout, ...args)

- `optionsOrTimeout` 
  - `object` - options passed
    - `retry` - TRUE if the timedCallback should be re-called if it returns an error
    - `retryTimeout` - timeout between retrying timed callback
    - `timeout` - kill timeout
  - `number` - the timeout before killing the function call

```javascript
hurryUp(function(next) {
  
  //this will cause an error
  setTimeout(next, 2000);
}, 1000).call(null, function(err, result) {
  console.error("timeout has occurred!")
})
```

Here's an easier way to wrap around a method:

```javascript
hurryUp(emitter.once, 1000).call(emitter, "connected", function(err, result) {
  
});
```


You can also use hurryup to run a callback multiple times until it succeeds, like so:

```javascript

function isItReady(next) {
  //async stuff here
  next(new Error("no!"));
}

hurryUp(function(next) {
  isItReady(next);
}, { retry: true }).call(null, function(err) {
  console.log(err.message); //no!
});
```
