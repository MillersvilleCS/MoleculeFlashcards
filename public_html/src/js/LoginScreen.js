
(function(window, $) {
    'use strict';

    var LoginScreen = function($element) {
        Screen.apply(this, [$element]);
    };

    LoginScreen.prototype = Object.create(Screen.prototype);
    LoginScreen.prototype.constructor = LoginScreen;

    LoginScreen.prototype.onUpdate = function(delta) {

    };

    LoginScreen.prototype.onPause = function( ) {

    };

    LoginScreen.prototype.onLeave = function( ) {
        $('#logoutButton').text('Hi, ' + UserData.username + '!');
        $('#loginUI').removeClass('in active');
        disableButtons( );
    };

    LoginScreen.prototype.onResume = function( ) {
        enableButtons(this);
        var username = CookieManager.getCookie('username');
        var auth = CookieManager.getCookie('authenticator');
        if(username !== null && auth !== null) {
            UserData.username = username;
            UserData.auth = auth;

            this.nextScreen();
        } else {
            $('#loginUI').addClass('in active');
        }
    };

    LoginScreen.prototype.nextScreen = function( ) {
        this.$element.trigger(new ScreenChangeEvent('menu'));
    };

    LoginScreen.prototype.createDivShow = function( ) {
        $('#loginBox').addClass('up');
        setTimeout(function() {
            $('#registerBox').removeClass('up');
        }, 300);
    };

    LoginScreen.prototype.loginDivShow = function( ) {
        $('#registerBox').addClass('up');
        setTimeout(function() {
            $('#loginBox').removeClass('up');
        }, 300);
    };

    LoginScreen.prototype.loginComplete = function(response) {
        if(response.success === 'false') {
            $('#loginButton, #loginMessage').removeClass('hide');
            $('#passLogin').val('');
        } else {
            $('#loginMessage').addClass('hide');
            CookieManager.setCookie('username', response.username, 1, '/');
            CookieManager.setCookie('authenticator', response.auth, 1, '/');
            UserData.username = response.username;
            UserData.auth = response.auth;
            this.nextScreen( );
        }
    };

    LoginScreen.prototype.registerComplete = function(response) {
        if(response.success === 'false') {
            $('#registerFail').text(response.error);
            $('#registerFail, #registerButton').removeClass('hide');
        } else {
            $('#registerMessage').removeClass('hide');
            $('#registerForm').addClass('hide');
            this.loginDivShow();
            this.loginComplete(response);
        }
    };

    function enableButtons(loginScreen) {
        $('#loginUI')
            .find('.button[data-logic=\'login\']')
            .on('click', function() {
                $('#loginButton').addClass('hide');
                FCCommunicationManager.login(
                    $('#emailLogin').val(),
                    $('#passLogin').val(),
                    loginScreen.loginComplete.bind(loginScreen)
                );
            })
            .end()

            .find('[data-logic=\'showCreate\']')
            .on('click', loginScreen.createDivShow)
            .end()

            .find('[data-logic=\'showLogin\']')
            .on('click', loginScreen.loginDivShow)
            .end()

            .find('.button[data-logic=\'register\']')
            .on('click', function() {
                $('#registerMismatch, #registerFail').addClass('hide');

                if($('#passRegister').val() == $('#passRepRegister').val()) {
                    $('#registerButton').addClass('hide');
                    FCCommunicationManager.register(
                        $('#emailRegister').val(),
                        $('#passRegister').val(),
                        $('#usernameRegister').val(),
                        loginScreen.registerComplete.bind(loginScreen)
                    );
                } else {
                    $('#registerMismatch').removeClass('hide');
                }
            });

        /* TODO - Move these somewhere else? Both are buttons that can be pushed at any time. */
        $('#pageHeader').find('[data-logic=\'logout\']').on('click', function() {
            if(confirm('Logout from Molecule Flashcards?')) {
                CookieManager.deleteCookie('username', '/');
                CookieManager.deleteCookie('authenticator', '/');
                window.location.href = '';
            }
        });

        $('#errorMessage').find('[data-logic=\'retry\']').on('click', function() {
            CommunicationManager.retry();
            $('#errorMessage').removeClass('in activeTop');
        });

        $('#passLogin').keypress( function( e ) {
            if( e.keyCode == 13 ) {
                $('#loginButton').trigger('click');
            }
        });

        $('#passRepRegister').keypress( function( e ) {
            if( e.keyCode == 13 ) {
                $('#registerButton').trigger('click');
            }
        });

    }

    function disableButtons( ) {
        $('#loginUI').find('.button').off('click');
    }

    window.LoginScreen = LoginScreen;
})(window, jQuery);
