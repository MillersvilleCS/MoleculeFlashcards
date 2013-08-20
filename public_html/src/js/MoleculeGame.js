MoleculeGame = function () {
    'use strict';
    
    var gameScreen = new GameScreen ($( '#gameUI, #loadingUI' ));
    var menuScreen = new MenuScreen ($('#mainMenuUI'));
    var scoreScreen = new HighScoreScreen ($('#highScoreUI'));
    var loginScreen = new LoginScreen ($('#loginUI'));

    Game.apply (this, [loginScreen]);
    
    this.currentScreen.$element.on ('screenChange', screenChangeHandler.bind (this));
    this.addScreen ('game', gameScreen);
    this.addScreen ('menu', menuScreen);
    this.addScreen ('score', scoreScreen);
    this.addScreen ('login', loginScreen);

    loginScreen.onResume ();
};

MoleculeGame.prototype = Object.create (Game.prototype);
MoleculeGame.prototype.constructor = MoleculeGame;

MoleculeGame.prototype.update = function (delta) {
    'use strict';
    this.currentScreen.onUpdate (delta);
};

MoleculeGame.prototype.changeScreens = function (screenID) {
    'use strict';
    this.currentScreen.$element.off ('screenChange');
    Game.prototype.changeScreens.call (this, screenID);
    this.currentScreen.$element.on ('screenChange', screenChangeHandler.bind (this));
};

MoleculeGame.prototype.buttonLogic = function (button) {
    'use strict';
    var screenID = this.currentScreen.buttonLogic (button);
    this.changeScreens (screenID);
};

function screenChangeHandler (e) {
    'use strict';
    this.changeScreens (e.screenID);
}