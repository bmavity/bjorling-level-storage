var levelup = require('levelup')
	, errors = require('./errors')

function LevelStorage(opts) {
	if(!(this instanceof LevelStorage)) {
		return new LevelStorage(opts)
	}

	if(!opts.path) throw new errors.InitializationError('Level Storage requires a location to be initialized.')

	this._db = levelup(opts.path, {
		createIfMissing: true
	})
	this._key = opts.key
}

LevelStorage.prototype.get = function(queryObj, cb) {
	setImmediate(function() {
		cb(null, { theKey: '552230234', aVal: 'hiya' })
	})
}

LevelStorage.prototype.save = function(val, cb) {
	var keyVal = val[this._key]
	this._db.put(keyVal, val, cb)
}


module.exports = LevelStorage