var dolce = require('../'),
col1 = dolce.collection(),
col2 = dolce.collection(),
col3 = dolce.collection(),
col4 = dolce.collection(),
col5 = dolce.collection();


function logCollection(target) {
	console.log(JSON.stringify(target, null, 2));
}

//explicit middleware
col1.add('hello', 'HELLO');
col1.add('hello -> world', 'WORLD');

logCollection(col1.get('world')); //[{ value: 'HELLO' }, { value: 'WORLD' }]

//parameters
col5.add('validate/:name');
col5.add('validate/craig'); // this gets picked
col5.add('validate/:firstName -> add/user/:firstName/:lastName');
logCollection(col5.get('add/user/craig/condon')); //[{ value: 'HELLO' }, { value: 'WORLD' }]



//implicit middleware
col2.add('hello/*', 'HELLO')
col2.add('hello', 'WORLD');

logCollection(col2.get('hello')); //[{ value: 'HELLO' }, { value: 'WORLD' } ]

//greedy middleware
col3.add('hello/**', 'HELLO')
col3.add('hello/awesome/**', 'AWESOME');
col3.add('hello/awesome/world', 'WORLD');

logCollection(col3.get('hello/awesome/world')); //[{ value: 'HELLO' }, { value: 'AWESOME' }, { value: 'WORLD' } ]

//filtering middleware
col4.add('-method=UPDATE users/:userid','update user');
col4.add('-method=DELETE users/:userid', 'delete user');
col4.add('-method=GET users/:userid', 'get user');

logCollection(col4.get('users/14732843', { tags: { method: 'GET' } })); //[{ tags: { method: 'GET' }, value: 'get user' }];

col4.get('users/14732843', { tags: { method: 'GET' } });