var levelup = require('levelup')
	, uuid = require('node-uuid')

function LevelStorage(opts) {
	if(!(this instanceof LevelStorage)) {
		return new LevelStorage(opts)
	}

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