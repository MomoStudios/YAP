var game = {

    data : {
        score : 0,
        won : false
    },

    // custom collision types
    collisionTypes : {
        PLAYER_HITBOX : me.collision.types.USER << 0,
        ENEMY_HITBOX : me.collision.types.USER << 1,
    },

    // log function. For now, just throw it to console
    log : function(message) {
        console.log(message)
    },


    // Run on page load.
    "onload" : function () {
        // Initialize the video.
        if (!me.video.init(640, 480, {wrapper : "screen", scale : "auto", scaleMethod: "fit"})) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }

        // Initialize the audio.
        me.audio.init("mp3,ogg");

        // set and load all resources.
        // (this will also automatically switch to the loading screen)
        me.loader.preload(game.resources, this.loaded.bind(this));
    },

    // Run on game resources loaded.
    "loaded" : function () {
        me.state.set(me.state.MENU, new game.TitleScreen());
        me.state.set(me.state.PLAY, new game.PlayScreen());
        me.state.set(me.state.GAMEOVER, new game.GameOverScreen());

        // set a global fading transition for the screen
        me.state.transition("fade", "#FFFFFF", 250);
      
        // register our player entity in the object pool
        me.pool.register(yap.entity_types.PLAYER_ENTITY, game.PlayerEntity);
        me.pool.register(yap.entity_types.COIN_ENTITY, game.CoinEntity);
        me.pool.register(yap.entity_types.ENEMY_ENTITY, game.EnemyEntity);
      
        // enable the keyboard
        me.input.bindKey(me.input.KEY.LEFT,  yap.control.LEFT);
        me.input.bindKey(me.input.KEY.RIGHT, yap.control.RIGHT);
        me.input.bindKey(me.input.KEY.SPACE,  yap.control.JUMP, true);
        me.input.bindKey(me.input.KEY.Z, yap.control.LIGHT_ATTACK, true);
      
        // start the game
        me.state.change(me.state.MENU);
    }
};
