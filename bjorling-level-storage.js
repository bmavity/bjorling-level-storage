var levelup = require('levelup')
	, sub = require('level-sublevel')
	, levelQuery = require('level-queryengine')
	, engine = require('jsonquery-engine')
	, errors = require('./errors')

function LevelStorage(location, key) {
	if(!(this instanceof LevelStorage)) {
		return new LevelStorage(location, key)
	}

	if(!location) throw new errors.InitializationError('Bjorling Level Storage requires a location to be initialized.')

	this._db = levelQuery(sub(levelup(location, {
		createIfMissing: true
	, valueEncoding: 'json'
	})))
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

function BjorlingLevelProjectionStorage(projectionName, key) {
}

function getArgs(arrayLike) {
	return Array.prototype.slice.call(arrayLike, 0)
}

module.exports = function(location, key) {
	var s = new LevelStorage(location, key)
		, __bjorling = s._db.sublevel('__bjorling')
		, a = function(projectionName, key, cb) {
				if(!projectionName) {
					return cb(new errors.ProjectionInitializationError('Bjorling Level Projection Storage requires a projection name to be initialized.'))
				}
				if(!key) {
					return cb(new errors.ProjectionInitializationError('Bjorling Level Projection Storage requires a key to be initialized.'))
				}

				__bjorling.put(projectionName, {}, function(err) {
					if(err) return cb(err)
					cb(null, new BjorlingLevelProjectionStorage())
				})
			}
	a._db = s._db
	a._key = s._key
	a._indexes = s._indexes
	a.get = function() {
		return s.get.apply(s, getArgs(arguments))
	}
	a.save = function() {
		return s.save.apply(s, getArgs(arguments))
	}
	a.addIndex = function() {
		return s.addIndex.apply(s, getArgs(arguments))
	}
	return a
}