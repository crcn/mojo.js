ALL_TESTS = $(shell find ./test -name "*-test.js")
TIMEOUT=100
REPORTER=dot
ONLY = "."

all: browser min

browser:
	./node_modules/.bin/mojo build . > ./build/mojo.js

min:
	./node_modules/.bin/mojo build . -m > ./build/mojo.min.js

test-watch:
	./node_modules/.bin/_mocha $(ALL_TESTS) --timeout $(TIMEOUT) --ignore-leaks --bail --reporter $(REPORTER) -g $(ONLY) --watch ./test

test-node:
	./node_modules/.bin/_mocha $(ALL_TESTS) --timeout $(TIMEOUT) --ignore-leaks --bail --reporter $(REPORTER) -g $(ONLY)
