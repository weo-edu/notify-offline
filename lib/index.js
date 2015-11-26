/**
 * Modules
 */

var Emitter = require('component-emitter')

/**
 * Expose notifyOffline
 */

module.exports = Offline

/**
 * Offline notifier
 * @param {Number} timeout Delay for notification
 */

function Offline (timeout) {
  var self = this
  Emitter(self)
  self.disabled = false
  self.timeout = timeout
  self.notifying = false
  self.squelch = this.squelch.bind(this)
  self.notify = this.notify.bind(this)
}

/**
 * Is offline
 * @return {Boolean}
 */

Offline.prototype.is = function () {
  return !this.connected
}

/**
 * Listen to a socket.io style emitter
 * @param  {Emitter} socket
 */

Offline.prototype.listen = function (socket) {
  var self = this
  if (self.socket) {
    self.stopListening()
  }
  socket.on('disconnect', this.notify)
  socket.on('connect', this.squelch)
  socket.on('reconnect', this.squelch)
  self.socket = socket
}

/**
 * Stop listening to the current socket
 */

Offline.prototype.stopListening = function () {
  var self = this
  var socket = self.socket
  socket.off('disconnect', this.notify)
  socket.off('connect', this.squelch)
  socket.off('reconnect', this.squelch)
  self.socket = null
}

/**
 * Disable notifications
 */

Offline.prototype.disable = function () {
  this.disabled = true
}

/**
 * Enable notification and notify if offline
 */

Offline.prototype.enable = function () {
  var self = this
  self.disabled = false
  if (self.is()) {
    self.notify()
  }
}

/**
 * Is connected
 * @return {Boolean}
 */

Object.defineProperty(Offline.prototype, 'connected', {
  get: function () {
    return this.socket && this.socket.connected
  }
})

/**
 * Emit squelch
 */

Offline.prototype.squelch = function () {
  var self = this
  self.emit('squelch')
  self.notifying = false
}

/**
 * Emit notify
 */

Offline.prototype.notify = function () {
  var self = this
  setTimeout(function () {
    if (self.is() && !self.disabled && !self.notifying) {
      self.notifying = true
      self.emit('notify')
    }
  }, self.timeout)
}
