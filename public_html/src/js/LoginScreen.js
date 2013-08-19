
( function () {
    'use strict';

    var LoginScreen = function ($element) {
        'use strict';
        Screen.apply (this, [$element]);
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
        $ ('#loginUI').removeClass('in active');
        disableButtons( );
    };

    LoginScreen.prototype.onResume = function ( ) {
        'use strict';
        enableButtons (this);
        var username = CookieManager.getCookie ('username');
        var auth = CookieManager.getCookie ('authenticator');
        if (username !== null && auth !== null) {
            UserData.username = username;
            UserData.auth = auth;
            
            var screenChangeEvent = jQuery.Event ('screenChange');
            screenChangeEvent.screenID = 'menu';
            this.$element.trigger (screenChangeEvent);
        } else {
            /* stay on this screen */
            $('#loginUI').addClass('in active');
        }
    };

    LoginScreen.prototype.nextScreen = function ( ) {
        var screenChangeEvent = jQuery.Event('screenChange');
        screenChangeEvent.screenID = 'menu';
        this.$element.trigger(screenChangeEvent);
    }

    LoginScreen.prototype.loginStart = function ( ) {
        //$('#loginBox').slideUp( 300 );
    };

    LoginScreen.prototype.loginFinish = function ( response ) {
        if( response.success === 'false' ) {
            //$('#loginBox').slideDown( 300 );
            $ ('#loginMessage').html("Invalid username/password!");
            $ ('#loginButton, #loginMessage').addClass('active');
        } else {
            $('#loginMessage').removeClass('active');
            CookieManager.setCookie ('username', response.username, 1, '/');
            CookieManager.setCookie ('authenticator', response.auth, 1, '/');
            UserData.username = response.username;
            UserData.auth = response.auth;
            /* Swap Screens */
            this.nextScreen ( );
        }
    };

    LoginScreen.prototype.createDivShow = function ( ) {
        'use strict';
//        $('#loginBox').slideUp (300);
//        $ ('#registerBox').delay (300).slideDown (300);
        $('#loginBox').addClass('up');
        setTimeout(function () {
            $('#registerBox').removeClass('up');
        }, 300);
    };

    LoginScreen.prototype.loginDivShow = function ( ) {
        'use strict';
//        $ ('#registerBox').slideUp (300);
//        $ ('#loginBox').delay (300).slideDown (300);
        $('#registerBox').addClass('up');
        setTimeout(function () {
            $('#loginBox').removeClass('up');
        }, 300);
        
    };

    /* Buttons */

    function enableButtons (loginScreen) {
        $ ('#loginUI .button[data-logic="login"]').on ('click', function () {
            $ ('#loginButton').css ('display', 'none');
            FCCommunicationManager.login ($ ('#emailLogin')
                    .val (), $ ('#passLogin').val (),
                    loginScreen.loginFinish.bind (loginScreen));
            loginScreen.loginStart ();
        });
        $('#loginUI .button[data-logic="login"]').on('click', function () {
            $('#loginButton').css('display', 'none');
            FCCommunicationManager.login ( $('#emailLogin').val(), $('#passLogin').val(), 
                                            loginScreen.loginFinish.bind(loginScreen) );
            loginScreen.loginStart();
        }); 
        
        $('#loginUI [data-logic="showCreate"]').on('click', loginScreen.createDivShow); 
        
        $('#loginUI [data-logic="showLogin"]').on('click', loginScreen.loginDivShow); 
        
        $('#loginUI .button[data-logic="register"]').on('click', function () {
            /** TODO: Needs Implementation */
        }); 
    }

    function disableButtons ( ) {
        $ ('#loginUI .button').off ('click');
    }

    window.LoginScreen = LoginScreen;
}) ( );
