( function () {
    'use strict'

    var LoginScreen = function ( ) {
        Screen.apply (this, arguments);
    };

    var $element;

    LoginScreen.prototype = Object.create (Screen.prototype);
    LoginScreen.prototype.constructor = LoginScreen;

    LoginScreen.prototype.onUpdate = function (delta) {
        
    };

    LoginScreen.prototype.onPause = function ( ) {
        
    };

    LoginScreen.prototype.onLeave = function ( ) {
        $ ('#loginUI').fadeOut (500);
        disableButtons( );
    };

    LoginScreen.prototype.onResume = function ( ) {
        enableButtons(this);
        var username = this.getCookie('username');
        var auth = this.getCookie('authenticator');
        if( username != null && auth != null ) {
            alert('Already logged in');
            /* Swap screens here */
            this.nextScreen( );
        } else {
            /* stay on this screen */
            $ ('#loginUI').fadeIn (500);
        }
    };

    LoginScreen.prototype.getElement = function ( ) {
        if ( !$element ) {
            $element = $ ( '#loginUI' );
        }
        return $element;
    };

    LoginScreen.prototype.nextScreen = function ( ) {
        var screenChangeEvent = jQuery.Event('screenChange');
        screenChangeEvent.screenID = 'menu';
        this.getElement().trigger(screenChangeEvent);
    }

    /*
    LoginScreen.prototype.buttonLogic = function (button) {
        
        switch (button) {
            case 'Login':
                
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
    */

    LoginScreen.prototype.loginStart = function ( ) {
        //$('#loginBox').slideUp( 300 );
    };

    LoginScreen.prototype.loginFinish = function ( response ) {
        if( response.success == 'false' ) {
            //$('#loginBox').slideDown( 300 );
            $('#loginButton').css('display', 'block');
            $('#loginMessage').html('Invalid username/password!');
            $('#loginMessage').css('display', 'block');
        } else {
            //$('#loginBox').delay( 500 ).css( 'display', 'block' );
            $('#loginMessage').delay( 500 ).css('display', 'none');
            this.setCookie('username', response.username, 1, '/');
            this.setCookie('authenticator', response.auth, 1, '/');
            /* Swap Screens */
            this.nextScreen( );
        }
    };

    LoginScreen.prototype.createDivShow = function ( ) {
        $('#loginBox').slideUp( 300 );
        $('#registerBox').delay( 300 ).slideDown( 300 );
    };

    LoginScreen.prototype.loginDivShow = function ( ) {
        $('#registerBox').slideUp( 300 );
        $('#loginBox').delay( 300 ).slideDown( 300 );
    };

    LoginScreen.prototype.getCookie = function ( cookieName ) {
        var cookieValue = document.cookie;
        var cookieStart = cookieValue.indexOf(' ' + cookieName + '=');
        if (cookieStart == -1){
            cookieStart = cookieValue.indexOf(cookieName + '=');
        }
        
        if (cookieStart == -1){
            cookieValue = null;
        }
        else{
            cookieStart = cookieValue.indexOf('=', cookieStart) + 1;
            var cookieEnd = cookieValue.indexOf(';', cookieStart);
            if (cookieEnd == -1){
                cookieEnd = cookieValue.length;
            }
            cookieValue = unescape(cookieValue.substring(cookieStart, cookieEnd));
        }
        
        return cookieValue;
    };

    LoginScreen.prototype.setCookie = function (cookieName, cookieValue, cookieExpireDays, path) {
        var expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + cookieExpireDays);
        var cookieValue = escape(cookieValue) + ((path) ? ';path=' + path:'') + 
                          ((cookieExpireDays == null) ? '' : '; expires=' + expireDate.toUTCString());
        document.cookie = cookieName + '=' + cookieValue;
    };

    LoginScreen.prototype.deleteCookie = function ( cookieName, path, domain ) {
        if ( getCookie( name ) ) {
            document.cookie = name + '=' + ((path) ? ';path=' + path:'') + ((domain) ? ';domain=' + domain:'') +
                            ';expires=Thu, 01 Jan 1970 00:00:01 GMT';
        }
    };

    /* Buttons */

    function enableButtons (loginScreen) {
        $('#loginUI .button[data-logic="login"]').on('click', function () {
            $('#loginButton').css('display', 'none');
            FCCommunicationManager.login ( $('#emailLogin').val(), $('#passLogin').val(), 
                                            loginScreen.loginFinish.bind(loginScreen) );
            loginScreen.loginStart();
        }); 
    }

    function disableButtons ( ) {
        $('#loginUI .button').off('click');
    }

    window.LoginScreen = LoginScreen;
}) ( );