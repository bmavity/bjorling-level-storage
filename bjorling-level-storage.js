function LevelStorage(opts) {
	if(!(this instanceof LevelStorage)) {
		return new LevelStorage(opts)
	}
}

LevelStorage.prototype.get = function(queryObj, cb) {
	setImmediate(function() {
		cb(null, { theKey: '552230234', aVal: 'hiya' })
	})
}

LevelStorage.prototype.save = function(val, cb) {
	setImmediate(cb)
}


module.exports = LevelStorage