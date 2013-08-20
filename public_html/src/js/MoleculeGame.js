
MoleculeGame = function () {
    'use strict';
    
    var gameScreen = new GameScreen ($( '#gameUI, #loadingUI' ));
    var tutorialScreen = new TutorialScreen ($( '#TutorialScreenUI' ));
    var menuScreen = new MenuScreen ($('#mainMenuUI'));
    var scoreScreen = new HighScoreScreen ($('#highScoreUI'));
    var loginScreen = new LoginScreen ($('#loginUI'));

    Game.apply (this, [loginScreen]);
    
    $ ('#container').on ('screenChange', screenChangeHandler.bind (this));
    this.addScreen ('game', gameScreen);
    this.addScreen ('tutorial', tutorialScreen);
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
    
    $ ('#container').off ('screenChange');
    Game.prototype.changeScreens.call (this, screenID);
    $ ('#container').on ('screenChange', screenChangeHandler.bind (this));
};

MoleculeGame.prototype.buttonLogic = function (button) {
    'use strict';
    
    var screenID = this.currentScreen.buttonLogic (button);
    if(screenID) {
        this.changeScreens (screenID);
    }
};

function screenChangeHandler (e) {
    'use strict';
    
    this.changeScreens (e.screenID);
};