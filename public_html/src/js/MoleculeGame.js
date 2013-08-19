
MoleculeGame = function () {
    'use strict';
    var data = {
        
    };
    var gameScreen = new GameScreen (data);
    var menuScreen = new MenuScreen (data);
    var scoreScreen = new HighScoreScreen (data);
    var loginScreen = new LoginScreen (data);
    
    menuScreen.$element = $('#mainMenuUI');
    scoreScreen.$element = $('#highScoreUI');
    loginScreen.$element = $('#loginUI');

    Game.apply (this, [loginScreen]);
    this.currentScreen.$element
                .on ('screenChange', screenChangeHandler.bind (this));
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

function screenChangeHandler (e) {
    this.changeScreens (e.screenID);
}