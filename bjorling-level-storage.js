var levelup = require('levelup')

function LevelStorage(opts) {
	if(!(this instanceof LevelStorage)) {
		return new LevelStorage(opts)
	}

	this._db = levelup(opts.path, {
		createIfMissing: true
	}, function() {
		console.log(arguments)
	})
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