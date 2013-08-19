CookieManager = function () {
    'use strict';
};

CookieManager.getCookie = function (cookieName) {
    'use strict';
    var cookieValue = document.cookie;
    var cookieStart = cookieValue.indexOf (' ' + cookieName + '=');
    if (cookieStart === -1) {
        cookieStart = cookieValue.indexOf (cookieName + '=');
    }

    if (cookieStart === -1) {
        cookieValue = null;
    }
    else {
        cookieStart = cookieValue.indexOf ('=', cookieStart) + 1;
        var cookieEnd = cookieValue.indexOf (';', cookieStart);
        if (cookieEnd === -1) {
            cookieEnd = cookieValue.length;
        }
        cookieValue = unescape (cookieValue.substring (cookieStart, cookieEnd));
    }

    return cookieValue;
};

CookieManager.setCookie = function (cookieName, cookieValue, cookieExpireDays, path) {
    var expireDate = new Date ();

    expireDate.setDate (expireDate.getDate () + cookieExpireDays);

    var cookieValue = escape (cookieValue) + ((path) ? ';path=' + path : '') +
            ((cookieExpireDays === null) ? '' : '; expires=' + expireDate.toUTCString ());

    document.cookie = cookieName + '=' + cookieValue;
};

CookieManager.deleteCookie = function (cookieName, path, domain) {
    if (getCookie (name)) {
        document.cookie = name + '=' + ((path) ? ';path=' + path : '') + ((domain) ? ';domain=' + domain : '') +
                ';expires=Thu, 01 Jan 1970 00:00:01 GMT';
    }
};
