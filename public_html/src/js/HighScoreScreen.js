
HighScoreScreen = function ( ) {
    'use strict';
};

HighScoreScreen.prototype = new Screen ( );

HighScoreScreen.prototype.onUpdate = function (delta) {
    'use strict';
};

HighScoreScreen.prototype.onPause = function ( ) {
    'use strict';
};

HighScoreScreen.prototype.onLeave = function ( ) {
    'use strict';
    $ ('#highScoreUI').fadeOut (500);
};

HighScoreScreen.prototype.onResume = function ( ) {
    'use strict';
    $ ('#highScoreUI').fadeIn (500);
};

HighScoreScreen.prototype.buttonLogic = function (button) {
    'use strict';
    switch (button) {
        case 'Main Menu':
            return 'menu';

        default:
            //alert( 'Not Yet Implemented!' );
    }
};
