all: browser min

browser:
	./node_modules/.bin/mojo build . > ./build/mojo.js

min:
	./node_modules/.bin/mojo build . -m > ./build/mojo.min.js
