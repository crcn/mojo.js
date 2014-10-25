ALL_TESTS = $(shell find ./test -name "*-test.js")
all: browser
ONLY="."

test-node:
	./node_modules/.bin/_mocha $(ALL_TESTS) --ignore-leaks --timeout 1000 -g $(ONLY) -b

test-watch:
	./node_modules/.bin/_mocha $(ALL_TESTS) --ignore-leaks --timeout 1000 -g $(ONLY) -b --watch lib test

test-cov:
	./node_modules/.bin/istanbul cover \
	./node_modules/.bin/_mocha $(ALL_TESTS) --ignore-leaks --timeout 1000

browser:
	mkdir -p build
	./node_modules/.bin/browserify ./lib/index.js -o ./build/mojo.js

clean:
	rm -rf node_modules coverage build
