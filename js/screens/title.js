game.TitleScreen = me.ScreenObject.extend({
    /**
     *  action to perform on state change
     */
    onResetEvent: function() {
        me.game.viewport.moveTo(0, 0);
        var backgroundImage = new me.Sprite(0, 0,
            {
                image: me.loader.getImage(yap.backgrounds.TITLE_SCREEN),
            }
        );
        
        // position and scale to fit with the viewport size
        backgroundImage.anchorPoint.set(0, 0);
        backgroundImage.scale(me.game.viewport.width / backgroundImage.width, me.game.viewport.height / backgroundImage.height);
    
        // add to the world container
        me.game.world.addChild(backgroundImage, 1);
    
        // add a new renderable component with the scrolling text
        me.game.world.addChild(new (me.Renderable.extend ({
            // constructor
            init : function () {
                this._super(me.Renderable, 'init', [0, 0, me.game.viewport.width, me.game.viewport.height]);
        
                // font for the scrolling text
                this.font = new me.BitmapFont(me.loader.getBinary(yap.fonts.DEFAULT_FONT),
                                              me.loader.getImage(yap.fonts.DEFAULT_FONT));
        
                // a tween to animate the arrow
                this.scrollertween = new me.Tween(this);
                this.scrollover();
        
                this.scroller = "A SMALL STEP BY STEP TUTORIAL FOR GAME CREATION WITH melonJS";
                this.scrollerpos = 2000;
            },
    
            // some callback for the tween objects
            scrollover : function () {
                // reset to default value
                this.scrollerpos = 1000;
                this.scrollertween.to({scrollerpos: -1500 }, 10000).onComplete(this.scrollover.bind(this)).start();
            },
    
            update : function (dt) {
                return true;
            },
    
            draw : function (renderer) {
                this.font.draw(renderer, "PRESS ENTER TO PLAY", 425, 640);
                this.font.draw(renderer, this.scroller, this.scrollerpos, 440);
            },
            onDestroyEvent : function () {
                //just in case
                this.scrollertween.stop();
            }
        })), 2);
    
        // change to play state on press Enter or click/tap
        me.input.bindKey(me.input.KEY.ENTER, yap.control.SELECT, true);
        this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {
            if (action === yap.control.SELECT) {
                // play something on tap / enter
                // this will unlock audio on mobile devices
                me.audio.play(yap.audio.GAME_START);
                me.state.change(me.state.PLAY);
            }
        });
      },
    
      /**
       * action to perform when leaving this screen (state change)
       */
    onDestroyEvent : function () {
        me.input.unbindKey(me.input.KEY.ENTER);
        me.input.unbindPointer(me.input.pointer.LEFT);
        me.event.unsubscribe(this.handler);
    }
});
