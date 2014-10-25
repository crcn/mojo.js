all: browser min

browser:
	./node_modules/.bin/mojo build . -o ./dist/mojo.js

min:
	./node_modules/.bin/mojo build . -m -o ./dist/mojo.min.js