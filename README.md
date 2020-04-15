Phaser 3 Pause Render Plugin 📱🔥
============================

Install
-------

```js
new Phaser.Game({
    plugins: {
        global: [
            { key: 'PhaserPauseRenderPlugin', plugin: PhaserPauseRenderPlugin, mapping: 'render' }
        ]
    }
}
```

You can use any `mapping`.

Modules
-------

```js
import PauseRenderPlugin from 'phaser-plugin-pause-render';
```

Then use the imported value instead of `PhaserPauseRenderPlugin`.

Use
---

```js
// In a scene:

this.render.pause();
this.render.resume();

this.render.paused = true;
this.render.paused = false;
```
