ONLY='.'

test-cov:
	./node_modules/.bin/istanbul cover \
	./node_modules/.bin/_mocha ./test/**-test.js --ignore-leaks --timeout 100

test-watch:
	./node_modules/.bin/_mocha ./test/**-test.js --ignore-leaks --timeout 100 --watch ./lib /test -g $(ONLY)
