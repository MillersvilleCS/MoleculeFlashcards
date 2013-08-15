
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
            FCCommunicationManager.login ( $('#emailLogin').val(), $('#passLogin').val(), this.loginFinish.bind(this) );
            this.loginStart();
            break;
        case 'Login Proceed':
            return 'menu';
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

LoginScreen.prototype.loginStart = function ( ) {
    $('#loginBox').slideUp( 300 );
};

LoginScreen.prototype.loginFinish = function ( response ) {
    console.log('loginFinish');
    $('#loginBox').delay( 500 ).css( 'display', 'block' );
    game.buttonLogic('Login Proceed');
};

LoginScreen.prototype.createDivShow = function ( ) {
    $('#loginBox').slideUp( 300 );
    $('#registerBox').delay( 300 ).slideDown( 300 );
};

LoginScreen.prototype.loginDivShow = function ( ) {
    $('#registerBox').slideUp( 300 );
    $('#loginBox').delay( 300 ).slideDown( 300 );
};