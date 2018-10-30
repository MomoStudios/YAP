/**
 * Player Entity
 */
game.PlayerEntity = me.Entity.extend({

    /**
     * constructor
     */
    init: function (x, y, settings) {
        // call the constructor
        this._super(me.Entity, 'init', [x, y , settings]);

        // set the renderable position to top center
        // TODO: figure out why this is negative? I feel like it should be positive. Is this an offset?
        this.anchorPoint.set(-0.5, 0);
        
        // max walking & jumping speed
        this.body.setMaxVelocity(4, 16);
        this.body.setFriction(1, 0);

        // set the display to follow our position on both axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH, 0.4);

        // ensure the player is updated even when outside of the viewport
        this.alwaysUpdate = true;

        // define a basic walking animation (using all frames)
        this.renderable.addAnimation("walk",  [0, 1, 2, 3, 4, 5, 6, 7]);

        // define a standing animation (using the first frame)
        this.renderable.addAnimation("stand",  [0]);

        // set the standing animation as default
        this.renderable.setCurrentAnimation("stand");

        // define myself as a player object, bro
        this.body.collisionType = me.collision.types.PLAYER_OBJECT;

        // for when we really just don't want to take damage
        this.invincible = false;
        this.i_timeout = 500;
        this.cur_i_time = 0;
    },

    /**
     * Does this really make sense on the player? probably not, but it's easy to do this for now
     */
    game_over: function(won){
        game.data.won = won;
        me.state.change(me.state.GAMEOVER);
        me.game.viewport.unfollow();
    },

    /**
     * update the entity
     */
    update : function (dt) {

        if (me.input.isKeyPressed('left')) {

            // flip the sprite on horizontal axis
            this.renderable.flipX(true);
            // update the default force
            this.body.force.x = -this.body.maxVel.x;
            // change to the walking animation
            if (!this.renderable.isCurrentAnimation("walk")) {
                this.renderable.setCurrentAnimation("walk");
            }
        } else if (me.input.isKeyPressed('right')) {
  
            // unflip the sprite
            this.renderable.flipX(false);
            // update the entity velocity
            this.body.force.x = this.body.maxVel.x;
            // change to the walking animation
            if (!this.renderable.isCurrentAnimation("walk")) {
                this.renderable.setCurrentAnimation("walk");
            }
        } else {
            this.body.force.x = 0;
            // change to the standing animation
            this.renderable.setCurrentAnimation("stand");
        }
  
        if (me.input.isKeyPressed('jump')) {
            if (!this.body.jumping && !this.body.falling)
            {
                me.audio.play("jump");
                // set current vel to the maximum defined value
                // gravity will then do the rest
                this.body.force.y = -this.body.maxVel.y
                this.body.jumping = true
            }
        } else {
            this.body.force.y = 0;
        }

        if (this.invincible) {
            this.cur_i_time += dt;
            if (this.cur_i_time > this.i_timeout){
                this.invincible = false;
                this.cur_i_time = 0;
            }
        }
        
        // apply physics to the body (this moves the entity)
        this.body.update(dt);

        // handle collisions against other shapes
        me.collision.check(this);

        // return true if we moved or if the renderable was updated
        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    },

   /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision : function (response, other) {
        switch (other.body.collisionType) {
            case me.collision.types.WORLD_SHAPE:
                // Simulate a platform object
                if (other.type === "solid"){
                    return true;
                } else if (other.type === "spike") {
                    // just avoid spamming the clip every frame mid-transition
                    if (!this.invincible) {
                        me.audio.play("scream");
                        this.game_over(false);
                        this.invincible = true;
                    }
                } else if (other.type === "level_end") {
                    me.audio.play("cling");
                    this.game_over(true);
                } else if (other.type === "platform") {
                    if (
                        this.body.falling &&
                        !me.input.isKeyPressed('down') &&
                        // Shortest overlap would move the player upward
                        (response.overlapV.y > 0) &&
                        // The velocity is reasonably fast enough to have penetrated to the overlap depth
                        (~~this.body.vel.y >= ~~response.overlapV.y)
                    ) {
                        // Disable collision on the x axis
                        response.overlapV.x = 0;
            
                        // Repond to the platform (it is solid)
                        return true;
                    }
      
                    // Do not respond to the platform (pass through)
                    return false;
                }
                break;
      
            case me.collision.types.ENEMY_OBJECT:
                if ((response.overlapV.y > 0) && !this.body.jumping) {
                    me.audio.play("stomp");
                    // bounce (force jump)
                    this.body.falling = false;
                    this.body.vel.y = -this.body.maxVel.y * 1.25;
            
                    // set the jumping flag
                    this.body.jumping = true;
                    other.alive = false;
                }
                else {
                    if (!this.invincible){
                        me.audio.play("scream", false, null, 0.5);
                        game.data.score -= 500;
                        this.renderable.flicker(this.i_timeout);
                        this.invincible = true;
                    }
                }
                return true;
        
            default:
                // Do not respond to other objects (e.g. coins)
                return false;
        }
    }
});

game.CoinEntity = me.CollectableEntity.extend({
    init: function (x, y, settings) {
        settings.framewidth = 32
        settings.frameheight = 32
        settings.image = "spinning_coin_gold"
        // call the parent constructor
        this._super(me.CollectableEntity, 'init', [x, y , settings]);
    },

    // this function is called by the engine, when
    // an object is touched by something (here collected)
    onCollision : function (response, other) {
        if (other.body.collisionType === me.collision.types.PLAYER_OBJECT) {
            game.data.score += 250
            me.audio.play("cling");

            // make sure it cannot be collected "again"
            this.body.setCollisionMask(me.collision.types.NO_OBJECT);

            // remove it
            me.game.world.removeChild(this);
        }

        return false
    }
});

game.EnemyEntity = me.Entity.extend({
    init: function (x, y, settings) {
        // save the area size as defined in Tiled
        var width = settings.width;

        // define this here instead of tiled
        settings.image = "wheelie_right";

        // adjust the size setting information to match the sprite size
        // so that the entity object is created with the right size
        settings.framewidth = settings.width = 64;
        settings.frameheight = settings.height = 64;

        // redefine the default shape (used to define path) with a shape matching the renderable
        settings.shapes[0] = new me.Rect(0, 0, settings.framewidth, settings.frameheight);

        // call the parent constructor
        this._super(me.Entity, 'init', [x, y , settings]);

        // walking & jumping speed
        this.body.setVelocity(4, 6);
        this.body.setFriction(1);

        // set start/end position based on the initial area size
        x = this.pos.x;
        this.startX = x;
        this.pos.x = this.endX = x + width - this.width;
        
        this.body.collisionType = me.collision.types.ENEMY_OBJECT;

        // to remember which side we were walking
        this.walkLeft = false;

        // enemy state
        this.alive = true;
        this.dying = false;
        this.dying_timeout = 450;
    },

    // manage the enemy movement
    update : function (dt) {
        if (this.alive) {
            if (this.walkLeft && this.pos.x <= this.startX) {
                this.walkLeft = false;
                this.body.force.x = this.body.maxVel.x;
            } else if (!this.walkLeft && this.pos.x >= this.endX) {
                this.walkLeft = true;
                this.body.force.x = -this.body.maxVel.x;
            }
            this.body.force.x = (this.walkLeft) ? -this.body.maxVel.x : this.body.maxVel.x;
        } else if (!this.dying) {
            // let it fade, but stop colliding when it's animating the death
            this.body.setCollisionMask(me.collision.types.WORLD_SHAPE);
            this.body.force.x = 0;
            this.renderable.flicker(this.dying_timeout);
            this.dying = true;
        } else if (this.dying_timeout > 0) {
            this.dying_timeout -= dt;
        } else {
            // remove it
            me.game.world.removeChild(this);
        }

        // set facing direction out here so that it's still facing the right way when dying
        this.renderable.flipX(this.walkLeft);
        // check & update movement
        this.body.update(dt);

        // handle collisions against other shapes
        me.collision.check(this);

        // return true if we moved or if the renderable was updated
        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    },

    /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision : function (response, other) {
        if (response.b.body.collisionType === me.collision.types.WORLD_SHAPE) {
            // world objects are solid
            return true;
        }
        return false;
    }
});