testt:
	./node_modules/.bin/_mocha ./test --ignore-leaks --timeout 100

test-watch:
	./node_modules/.bin/_mocha ./test/**/*-test.js --ignore-leaks --timeout 100 --watch ./lib/index.js ./test

test-cov:
	./node_modules/.bin/istanbul cover \
	./node_modules/.bin/_mocha ./test --ignore-leaks --timeout 100

browser:
	mkdir -p build
	./node_modules/.bin/browserify ./lib/index.js > build/nofactor.js

test-coveralls:
	./node_modules/.bin/istanbul cover \
	./node_modules/.bin/_mocha ./test--ignore-leaks --timeout 100 --report lcovonly -- -R spec && \
	cat ./coverage/lcov.info | ./node_modules/.bin/coveralls --verbose
