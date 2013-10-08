var storage = require('../')
	, errors = require('../errors')
	, dbPath = './testdb/initialization'
	, eb = require('./eb')
	, level = require('levelup')
	, leveldown = require('leveldown')
require('./shouldExtensions')

describe('bjorling level storage, when initialized with a valid location, and the location does not contain an existing leveldb instance', function() {
	var db = null

	before(function(done) {
		var s = storage(dbPath, true)

		function openDb() {
			level(dbPath, { createIfMissing: false }, function(err, newdb) {
				if(err) return done(err)
				db = newdb
				done()
			})
		}

		s._db.on('ready', function() {
			s._db.close(openDb)
		})
	})

	after(function(done) {
		db.close(function() {
			leveldown.destroy(dbPath, done)
		})
	})

	it('should create a leveldb instance in that location', function() {
		db.should.not.be.null
	})
})

describe('level storage, when initialized without a location', function() {
	var thrownError

	before(function() {
		try {
			storage(null, 'theKey')
		}
		catch(ex) {
			thrownError = ex
		}
	})

	it('should cause an InitializationError', function() {
		thrownError.should.be.instanceOf(errors.InitializationError)
	})

	it('should cause an error message indicating the problem', function() {
		thrownError.message.should.include('location')
	})
})

/*
describe('level storage, when initialized without a key', function() {
	var thrownError

	before(function() {
		try {
			storage(dbPath)
		}
		catch(ex) {
			thrownError = ex
		}
	})

	it('should cause an InitializationError', function() {
		thrownError.should.be.instanceOf(errors.InitializationError)
	})

	it('should cause an error message indicating the problem', function() {
		thrownError.message.should.include('key')
	})
})
*/

