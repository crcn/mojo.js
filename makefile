all:
	mesh build-src;

web:
	amdify -e ./lib/index.js -o ./web

browser:
	sardines ./lib/index.js -o ./build/mojo5.js -p browser

all-watch:
	mesh build-src --watch;

clean:
	rm -rf public/lib
	rm -rf lib


test: 
	mocha . --timeout 99999

link:
	ln -s `cbd dir mojo` `cbd dir dojo`/public/js/teacher/web/vendor
