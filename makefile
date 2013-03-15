all:
	coffee -o public/lib -cw src;
	jam rebuild;

clean:
	rm -rf public/lib


test: 
	mocha . --timeout 99999
