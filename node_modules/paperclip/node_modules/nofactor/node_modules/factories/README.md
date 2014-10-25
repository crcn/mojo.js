```coffeescript
factories = require("./src")

classFactory = factories.class SomeClass
someClassInstance = classFactory.create data

fnFactory    = factories.fn (data) -> data
fnInstance   = fnInstance.create data

# resolve the factory depending on the type
factory      = factories.factory SomeClass
someClassInstance = factory.create data
```