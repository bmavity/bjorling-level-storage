var storage = require('../')
	, bjorling = require('bjorling')
	, dbPath = './testdb/bjorlingIntegration'
	, eb = require('./eb')
	, leveldown = require('leveldown')

describe('bjorling storage integration, when retrieving projection state', function() {
	var db
		, state

	before(function(done) {
		var s = storage(dbPath)
			, b = bjorling(__filename, {
					storage: s
				, key: 'storageId'
				})
		db = s._db
		b.when({
			'$new': function(e) {
				return {
					storageId: e.data.storageId
				, count: 0
				, ids: []
				}
			}
		, 'FirstEvent': function(s, e) {
				s.count += 1
				s.ids.push(e.eventId)
			}
		, 'SecondEvent': function(s, e) {
				s.count += 2
				s.ids.push(e.eventId)
			}
		})

		function getEntry() {
			b.get('abcdef', function(err, val) {
				if(err) return done(err)
				state = val
				done()
			})
		}

		function addEvent(evt, cb) {
			b.processEvent(evt, cb)
		}

		setImmediate(function() {
			addEvent({
				__type: 'SecondEvent'
			, data: {
					storageId: 'abcdef'
				, eventId: 1
				}
			}, function() {
				addEvent({
					__type: 'FirstEvent'
				, data: {
						storageId: 'abcdef'
					, eventId: 3
					}
				}, getEntry)
			})
		})
	})

	after(function(done) {
		db.close(function(err) {
			if(err) done()
			leveldown.destroy(dbPath, done)
		})
	})

  it('should have the proper count', function() {
  	state.count.should.equal(3)
  })

  it('should contain the first event id', function() {
  	state.ids.should.contain(3)
  })

  it('should contain the second event id', function() {
  	state.ids.should.contain(1)
  })
})
