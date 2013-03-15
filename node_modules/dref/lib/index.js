/**
 * finds references
 */

var _findValues = function(keyParts, target, create, index, values) {

	if(!values) {
		keyParts = (keyParts instanceof Array ? keyParts : keyParts.split(".")).filter(function(part) {
			return !!part.length;
		})
		values = [];
		index = 0;
	}

	var ct, j, kp, i = index, n = keyParts.length, pt = target;


	for(;i < n; i++) {
		kp = keyParts[i];
		ct = pt[kp];

		if(kp == '$') {
			for(j = pt.length; j--;) {
				_findValues(keyParts, pt[j], create, i + 1, values);
			}
			return values;
		} else
		if(!ct) {
			if(!create) return values;
			ct = pt[kp] = {};
		}

		pt = ct;
	}

	if(ct) {
		values.push(ct);
	} else {
		values.push(pt);
	}

	return values;
}


/**
 */

var getValue = function(target, key) {
	var values =  _findValues(key, target);

	return key.indexOf('.$.') == -1 ? values[0] : values;
}

/**
 */

var setValue = function(target, key, newValue) {
	var keyParts = key.split("."),
	keySet = keyParts.pop();

	if(keySet == '$') {
		keySet = keyParts.pop();
	}

	var values = _findValues(keyParts, target, true);


	for(var i = values.length; i--;) {
		values[i][keySet] = newValue;
	}

}


exports.get = getValue;
exports.set = setValue;
