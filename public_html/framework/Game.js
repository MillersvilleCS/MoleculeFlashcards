
Game = function (screen) {
    this.screenMap = new Map ( );
    this.currentScreen = screen;
    this.initialized = false;
    return null;
};

Game.prototype = {
    constructor: Game,
    update: function (delta)
    {
        'use strict';
        throw new UnimplementedFunctionException ("update");
    },
    getCurrentScene: function ( )
    {
        'use strict';
        return this.currentScreen.scene;
    },
    hasScreen: function (screenID)
    {
        'use strict';
        return this.screenMap.contains (screenID);
    },
    addScreen: function (screenID, screen)
    {
        'use strict';
        this.screenMap.put (screenID, screen);
    },
    changeScreens: function (screenID)
    {
        'use strict';
        this.currentScreen.onLeave ( );
        this.currentScreen = this.screenMap.get (screenID);
        this.currentScreen.onResume ( );
    }
};



