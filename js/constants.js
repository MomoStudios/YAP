yap = {
    control: {
        // controls that can be resued between menus and game mode
        LEFT: "LEFT",
        RIGHT: "RIGHT",
        UP: "UP",
        DOWN: "DOWN",
        JUMP: "JUMP",
        SELECT: "SELECT",
        CANCEL: "CANCEL",
        // controls only applicable to gameplay
        LIGHT_ATTACK: "LIGHT_ATTACK",

    },

    player_attacks: {
        LIGHT_ATTACK: {
            start_duration: 200,
            active_duration: 800,
            recovery_duration: 1500,
            hitbox: {
                x: 0,
                y: 0,
                w: 64,
                h: 10
            },
            animation: "stand"
        }
    },

    levels: {
        LEVEL_ONE: "level_one",
        LEVEL_TWO: "level_two"
    },

    entity_types: {
        PLAYER_ENTITY: "player",
        COIN_ENTITY: "coin",
        ENEMY_ENTITY: "enemy"
    },

    object_types: {
        HAZARD: "hazard",
        WORLD: "world",
        PLATFORM: "platform",
        LEVEL_END: "level_end"
    },

    audio: {
        BACKGROUND_TRACK: "dst-inertexponent",
        KILL_STOMP: "stomp",
        DAMAGE: "scream",
        CLING: "cling",
        JUMP: "jump",
        GAME_START: "cling",
        RESTART: "cling"
    },

    sprites: {
        PLAYER: "gripe_run_right",
        COIN: "spinning_coin_gold",
        ENEMY: "wheelie_right",
    },

    animations: {
        PLAYER_WALK: "walk",
        PLAYER_STAND: "stand",
    },

    backgrounds: {
        TITLE_SCREEN: "title_screen",
        GAME_OVER_SCREEN: "game_over"
    },

    fonts: {
        DEFAULT_FONT: "PressStart2P"
    }

}