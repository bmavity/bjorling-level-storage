var levelup = require('levelup')
	, levelQuery = require('level-queryengine')
	, engine = require('jsonquery-engine')
	, errors = require('./errors')

function LevelStorage(location, key) {
	if(!(this instanceof LevelStorage)) {
		return new LevelStorage(location, key)
	}

	if(!location) throw new errors.InitializationError('Level Storage requires a location to be initialized.')
	if(!key) throw new errors.InitializationError('Level Storage requires a key to be initialized.')

	this._db = levelQuery(levelup(location, {
		createIfMissing: true
	, valueEncoding: 'json'
	}))
	this._db.query.use(engine())
	this._key = key
	this._indexes = []
}

LevelStorage.prototype.get = function(queryObj, cb) {
	var keyVal = queryObj[this._key]
	if(keyVal) {
		return this._db.get(keyVal, cb)
	}

	var indexName = this._indexes[0]
		, indexVal = queryObj[indexName]
		, q = {}
	q[indexName] = indexVal
	this._db.query(q)
		.on('data', function(result) {
			cb(null, result)
		})
		.on('stats', function(stats) {
			console.log(stats)
		})
		.on('error', cb)
}

LevelStorage.prototype.save = function(val, cb) {
	var keyVal = val[this._key]
	this._db.put(keyVal, val, cb)
}

LevelStorage.prototype.addIndex = function(index, cb) {
	this._indexes.push(index)
	this._db.ensureIndex(index)
	setImmediate(function() {
		cb()
	})
}

module.exports = LevelStorage