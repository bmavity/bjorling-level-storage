function eb(cb) {
	return function(err, val) {
		if(err) return cb(err)
		cb(val)
	}
}

module.exports = eb
