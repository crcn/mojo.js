all: browser

test-node:
	./node_modules/.bin/_mocha ./test/**/*-test.js --ignore-leaks --timeout 100

test-watch:
	./node_modules/.bin/_mocha ./test/**/*-test.js --ignore-leaks --timeout 100 --watch lib test

test-cov:
	./node_modules/.bin/istanbul cover \
	./node_modules/.bin/_mocha ./test/**/*-test.js --ignore-leaks --timeout 100

browser:	
	mkdir -p build
	./node_modules/.bin/browserify ./lib/index.js -o ./build/mojo.js

clean:
	rm -rf node_modules coverage build
