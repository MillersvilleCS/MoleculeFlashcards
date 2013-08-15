
LoginScreen = function ( ) {
    'use strict';
    Screen.apply (this, arguments);
};

LoginScreen.prototype = Object.create (Screen.prototype);
LoginScreen.prototype.constructor = LoginScreen;

LoginScreen.prototype.onUpdate = function (delta) {
    'use strict';
};

LoginScreen.prototype.onPause = function ( ) {
    'use strict';
};

LoginScreen.prototype.onLeave = function ( ) {
    'use strict';
    
};

LoginScreen.prototype.onResume = function ( ) {
    'use strict';
    
};

LoginScreen.prototype.buttonLogic = function (button) {
    'use strict';
    switch (button) {
        case 'Login':
            FCCommunicationManager.login (email, password, this.login )
            break;

        default:
            //alert( 'Not Yet Implemented!' );
    }
};

LoginScreen.prototype.login = function ( ) {
    
};