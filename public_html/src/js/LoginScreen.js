
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
    $ ('#loginUI').fadeOut (500);
};

LoginScreen.prototype.onResume = function ( ) {
    'use strict';
    var username = this.getCookie('username');
    var auth = this.getCookie('authenticator');
    if( username != null && auth != null ) {
        alert('Already logged in');
        /* Swap screens here */
        $ ('#loginUI').fadeOut (500);//temp
    } else {
        /* stay on this screen */
        $ ('#loginUI').fadeIn (500);
    }
};

LoginScreen.prototype.buttonLogic = function (button) {
    'use strict';
    switch (button) {
        case 'Login':
            $('#loginButton').css('display', 'none');
            FCCommunicationManager.login ( $('#emailLogin').val(), $('#passLogin').val(), this.loginFinish.bind(this) );
            this.loginStart();
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

LoginScreen.prototype.loginStart = function ( ) {
    $('#loginBox').slideUp( 300 );
};

LoginScreen.prototype.loginFinish = function ( response ) {
    console.log(response);
    if( response.success == 'false' ) {
        $('#loginBox').slideDown( 300 );
        $('#loginButton').css('display', 'block');
        $('#loginMessage').html('Invalid username/password!');
        $('#loginMessage').css('display', 'block');
    } else {
        $('#loginBox').delay( 500 ).css( 'display', 'block' );
        $('#loginMessage').delay( 500 ).css('display', 'none');
        this.setCookie('username', response.username, 1, '/');
        this.setCookie('authenticator', response.auth, 1, '/');
        /* Swap Screens */
        $('#loginUI').fadeOut( 500 );//temp
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
    if ( get_cookie( name ) ) {
        document.cookie=name + '=' + ((path) ? ';path=' + path:'') + ((domain) ? ';domain=' + domain:'') +
                        ';expires=Thu, 01 Jan 1970 00:00:01 GMT';
    }
};