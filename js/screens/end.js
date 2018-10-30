game.GameOverScreen = me.ScreenObject.extend({
    /**
     *  action to perform on state change
     */
    onResetEvent: function() {
        me.game.viewport.moveTo(0, 0);
        var backgroundImage = new me.Sprite(0, 0,
            {
                image: me.loader.getImage('game_over'),
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
                this.anchorPoint.set(0, 0);
    
                // font for the scrolling text
                this.font = new me.BitmapFont(me.loader.getBinary('PressStart2P'), me.loader.getImage('PressStart2P'), 1, "center", "top");

                this.score_text = "Final Score: " + String(game.data.score);
                if (game.data.won){
                    this.text = "Congratulations!";
                    if (game.data.score > 1000){
                        this.flavor_text = "That's a lot of points!";
                    } else if (game.data.score > 0) {
                        this.flavor_text = "I mean, you tried. Maybe.";
                    } else {
                        this.flavor_text = "Really liked that yell, huh?";
                    }
                }
                else {
                    this.text = "You died";
                    this.flavor_text = "C'mon, this aint that hard";
                }
            },
        
            update : function (dt) {
                return true;
            },

            draw_centered_text: function (renderer, font, text, screen_width, y_pos){
                //text_dim = font.measureText(renderer, text);
                //center = screen_width / 2;
                //x_pos = center - (text_dim.width / 2);

                font.draw(renderer, text, screen_width / 2, y_pos);
            },
        
            draw : function (renderer) {
                this.draw_centered_text(renderer, this.font, this.text, me.game.viewport.width, 100);
                this.draw_centered_text(renderer, this.font, this.score_text, me.game.viewport.width, 200);
                this.draw_centered_text(renderer, this.font, this.flavor_text, me.game.viewport.width, 350);
            }
        })), 2);
    
        me.input.bindKey(me.input.KEY.ENTER, "enter", true);
        this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {
            if (action === "enter") {
                me.audio.play("cling");
                me.state.change(me.state.MENU);
            }
        });
      },
    
    /**
     * action to perform when leaving this screen (state change)
     */
    onDestroyEvent : function () {
        me.input.unbindKey(me.input.KEY.ENTER);
        me.event.unsubscribe(this.handler);
    }
});
