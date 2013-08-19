
MoleculeGame = function ( ) {
    'use strict';
    var data = { };

    var gameScreen = new GameScreen ( data );
    var menuScreen = new MenuScreen ( data );
    var scoreScreen = new HighScoreScreen ( data );
    var loginScreen = new LoginScreen ( data );
    
    Game.apply (this, [loginScreen]);

    this.addScreen ('game', gameScreen);
    this.addScreen ('menu', menuScreen);
    this.addScreen ('score', scoreScreen);
    this.addScreen ('login', loginScreen);

    loginScreen.onResume();
};

MoleculeGame.prototype = Object.create (Game.prototype);
MoleculeGame.prototype.constructor = MoleculeGame;

MoleculeGame.prototype.update = function (delta) {
    'use strict';
    this.currentScreen.onUpdate (delta);
};

MoleculeGame.prototype.buttonLogic = function (button) {
    'use strict';
    var screenID = this.currentScreen.buttonLogic (button);
    this.changeScreens (screenID);
};
