var storage = require('../')
	, dbPath = './testdb/singleProjectionAccess'
	, eb = require('./eb')
	, leveldown = require('leveldown')

describe('level storage, when retrieving state with an event that contains a value for the key', function() {
	var db
		, originalValue = {
				theKey: '552230234'
			, aVal: 'hiya'
			}
		, retrievedVal
		, projectionStorage

	before(function(done) {
		function completeGet(val) {
			retrievedVal = val
			done()
		}

		function performGetValue() {
	  	projectionStorage.get({
	  		theKey: '552230234'
	  	, anotherVal: 'part of the event'
	  	}, eb(done, completeGet))
		}

		function performSave(p) {
			projectionStorage = p
			projectionStorage.save(originalValue, eb(done, performGetValue))
		}
		
		var s = storage(dbPath)
		db = s._db
		s('spec 1', 'theKey', eb(done, performSave))
	})

	after(function(done) {
		db.close(function(err) {
			if(err) done()
			leveldown.destroy(dbPath, done)
		})
	})

  it('should retrieve the proper state', function() {
  	retrievedVal.should.eql(originalValue)
  })
})

describe('level storage, when retrieving state with an event that does not contain a value for the key, but matches an index', function() {
	var db
		, val1 = {
				theKey: 'key1'
			, aVal: 'val 1'
			}
		, retrievedVal
		, projectionStorage


	before(function(done) {
		function completeGet(val) {
			retrievedVal = val
			done()
		}

		function performGetValue() {
			var evt1
	  	projectionStorage.get({
	  	  anotherVal: 'part of the event'
	  	, aVal: 'val 1'
	  	}, eb(done, completeGet))
		}

		var s = storage(dbPath)
		db = s._db
		s('proj 2', 'theKey', eb(done, function(p) {
			projectionStorage = p
			projectionStorage.addIndex('aVal', function() {
				projectionStorage.save(val1, eb(done, performGetValue))
			})
		}))
	})

	after(function(done) {
		db.close(function(err) {
			if(err) done()
			leveldown.destroy(dbPath, done)
		})
	})

  it('should allow retrieval of value by key', function() {
  	retrievedVal.should.eql(val1)
  })
})

describe('level storage, when retrieving state with an event that does not contain a value for the key, but matches an index in an array', function() {
	var db
		, val1 = {
				theKey: 'key1'
			, aVal: ['val 1', 'val 3']
			}
		, retrievedVal
		, projectionStorage


	before(function(done) {
		function completeGet(val) {
			retrievedVal = val
			done()
		}

		function performGetValue() {
			var evt1
	  	projectionStorage.get({
	  	  anotherVal: 'part of the event'
	  	, aVal: 'val 3'
	  	}, eb(done, completeGet))
		}

		var s = storage(dbPath)
		db = s._db
		s('proj 2', 'theKey', eb(done, function(p) {
			projectionStorage = p
			projectionStorage.addIndex('aVal', function() {
				projectionStorage.save(val1, eb(done, performGetValue))
			})
		}))
	})

	after(function(done) {
		db.close(function(err) {
			if(err) done()
			leveldown.destroy(dbPath, done)
		})
	})

  it('should allow retrieval of value by key', function() {
  	retrievedVal.should.eql(val1)
  })
})
