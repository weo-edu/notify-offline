/**
 * Imports
 */

var Offline = require('..')
var Emitter = require('component-emitter')
var test = require('tape')

/**
 * Tests
 */

var offline, socket, squelches, notifies

test('should notify on disconnect', function (t) {
  setup()

  socket.emit('connect')

  t.equal(squelches, 1)

  socket.emit('disconnect')

  t.equal(notifies, 0)

  setTimeout(function () {
    t.equal(notifies, 1)
    t.end()
  })

})

test('should delay and throttle disconnect', function (t) {
  setup(100)

  socket.emit('connect')

  t.equal(squelches, 1)

  socket.emit('disconnect')
  socket.emit('disconnect')

  t.equal(notifies, 0)

  setTimeout(function () {
    t.equal(notifies, 1)
    t.end()
  }, 110)

})

test('should not notify when disabled', function (t) {
  setup()

  offline.disable()

  socket.emit('connect')

  t.equal(squelches, 1)

  socket.emit('disconnect')

  t.equal(notifies, 0)

  setTimeout(function () {
    t.equal(notifies, 0)
    t.end()
  })

})

test('should notify on enable', function (t) {
  setup()

  offline.disable()

  socket.emit('connect')

  t.equal(squelches, 1)

  socket.emit('disconnect')

  t.equal(notifies, 0)

  setTimeout(function () {
    t.equal(notifies, 0)

    offline.enable()
  })

  setTimeout(function () {
    t.equal(notifies, 1)
    t.end()
  }, 5)
})

function setup (timeout) {
  offline = new Offline(timeout)
  socket = new Emitter()

  squelches = 0
  notifies = 0

  offline.on('squelch', function () {
    squelches++
  })

  offline.on('notify', function () {
    notifies++
  })

  offline.listen(socket)
}
