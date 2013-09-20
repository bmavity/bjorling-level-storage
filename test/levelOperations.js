var storage = require('../')
	, dbPath = './testdb/levelOperations'
	, eb = require('./eb')

describe('level storage, when a projection value is stored', function() {
	var originalValue = {
			theKey: '552230234'
		, aVal: 'hiya'
		}
		, savedKey
		, savedVal
		, s

	before(function(done) {
		s = storage({
			key: 'theKey'
		, path: dbPath
		})

		s._db.on('put', function(key, val) {
			savedVal = val
			done()
		})

		s._db.on('error', eb(done))

		s._db.on('ready', eb(done, function() {
			console.log('ready')
			s.save(originalValue, eb(done))
		}))
	})

	after(function() {
		s._db.close()
	})

	it('should store value in level db', function() {
		savedVal.should.eql(originalValue)
	})
})