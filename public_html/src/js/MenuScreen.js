
MenuScreen = function ( ) {
    'use strict';
    Screen.apply (this, arguments);
};

MenuScreen.prototype = Object.create (Screen.prototype);
MenuScreen.prototype.constructor = MenuScreen;

MenuScreen.prototype.onUpdate = function (delta) {
    'use strict';
};

MenuScreen.prototype.onPause = function ( ) {
    'use strict';
};

MenuScreen.prototype.onLeave = function ( ) {
    'use strict';
    $ ('#mainMenuUI').fadeOut (500);
};

MenuScreen.prototype.onResume = function ( ) {
    'use strict';
    $ ('#gameUI').fadeIn (500);
    $ ('#mainMenuUI').fadeIn (500);
};

MenuScreen.prototype.tutorial = function ( ) {
    'use strict';
    $ ('#mainMenuUI').fadeOut (200);
    $ ('#tutorialUI').delay (200).fadeIn (300);
    $ ('#rightPanel').delay (2000).fadeIn (300);
    //$ ( '#rightPanel' ).delay ( 10000 ).fadeOut ( 300 );
    //$ ( '#tutorialUI' ).delay ( 12000 ).fadeOut ( 300 );
    //$ ( '#mainMenuUI' ).delay ( 12000 ).fadeIn ( 300 );
};

MenuScreen.prototype.endTutorial = function ( ) {
    'use strict';
    $ ('#rightPanel').fadeOut (300);
    $ ('#tutorialUI').fadeOut (300);
    $ ('#mainMenuUI').delay (300).fadeIn (300);
};

MenuScreen.prototype.buttonLogic = function (button) {
    'use strict';
    switch (button) {
        case 'Play':
            return 'game';

        case 'TUTORIAL':
            this.tutorial ( );
            break;

        case 'Tutorial Return':
            this.endTutorial ( );
            break;

        case 'HIGH SCORES':
            return 'score';

        case 'Main Menu':
            return 'menu';

        default:
            //alert( 'Not Yet Implemented!' );
    }
};
