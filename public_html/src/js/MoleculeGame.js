
MoleculeGame = function ( ) {
    'use strict';
    /*@const*/
    var gameScreen = new GameScreen ( );
    /*@const*/
    var menuScreen = new MenuScreen ( );
    /*@const*/
    var scoreScreen = new HighScoreScreen ( );

    this.addScreen ('game', gameScreen);
    this.addScreen ('menu', menuScreen);
    this.addScreen ('score', scoreScreen);

    this.init ('menu');
};

MoleculeGame.prototype = new Game ( );

MoleculeGame.prototype.update = function (delta) {
    'use strict';
    this.getCurrentScreen ( ).onUpdate (delta);
};

MoleculeGame.prototype.buttonLogic = function (button) {
    'use strict';
    var screenID = this.getCurrentScreen ( ).buttonLogic (button);
    if (this.hasScreen (screenID)) {
        this.swapScreens (screenID);
    }
};
