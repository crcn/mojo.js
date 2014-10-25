var poolparty = require("../"),
expect = require("expect.js"),
protoclass = require("protoclass");


function createPool(options) {
  if (!options) options = {};
  var objectPool, object = {};

  function TestObject (options) {
    this.reset(options);
  }

  protoclass(TestObject, {
    reset: function (options) {
      this.options = options;
    },
    dispose: function () {
      this._wasDisposed = true;
      objectPool.add(this);
    }
  });

  return objectPool = poolparty({
    max: options.max || 100,
    min: options.min || 0,
    warmUpBatch: options.warmUpBatch || 1,
    staleInterval: options.staleInterval || 10,
    create: function(options) {
      return new TestObject(options);
    },
    recycle: function(testObject, options) {
      testObject.reset(options);
    }
  });
}

describe("poolparty", function() {

  it("can create a pool party", function() {
    createPool({
      max: 10,
      min: 1,
      staleInterval: 10
    });
  });

  it("can create a pool party without options", function () {
    poolparty();
  })

  it("can create an object", function(){
    expect(createPool().create({name:"john"}).options.name).to.be("john");
  });

  it("adds the object to the pool after it's been disposed", function (){
    var pool = createPool(),
    obj = pool.create({ name: "john" });
    obj.dispose();
    expect(pool._pool).to.contain(obj);
    expect(pool.size()).to.be(1);
  });

  it("can call .add()", function(){
    var pool = createPool(), obj;
    pool.add(obj = { name: "john" })
    expect(pool._pool).to.contain(obj);
  });

  it("cannot re-add the same object", function (){
    var pool = createPool(), obj;
    pool.add(obj = { name: "john" });
    pool.add(obj);
    expect(pool.size()).to.be(1);
  });

  it("can re-use an object in the pool", function () {
    var pool = createPool(), obj, obj2;
    obj = pool.create({ name: "john" });
    obj.dispose();
    expect(pool._size).to.be(1);
    obj2 = pool.create({ name: "liam" });
    expect(obj).to.be(obj2);
    expect(pool.size()).to.be(0);
  });

  it("cannot exceed the max number of items in a pool", function() {
    var pool = createPool({ max: 5 }), items = [];
    for (var i = 100;i --;) {
      items.push(pool.create({ name: "john" }));
    }
    for (var j = items.length; j--;) {
      items[j].dispose();
    }
    expect(pool.size()).to.be(5);
  });

  it("can drain the pool, and still maintain the min number of items", function () { 
    var pool = createPool({ max: 5, min: 2 }), items = [];
    for (var i = 5; i--;) {
      items.push(pool.create({ name: "john" }));
    }
    for (var j = items.length; j--;) {
      items[j].dispose();
    }
    expect(pool.size()).to.be(5);
    pool.drain();
    expect(pool.size()).to.be(2);
  });

  it("can manually drip the pool, and maintain the min number of items", function (){

    var pool = createPool({ max: 5, min: 2 }), items = [];
    for (var i = 5; i--;) {
      items.push(pool.create({ name: "john" }));
    }
    for (var j = items.length; j--;) {
      items[j].dispose();
    }

    for(var i = 5; i--;) {
      pool.drain();
    }

    expect(pool.size()).to.be(2);
  });

  it("removes stale items periodically", function (next) { 
    var pool = createPool({ staleInterval: 10 });
    pool.create({ name: "john" }).dispose();
    setTimeout(function () {
      expect(pool.size()).to.be(0);
      next();
    }, 20); 
  });


  it("can warm up objects in batches of 1", function(next) {
    var pool = createPool({ min: 5, warmUpBatch: 1 });
    setTimeout(function () {
      expect(pool.size()).to.be(5);
      next();
    }, 40);
  });

  it("can warm up objects in batches of 5", function(next) {
    var pool = createPool({ min: 6, warmUpBatch: 5 });
    setTimeout(function () {
      expect(pool.size()).to.be(6);
      next();
    }, 5);
  });

  it("maintains the same number of warm objects after they're used", function(next) {
    var pool = createPool({ min: 5, warmUpBatch: 5 });
    setTimeout(function () {
      expect(pool.size()).to.be(5);
      for (var i = 5; i--;)  pool.create({ name: "blah" });
      expect(pool.size()).to.be(0);
      setTimeout(function () {
        expect(pool.size()).to.be(5);
        next();
      }, 2);
    }, 2);
  });

});