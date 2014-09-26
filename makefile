ALL_TESTS = $(shell find ./test -name "*-test.js")
TIMEOUT=100
REPORTER=dot
ONLY = "."


all: browser min

browser:
	./node_modules/.bin/mojo build . -o ./build/mojo.js

min:
	./node_modules/.bin/mojo build . -m -o ./build/mojo.min.js

lint:
	./node_modules/.bin/jshint ./build/mojo.js

test-watch:
	./node_modules/.bin/_mocha $(ALL_TESTS) --timeout $(TIMEOUT) --ignore-leaks --bail --reporter $(REPORTER) -g $(ONLY) --watch ./test

test-node:
	./node_modules/.bin/_mocha $(ALL_TESTS) --timeout $(TIMEOUT) --ignore-leaks --bail --reporter $(REPORTER) -g $(ONLY)

