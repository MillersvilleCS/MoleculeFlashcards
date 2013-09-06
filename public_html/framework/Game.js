/*
 * Don't ever modify me
 *
 * - Modified.
 */
var Game = function(screen) {
    'use strict';
    this.screenMap = new Map();
    this.currentScreen = screen;
};

Game.prototype = {
    constructor: Game,
    update: function(delta)
    {
        'use strict';
        throw new UnimplementedFunctionException('update');
    },
    getCurrentScene: function()
    {
        'use strict';
        return this.currentScreen.scene;
    },
    addScreen: function(screenID, screen)
    {
        'use strict';
        this.screenMap.put(screenID, screen);
    },
    changeScreens: function(screenID)
    {
        'use strict';
        if(!this.screenMap.contains(screenID)) {
            throw new UndefinedReferenceException(screenID);
        }

        this.currentScreen.onLeave();
        this.currentScreen = this.screenMap.get(screenID);
        this.currentScreen.onResume();
    }
};