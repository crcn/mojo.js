all:
	coffee -o lib -c src;

all-watch:
	coffee -o lib -cw src;

clean:
	rm -rf lib;

test:
	./node_modules/.bin/_mocha ./test/**/*-test.js --ignore-leaks --timeout 100

test-cov:
	./node_modules/.bin/istanbul cover \
	./node_modules/.bin/_mocha ./test/**/*-test.js --ignore-leaks --timeout 100

test-coveralls:
	./node_modules/.bin/istanbul cover \
	./node_modules/.bin/_mocha ./test/**/*-test.js --ignore-leaks --timeout 100 --report lcovonly -- -R spec && \
	cat ./coverage/lcov.info | ./node_modules/.bin/coveralls --verbose
	

