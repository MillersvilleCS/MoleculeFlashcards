
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
            FCCommunicationManager.login (email, password, this.login.bind(this) );
            break;
        case 'CreateDiv':
            this.createDivShow();
            break;
        case 'LoginDiv':
            this.loginDivShow();
            break;

        default:
            //alert( 'Not Yet Implemented!' );
    }
};

LoginScreen.prototype.login = function ( ) {
    
};

LoginScreen.prototype.createDivShow = function ( ) {
    $('#loginBox').slideUp( 300 );
    $('#registerBox').delay( 300 ).slideDown( 300 );
};

LoginScreen.prototype.loginDivShow = function ( ) {
    $('#registerBox').slideUp( 300 );
    $('#loginBox').delay( 300 ).slideDown( 300 );
};