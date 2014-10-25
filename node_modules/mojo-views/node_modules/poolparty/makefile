make tesclean:
	rm -rf coverage;

testt:
	./node_modules/.bin/_mocha ./test/*-test.js --ignore-leaks

test-cov:
	./node_modules/.bin/istanbul cover \
	./node_modules/.bin/_mocha ./test/*-test.js --ignore-leaks

test-coveralls:
	./node_modules/.bin/istanbul cover \
	./node_modules/.bin/_mocha ./test/*-test.js --ignore-leaks --report lcovonly -- -R spec && \
	cat ./coverage/lcov.info | ./node_modules/.bin/coveralls --verbose
	


