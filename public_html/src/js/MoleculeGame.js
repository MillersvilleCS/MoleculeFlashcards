
MoleculeGame = function ( ) {
    'use strict';
    
    var gameScreen = new GameScreen ( );
    var menuScreen = new MenuScreen ( );
    var scoreScreen = new HighScoreScreen ( );
    var loginScreen = new LoginScreen ( );
    
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
    if (this.hasScreen (screenID)) {
        this.changeScreens (screenID);
    }
};
