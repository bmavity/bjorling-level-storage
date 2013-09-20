var storage = require('../')
	, dbPath = './testdb'

describe('level storage, when a projection value is stored', function() {
	var originalValue = {
			theKey: '552230234'
		, aVal: 'hiya'
		}
		, retrievedVal
		, s

	before(function(done) {
		function completeGet(err, val) {
			if(err) return done(err)
			retrievedVal = val
			done()
		}

		function performGetValue(err) {
			if(err) return done(err)

	  	s.get({
	  		theKey: '552230234'
	  	, anotherVal: 'part of the event'
	  	}, completeGet)
		}

		s = storage({
			key: 'theKey'
		, path: dbPath
		})

		s.save(originalValue, performGetValue)

	})

  it('should allow retrieval of value by key', function() {
  	retrievedVal.should.eql(originalValue)
  })
})
