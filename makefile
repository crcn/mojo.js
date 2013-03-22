all:
	coffee -o public/lib -c src;
	cp -rf public/lib lib;
	jam rebuild;

all-watch:
	coffee -o public/lib -cw src;

clean:
	rm -rf public/lib


test: 
	mocha . --timeout 99999
