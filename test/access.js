var storage = require('../')
	, dbPath = './testdb'
	, eb = function errback(cb) {
			return function(err, val) {
				if(err) return cb(err)
				cb(val)
			}
		}

describe('level storage, when a projection value is stored', function() {
	var originalValue = {
			theKey: '552230234'
		, aVal: 'hiya'
		}
		, retrievedVal
		, s

	before(function(done) {
		var completeGet = eb(function(val) {
			retrievedVal = val
			done()
		})

		var performGetValue = eb(function() {
	  	s.get({
	  		theKey: '552230234'
	  	, anotherVal: 'part of the event'
	  	}, completeGet)
		})

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
