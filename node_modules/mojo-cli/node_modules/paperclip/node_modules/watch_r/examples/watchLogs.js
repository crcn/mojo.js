var watchr = require('../');

watchr('/var/logs', function(err, watcher)
{
	watcher.on('change', function(target)
	{    
		console.log("cupboard change");
		 
		console.log(target.path)
	})
	
	watcher.on('remove', function(target)
	{
		   
	});
})

watchr(process.env.HOME + '/.cupboard', function(err, watcher)
{
	watcher.on('change', function(target)
	{   
		console.log("CHANGE");
		 
		console.log(target.path)
	})
	
	watcher.on('remove', function(target)
	{
		console.log("REMOVE");
		console.log(target.path);
	});
});