
Dolce is a collection library used primarily for routing.  [![Build Status](https://secure.travis-ci.org/crcn/dolce.js.png)](https://secure.travis-ci.org/crcn/dolce)

## Use Cases:




## Basic Example:

```javascript
var dolce = require('dolce'),
col1 = dolce.collection(),
col2 = dolce.collection(),
col3 = dolce.collection(),
col4 = dolce.collection(),
col5 = dolce.collection();

//explicit chain
col1.add('hello', 'HELLO');
col1.add('hello -> world', 'WORLD');

console.log(col1.get('world')); //[{ value: 'HELLO' }, { value: 'WORLD' }]

//parameters
col5.add('validate/:name');
col5.add('validate/:firstName -> add/user/:firstName/:lastName');
console.log(col5.get('add/user/craig/condon')); //[{ value: 'HELLO' }, { value: 'WORLD' }]

//implicit chain
col2.add('hello/*', 'HELLO')
col2.add('hello', 'WORLD');

console.log(col2.get('hello')); //[{ value: 'HELLO' }, { value: 'WORLD' } ]

//greedy chain
col3.add('hello/**', 'HELLO')
col3.add('hello/awesome/**', 'AWESOME');
col3.add('hello/awesome/world', 'WORLD');

console.log(col3.get('hello/awesome/world')); //[{ value: 'HELLO' }, { value: 'AWESOME' }, { value: 'WORLD' } ]

//filtering chains
col4.add('-method=UPDATE users/:userid','update user');
col4.add('-method=DELETE users/:userid', 'delete user');
col4.add('-method=GET users/:userid', 'get user');

console.log(col4.get('users/14732843', { tags: { method: 'GET' } })); //[{ tags: { method: 'GET' }, value: 'get user' }];
```

## API

### .add(type, value);

Adds data to the collection


### .addObject(value);

Adds an object to the collection

```javascript

collection.addObject({
	'key': 1,
	'key2': 2
})
```

### .get(channel[, ops])

Returns a collection based on the params given

- `channel` - the path to the value, e.g., 'add/user', 'validate/some/stuff'
- `ops` - the options for fetching data
	- `tags` - the tags to filter against

A returned value may look something like this:

```javascript

{
  "paths": [
    {
      "value": "users",
      "param": false
    },
    {
      "value": "14732843",
      "param": false
    }
  ],
  "tags": {
    "method": "GET"
  },
  "chains": [
    [
      {
        "paths": [
          {
            "value": "users",
            "param": false
          },
          {
            "value": "userid",
            "param": true
          }
        ],
        "params": {
          "userid": "14732843"
        },
        "tags": {
          "method": "GET"
        },
        "value": "get user"
      }
    ]
  ]
}

```

### .contains(channel[, ops])

TRUE if the given channel exists in the collection. API is the same as `.get`


## Caveats

```javascript

collection.add('-anotherTag validate/**');
collection.add('-method=POST validate/**');
collection.get('-method=POST validate/login');

//goes through -method=POST validate/** before getting to login, NOT -anotherTag validate/** 
collection.get('validate/login'); 


collection.add('-method=POST validate/**');
collection.get('-method validate/login');

//does NOT go through validate/** because the method is not POST
collection.get('validate/login'); 



//this doesn't work
collection.add(':param/*');

//with this.
collection.add('path');

//but with this this:
collection.add('someParam');

```




