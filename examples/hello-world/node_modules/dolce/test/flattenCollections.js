module.exports = function(result) {

	return Array.prototype.concat.apply([], result.chains);
}