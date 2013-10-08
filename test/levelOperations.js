var storage = require('../')
	, dbPath = './testdb/levelOperations'
	, eb = require('./eb')
	, leveldown = require('leveldown')

describe('bjorling level storage, when projection state is stored', function() {
	var originalValue = {
			theKey: '552230234'
		, aVal: 'hiya'
		}
		, savedKey
		, savedVal
		, s

	before(function(done) {
		s = storage(dbPath, 'theKey')

		s._db.on('put', function(key, val) {
			savedKey = key
			savedVal = val
			done()
		})

		s._db.on('error', eb(done))

		s._db.on('ready', eb(done, function() {
			s.save(originalValue, eb(done))
		}))
	})

	after(function(done) {
		s._db.close(function(err) {
			if(err) done()
			leveldown.destroy(dbPath, done)
		})
	})

	it('should use the proper key', function() {
		savedKey.should.equal('552230234')
	})

	it('should store value in level db', function() {
		savedVal.should.eql(originalValue)
	})
})