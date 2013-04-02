all:
	coffee -o public/lib -c src;
	cp -rf public/lib/core lib;
	jam rebuild;

all-watch:
	coffee -o lib -cw src/core;

clean:
	rm -rf public/lib
	rm -rf lib


test: 
	mocha . --timeout 99999
