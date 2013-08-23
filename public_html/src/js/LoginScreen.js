
( function (window, $) {
    'use strict';

    var LoginScreen = function ($element) {
        Screen.apply (this, [$element]);
    };

    LoginScreen.prototype = Object.create (Screen.prototype);
    LoginScreen.prototype.constructor = LoginScreen;

    LoginScreen.prototype.onUpdate = function (delta) {

    };

    LoginScreen.prototype.onPause = function ( ) {

    };

    LoginScreen.prototype.onLeave = function ( ) {
        $('#logoutButton').html( 'Hi, ' + UserData.username + '!' );
        $('#loginUI').removeClass('in active');
        disableButtons( );
    };

    LoginScreen.prototype.onResume = function ( ) {
        enableButtons (this);
        var username = CookieManager.getCookie ('username');
        var auth = CookieManager.getCookie ('authenticator');
        if (username !== null && auth !== null) {
            UserData.username = username;
            UserData.auth = auth;

            this.nextScreen();
        } else {
            /* stay on this screen */
            $('#loginUI').addClass('in active');
        }
    };

    LoginScreen.prototype.nextScreen = function ( ) {
        this.$element.trigger(new ScreenChangeEvent('menu'));
    };

    LoginScreen.prototype.loginStart = function ( ) {
        /* TODO - Loading Animation? */
    };

    LoginScreen.prototype.loginFinish = function ( response ) {
        if( response.success === 'false' ) {
            $('#loginMessage').html('Invalid username/password!');
            $('#loginButton, #loginMessage').removeClass('hide');
        } else {
            $('#loginMessage').addClass('hide');
            CookieManager.setCookie ('username', response.username, 1, '/');
            CookieManager.setCookie ('authenticator', response.auth, 1, '/');
            UserData.username = response.username;
            UserData.auth = response.auth;
            /* Swap Screens */
            this.nextScreen ( );
        }
    };

    LoginScreen.prototype.createDivShow = function ( ) {
//      $('#loginBox').slideUp (300);
//      $('#registerBox').delay (300).slideDown (300);
        $('#loginBox').addClass('up');
        setTimeout(function () {
            $('#registerBox').removeClass('up');
        }, 300);
    };

    LoginScreen.prototype.loginDivShow = function ( ) {

//      $ ('#registerBox').slideUp (300);
//      $ ('#loginBox').delay (300).slideDown (300);
        $('#registerBox').addClass('up');
        setTimeout(function () {
            $('#loginBox').removeClass('up');
        }, 300);

    };

    /* Buttons */

    function enableButtons(loginScreen) {
        $('#loginUI .button[data-logic=\'login\']').on('click', function () {
            $('#loginButton').addClass('hide');
            FCCommunicationManager.login ( $('#emailLogin').val(), $('#passLogin').val(),
                                            loginScreen.loginFinish.bind(loginScreen) );
            loginScreen.loginStart();
        });

        $('#loginUI [data-logic=\'showCreate\']').on('click', loginScreen.createDivShow);

        $('#loginUI [data-logic=\'showLogin\']').on('click', loginScreen.loginDivShow);

        $('#loginUI .button[data-logic=\'register\']').on('click', function () {
            /** TODO: Needs Implementation */
        });

        $('#pageHeader [data-logic=\'logout\']').on('click', function () {
            if ( confirm('Logout from Molecule Flashcards?') ) {
                CookieManager.deleteCookie ('username', '/');
                CookieManager.deleteCookie ('authenticator', '/');
                window.location.replace('');
            }
        });
    };

    function disableButtons ( ) {
        $('#loginUI .button').off ('click');
    }

    window.LoginScreen = LoginScreen;
}) (window, jQuery);
