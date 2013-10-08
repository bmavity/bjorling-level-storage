var storage = require('../')
	, dbPath = './testdb/access'
	, eb = require('./eb')
	, leveldown = require('leveldown')

describe('level storage, when retrieving state with an event that contains a value for the key', function() {
	var originalValue = {
				theKey: '552230234'
			, aVal: 'hiya'
			}
		, retrievedVal
		, s

	before(function(done) {
		function completeGet(val) {
			retrievedVal = val
			done()
		}

		function performGetValue() {
	  	s.get({
	  		theKey: '552230234'
	  	, anotherVal: 'part of the event'
	  	}, eb(done, completeGet))
		}

		s = storage(dbPath, 'theKey')

		s.save(originalValue, eb(done, performGetValue))
	})

	after(function(done) {
		s._db.close(function(err) {
			if(err) done()
			leveldown.destroy(dbPath, done)
		})
	})

  it('should retrieve the proper state', function() {
  	retrievedVal.should.eql(originalValue)
  })
})

describe('level storage, when retrieving state with an event that does not contain a value for the key, but matches an index', function() {
	var val1 = {
				theKey: 'key1'
			, aVal: 'val 1'
			}
		, retrievedVal
		, s

	before(function(done) {
		function completeGet(val) {
			retrievedVal = val
			done()
		}

		function performGetValue() {
			var evt1
	  	s.get({
	  	  anotherVal: 'part of the event'
	  	, aVal: 'val 1'
	  	}, eb(done, completeGet))
		}

		s = storage(dbPath, 'theKey')

		s.addIndex('aVal', function() {
			s.save(val1, eb(done, performGetValue))
		})
	})

	after(function(done) {
		s._db.close(function(err) {
			if(err) done()
			leveldown.destroy(dbPath, done)
		})
	})

  it('should allow retrieval of value by key', function() {
  	retrievedVal.should.eql(val1)
  })
})