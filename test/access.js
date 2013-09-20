var storage = require('../')
	, dbPath = './testdb'
	, eb = require('./eb')

describe('level storage, when a projection value is stored', function() {
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

		s = storage({
			key: 'theKey'
		, path: dbPath
		})

		s.save(originalValue, eb(done, performGetValue))
	})

  it('should allow retrieval of value by key', function() {
  	retrievedVal.should.eql(originalValue)
  })
})
