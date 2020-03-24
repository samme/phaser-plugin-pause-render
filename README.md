Phaser 3 Pause Render Plugin 📱🔥
============================

```js
// Install:

new Phaser.Game({
    plugins: {
        global: [
            {
                key: 'PhaserPauseRenderPlugin',
                plugin: PhaserPauseRenderPlugin,
                mapping: 'rendering'
            }
        ]
    }
}
```

```js
// In a scene:

this.rendering.pause();
this.rendering.resume();

this.rendering.paused = true;
this.rendering.paused = false;
```

Modules
-------

Use this package's default export instead of `PhaserPauseRenderPlugin`.