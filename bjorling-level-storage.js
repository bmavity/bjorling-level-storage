var levelup = require('levelup')
	, sub = require('level-sublevel')
	, levelQuery = require('level-queryengine')
	, engine = require('jsonquery-engine')
	, errors = require('./errors')

function LevelStorage(location) {
	if(!(this instanceof LevelStorage)) {
		return new LevelStorage(location, key)
	}

	if(!location) throw new errors.InitializationError('Bjorling Level Storage requires a location to be initialized.')

	this._db = sub(levelup(location, {
		createIfMissing: true
	, valueEncoding: 'json'
	}))
}


function BjorlingLevelProjectionStorage(db, projectionName, key) {
	this._db = levelQuery(db)
	this._db.query.use(engine())

	this._key = key
	this._projectionName = projectionName

	this._indexes = []
}

BjorlingLevelProjectionStorage.prototype.get = function(queryObj, cb) {
	var keyVal = queryObj[this._key]
	if(keyVal) {
		return this._db.get(keyVal, cb)
	}

	var indexName = this._indexes[0]
		, indexVal = queryObj[indexName]
		, q = {}
		, result = null
	q[indexName] = indexVal
	this._db.query(q)
		.on('data', function(r) {
			result = r
		})
		.on('stats', function(stats) {
			console.log(stats)
		})
		.on('end', function() {
			cb(null, result)
		})
		.on('error', cb)
}

BjorlingLevelProjectionStorage.prototype.save = function(val, cb) {
	var keyVal = val[this._key]
	this._db.put(keyVal, val, cb)
}

BjorlingLevelProjectionStorage.prototype.addIndex = function(index, cb) {
	this._indexes.push(index)
	this._db.ensureIndex(index)
	setImmediate(function() {
		cb()
	})
}


function getArgs(arrayLike) {
	return Array.prototype.slice.call(arrayLike, 0)
}

module.exports = function(location, key) {
	var s = new LevelStorage(location, key)
		, __bjorling = s._db.sublevel('__bjorling')
		, a = function(projectionName, key, cb) {
				if(!projectionName) {
					var err = new errors.ProjectionInitializationError('Bjorling Level Projection Storage requires a projection name to be initialized.')
					if(cb) {
						return cb(err)
					}
					throw err
				}
				if(!key) {
					var err = new errors.ProjectionInitializationError('Bjorling Level Projection Storage requires a key to be initialized.')
					if(cb) {
						return cb(err)
					}
					throw err
				}

				var db = s._db.sublevel(projectionName)
					, p = new BjorlingLevelProjectionStorage(db, projectionName, key)
				__bjorling.put(projectionName, {}, function(err) {
					if(err &&  cb) return cb(err)
					cb && cb(null, p)
				})
				return p
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