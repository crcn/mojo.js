inject = require '../lib/inject'
vows = require 'vows'
assert = require 'assert'

vows.describe('inject')
    .addBatch
        'when B inherits A':
            topic: ->
                class A
                    foo: 1
                class B
                    bar: 2
                [A, B, inject.inherits(B, A)]
            'the modified class is returned': ([A, B, cls]) ->
                assert.equal cls, B
            'an instance of B':
                topic: ([A, B, cls]) -> [A, B, new B]
                'is an instance of B': ([A, B, obj]) ->
                    assert.instanceOf obj, B
                'is an instance of A': ([A, B, obj]) ->
                    assert.instanceOf obj, A
                'has properties from A': ([A, B, obj]) ->
                    assert.equal obj.foo, 1
                'has properties from B': ([A, B, obj]) ->
                    assert.equal obj.bar, 2

        'when B is injected into C, an instance of C':
            topic: ->
                class A
                class B
                class C extends A
                {obj: new (inject C, B), A, B, C}
            'is an instance of A': (t) -> assert.instanceOf t.obj, t.A
            'is an instance of B': (t) -> assert.instanceOf t.obj, t.B
            'is an instance of C': (t) -> assert.instanceOf t.obj, t.C

        'when A and B are injected into C':
            topic: ->
                class A
                class B
                class C
                inject C, B, A
                [A, B, C]
            'an instance of C':
                topic: ([A, B, C]) -> [A, B, C, new C]
                'is an instance of A': ([A, B, C, obj]) ->
                    assert.instanceOf obj, A
                'is an instance of B': ([A, B, C, obj]) ->
                    assert.instanceOf obj, B
                'is an instance of C': ([A, B, C, obj]) ->
                    assert.instanceOf obj, C
            'an instance of B':
                topic: ([A, B, C]) -> [A, B, C, new B]
                'is an instance of A': ([A, B, C, obj]) ->
                    assert.instanceOf obj, A
                'is an instance of B': ([A, B, C, obj]) ->
                    assert.instanceOf obj, B
                'is not an instance of C': ([A, B, C, obj]) ->
                    assert.isFalse obj instanceof C
            'an instance of A':
                topic: ([A, B, C]) -> [A, B, C, new A]
                'is an instance of A': ([A, B, C, obj]) ->
                    assert.instanceOf obj, A
                'is not an instance of B': ([A, B, C, obj]) ->
                    assert.isFalse obj instanceof B
                'is not an instance of C': ([A, B, C, obj]) ->
                    assert.isFalse obj instanceof C

    .export module
