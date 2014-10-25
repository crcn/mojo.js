Janitor.js is a simple utility that helps cleanup objects. [![Alt ci](https://travis-ci.org/classdojo/janitor.js.png)](https://travis-ci.org/classdojo/janitor.js)

### installation

Via NPM:

```bash
npm install janitorjs
```

Via Bower:

```bash
bower install janitor
```

### API

#### janitor()

Creates a new janitor

#### janitor.add(fnOrDisposable)

adds a disposable item to be cleaned up later.

```javascript

// function
janitor.add(function() {
  
});


// *or* object with .dispose() method
janitor.add({
  dispose: function() {

  }
});
```

#### janitor.addTimeout(timer)

adds a timeout object

```javascript
janitor.addTimeout(setTimeout(function() {
  
}, 1000));
```

#### janitor.addInterval(timer)

adds an interval object

```javascript
janitor.addInterval(setInterval(function() {
  
}, 100));
```

#### janitor.dispose()

```javascript
janitor.add(function() { });
janitor.addInterval(setInterval(functon(){}, 100));

//call the first fn, and dispose the interval
janitor.dispose();
```
