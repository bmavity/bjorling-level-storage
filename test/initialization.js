var storage = require('../')
	, errors = require('../errors')
	, dbPath = './testdb/initialization'
	, eb = require('./eb')
	, leveldown = require('leveldown')
require('./shouldExtensions')

describe('level storage, when required', function() {
	it('should be a function', function() {
		storage.should.be.aFunction()
	})

	it('should accept 1 argument', function() {
		storage.length.should.equal(1)
	})
})

describe('level storage, when properly initialized', function() {
	var isReady = false
		, s

	before(function(done) {
		s = storage({
			key: 'theKey'
		, path: dbPath
		})

		s._db.on('ready', function() {
			isReady = true
			done()
		})

		s._db.on('error', function() {
			done()
		})
	})

	after(function() {
		s._db.close()
		leveldown.destroy(dbPath, function(err) {
			if(err) throw err
		})
	})

	it('should have a level db with the proper location', function() {
		s._db.location.should.equal(dbPath)
	})

	it('should be ready', function() {
		isReady.should.be.true
	})
})

describe('level storage, when initialized without a location', function() {
	var thrownError

	before(function() {
		try {
			storage({
				key: 'theKey'
			})
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

describe('level storage, when initialized without a key', function() {
	var thrownError

	before(function() {
		try {
			storage({
				path: dbPath
			})
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

