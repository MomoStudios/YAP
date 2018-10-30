/**
 * a HUD container and child items
 */

game.HUD = game.HUD || {};


game.HUD.Container = me.Container.extend({

    init: function() {
        // call the constructor
        this._super(me.Container, 'init');

        // persistent across level change
        this.isPersistent = true;

        // make sure we use screen coordinates
        this.floating = true;

        // give a name
        this.name = "HUD";

        // add our child score object at the top left corner
        this.addChild(new game.HUD.ScoreItem(-10, -10));
    }
});


/**
 * a basic HUD item to display score
 */
game.HUD.ScoreItem = me.Renderable.extend({
    /**
     * constructor
     */
    init: function(x, y) {

        // call the parent constructor
        // (size does not matter here)
        this._super(me.Renderable, 'init', [x, y, 10, 10]);

        // create the font object
        this.font = new me.BitmapFont(me.loader.getBinary('PressStart2P'), me.loader.getImage('PressStart2P'));

        // font alignment to right, bottom
        this.font.textAlign = "right";
        this.font.textBaseline = "bottom";

        // local copy of the global score
        this.score = 0;
        this.target_score = 0;

        // animate time, how long it should take to 
        this.animate_duration = 250;
        this.cur_animate_duration = 0;
        this.animating = false;
        this.average_change = 0;
        this.variance_range = 10;
    },

    /**
     * update function
     */
    update : function (dt) {
        if (this.target_score !== game.data.score){
            this.target_score = game.data.score;
            // if we're already animating, just reset the duration, should be fine
            // if you have issues, revisit this assumption later
            this.cur_animate_duration = 0;
            this.animating = true;
            this.average_change = (this.target_score - this.score) / this.animate_duration;
        }

        if (this.animating) {
            this.cur_animate_duration += dt;
            if (this.cur_animate_duration > this.animate_duration) {
                // when we're done animating, just set it to target score and stop animating
                this.score = this.target_score;
                this.animating = false;
            }
            else{
                // get us a random number within -variance_range and +variance_range
                // math.random is between 0 and 1. So subtract 0.5 to get [-0.5, 0.5]
                // multiply by 2 to get [-1, 1]
                // multiply by variance_range to get [-vr, vr]
                // then round to get the nearest int
                variance = Math.round((Math.random() - 0.5) * 2 * this.variance_range);
                change = Math.round(dt * this.average_change);
    
                this.score += (change + variance);
    
                // going up, don't let it get too big
                if (this.average_change > 0) {
                    if (this.score > this.target_score) {
                        this.score = this.target_score;
                    }
                // going down, don't let it get too small
                } else {
                    if (this.score < this.target_score) {
                        this.score = this.target_score;
                    }
                }
            }

            // if we're animating, we changed things
            return true;
        }

        return false;
    },

    /**
     * draw the score
     */
    draw : function (renderer) {
        // this.pos.x, this.pos.y are the relative position from the screen right bottom
		this.font.draw (renderer, this.score, me.game.viewport.width + this.pos.x, me.game.viewport.height + this.pos.y);
    }

});
