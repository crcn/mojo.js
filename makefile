all:
	coffee -o lib -c src	

clean:
	rm -rf lib


test: 
	mocha . --timeout 99999
