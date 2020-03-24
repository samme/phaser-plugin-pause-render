'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Phaser = _interopDefault(require('phaser'));

var ref = Phaser.Core.Events;
var PRE_STEP = ref.PRE_STEP;
var STEP = ref.STEP;
var POST_STEP = ref.POST_STEP;
var PRE_RENDER = ref.PRE_RENDER;
var POST_RENDER = ref.POST_RENDER;
var DESTROY = ref.DESTROY;

var _origStep = Phaser.Game.prototype.step;

var paused = false;

var _step = function (time, delta) {
  if (this.pendingDestroy) {
    return this.runDestroy();
  }

  var ref = this;
  var events = ref.events;
  var renderer = ref.renderer;

  events.emit(PRE_STEP, time, delta);
  events.emit(STEP, time, delta);
  this.scene.update(time, delta);
  events.emit(POST_STEP, time, delta);

  if (paused) { return; }

  renderer.preRender();
  events.emit(PRE_RENDER, renderer, time, delta);
  this.scene.render(renderer);
  renderer.postRender();
  events.emit(POST_RENDER, renderer, time, delta);
};

var PauseRenderPlugin = /*@__PURE__*/(function (superclass) {
  function PauseRenderPlugin () {
    superclass.apply(this, arguments);
  }

  if ( superclass ) PauseRenderPlugin.__proto__ = superclass;
  PauseRenderPlugin.prototype = Object.create( superclass && superclass.prototype );
  PauseRenderPlugin.prototype.constructor = PauseRenderPlugin;

  var prototypeAccessors = { paused: { configurable: true } };

  PauseRenderPlugin.prototype.init = function init (data) {
    this.paused = (data && data.paused) || false;
  };

  PauseRenderPlugin.prototype.start = function start () {
    this.game.events.once(DESTROY, this.destroy, this);

    this.game.step = _step;
  };

  PauseRenderPlugin.prototype.stop = function stop () {
    this.resume();
    this.game.step = _origStep;
  };

  PauseRenderPlugin.prototype.destroy = function destroy () {
    this.stop();

    superclass.prototype.destroy.call(this);
  };

  PauseRenderPlugin.prototype.pause = function pause () {
    paused = true;
  };

  PauseRenderPlugin.prototype.resume = function resume () {
    paused = false;
  };

  prototypeAccessors.paused.get = function () {
    return paused;
  };

  prototypeAccessors.paused.set = function (val) {
    return (paused = val);
  };

  Object.defineProperties( PauseRenderPlugin.prototype, prototypeAccessors );

  return PauseRenderPlugin;
}(Phaser.Plugins.BasePlugin));

module.exports = PauseRenderPlugin;
