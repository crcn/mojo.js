all:
	coffee -b -o public/lib -c src;
	cp -rf public/lib/core lib;
	jam rebuild;

all-watch:
	coffee -b -o lib -cw src/core;

clean:
	rm -rf public/lib
	rm -rf lib


test: 
	mocha . --timeout 99999

link:
	ln -s `cbd dir mojo` `cbd dir dojo`/public/js/teacher/web/vendor
