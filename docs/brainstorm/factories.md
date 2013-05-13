Factories 


### ClassFactory

creates a factory out of a class

```javascript
var classFactory = new ClassFactory(Class);
classFactory.createItem(); //new Class
```


### ABTestFactory

Chooses an item to create. This sticks with the user until the ABTestFactory is replaced with something such as ClassFactory.

- `chooser` - the AB test chooser. This should be something like optimizely. 

```javascript
var abTestFactory = new ABTestTactory(chooser, { variation1: View1, variation2: View2 });
abTestFactory.createItem(); //create either View1 or View2
```


### FactoryFactory

FactoryFactory Identifies what a given item is, and builds a factory out of it. For instance:

```javascript
var classFactory = factoryFactory.getItem(new ClassFactory(Class));

classFactory.createItem(); //new Class

classFactory = factoryFactory.getItem(new ClassFactory(Class));


classFactory.createItem(); //new Class
```