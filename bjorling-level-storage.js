var levelup = require('levelup')
	, errors = require('./errors')

function LevelStorage(location, key) {
	if(!(this instanceof LevelStorage)) {
		return new LevelStorage(location, key)
	}

	if(!location) throw new errors.InitializationError('Level Storage requires a location to be initialized.')
	if(!key) throw new errors.InitializationError('Level Storage requires a key to be initialized.')

	this._db = levelup(location, {
		createIfMissing: true
	})
	this._key = key
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