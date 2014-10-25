inject is a [CoffeeScript](http://coffeescript.org) module used to modify the
class inheritance chain dynamically. It sucessfully sets up the prototype
chain and object properties.

# Standard use

For example, say you have the following class definitions:

    class A
        foo: 1

    class C extends A
        baz: 2

    class B
        bar: 3

Your prototype chain for class C looks like this:

    A → C

now, let us say that you want the prototype chain to look like this instead:

    A → B → C

all you have to do is use inject:

    inject = require('inject')
    inject B, C

This makes B extend from A, and then makes C extend from the new B. The new
class with the fixed prototype chain is returned. Note that these functions
modify the original classes in place: 'inject' is __not__ side effect free.

## Multiple injects

You can inject more than one class in one go. `inject` will set up the entire
prototype chain correctly. For example, with the following classes:

    class A
    class B
    class C
    class D

the following call

    inject D, C, B, A

will result in the following prototype chain:

    A → B → C → D

# Inheriting vs Injecting

Inject also supplies an 'inherits' function, to change the parent of a class
without modifying the prototype chain. For example, using the same classes as
the first example, the following call

    inject.inherits C, B

creates the following prototype chain

    B → C

notice how A has been removed from the prototype chain. `inject` puts B into the
chain before C, while `inherits` switches C's chain to B's chain.
