var levelup = require('levelup')
	, uuid = require('node-uuid')

function LevelStorage(opts) {
	if(!(this instanceof LevelStorage)) {
		return new LevelStorage(opts)
	}

	this._db = levelup(opts.path, {
		createIfMissing: true
	})
}

LevelStorage.prototype.get = function(queryObj, cb) {
	setImmediate(function() {
		cb(null, { theKey: '552230234', aVal: 'hiya' })
	})
}

LevelStorage.prototype.save = function(val, cb) {
	this._db.put(uuid.v4(), val, cb)
}


module.exports = LevelStorage