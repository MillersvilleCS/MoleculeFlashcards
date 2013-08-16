( function () {
    'use strict';
    
    var Game = function (screen) {
        this.screenMap = new Map ( );
        this.currentScreen = screen;
        screen.onResume ( );
        this.currentScreen.getElement().on('screenChange', screenChangeHandler(this));
        this.initialized = false;
        return null;
    };

    Game.prototype = {
        constructor: Game,
        update: function (delta)
        {
            throw new UnimplementedFunctionException ("update");
        },
        getCurrentScene: function ( )
        {
            return this.currentScreen.scene;
        },
        addScreen: function (screenID, screen)
        {
            this.screenMap.put (screenID, screen);
        },
        changeScreens: function (screenID)
        {
            if (!this.screenMap.contains (screenID)) {
                throw new UndefinedReferenceException (screenID);
            }
            
            this.currentScreen.getElement ( ).off ('screenChange', screenChangeHandler(this));
            this.currentScreen.onLeave ( );
            this.currentScreen = this.screenMap.get (screenID);
            this.currentScreen.getElement().on('screenChange', screenChangeHandler(this));
            this.currentScreen.onResume ( );
        }
    };
    
    function screenChangeHandler (game) {
        return function (e) {
            game.changeScreens(e.screenID);
        };
    }

    // export MenuScreen
    window.Game = Game;
}) ( );

