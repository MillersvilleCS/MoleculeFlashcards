CommunicationManager = function() {
    'use strict';
};

CommunicationManager.lastRequest = {};
CommunicationManager.retryCount = -1;
CommunicationManager.errorCallback = undefined;

CommunicationManager.parse = function(text) {
    'use strict';
    try {
        return JSON.parse(text);
    } catch( err ) {
        throw new Exception('JSON syntax error, invalid server response');
    }
};

CommunicationManager.post = function(requestUrl, requestObject, callback) {
    'use strict';
    var response = $.ajax
            ({
                url: requestUrl,
                contentType: 'application/x-www-form-urlencoded',
                dataType: 'html',
                type: 'POST',
                data: JSON.stringify(requestObject),
                async: true
            }).done(
                function() {
                    /* 
                        If you are not logged into the school wifi, the AJAX request will succeed,
                        but of course you get garbage data (login html) and the parser throws an
                        error. Catch this error if that occurs, and mark it as a 407
                        Error 407 = Proxy Authentication Required
                    */
                    try {
                        var jData = CommunicationManager.parse( response.responseText );
                        CommunicationManager.retryCount = -1;
                        callback( jData );
                    } catch( err ) {
                        var info = {};
                        info.status = 407;
                        CommunicationManager.error(info, 'post', requestUrl, requestObject, callback);
                    }
                }
            ).fail(
                function( info ) {
                    CommunicationManager.error(info, 'post', requestUrl, requestObject, callback);
                }
            );
};

CommunicationManager.get = function(requestUrl, requestObject, callback) {
    'use strict';
    var response = $.ajax
            ({
                url: requestUrl,
                contentType: 'application/x-www-form-urlencoded',
                dataType: 'html',
                type: 'GET',
                data: requestObject,
                async: true
            }).done(
                function() {
                    CommunicationManager.retryCount = -1;
                    callback(response.responseText);
                }
            ).fail(
                function( info ) {
                    CommunicationManager.error(info, 'get', requestUrl, requestObject, callback);
                }
            );
};

CommunicationManager.error = function( info, type, requestUrl, requestObject, callback ) {
    CommunicationManager.retryCount++;
    CommunicationManager.lastRequest = {};
    CommunicationManager.lastRequest.type = type;
    CommunicationManager.lastRequest.requestUrl = requestUrl;
    CommunicationManager.lastRequest.requestObject = requestObject;
    CommunicationManager.lastRequest.callback = callback;

    if(CommunicationManager.errorCallback != undefined) {
        CommunicationManager.errorCallback( info );
    }
};

CommunicationManager.retry = function( ) {
    var lastRequest = CommunicationManager.lastRequest;
    if( lastRequest.type == 'post' ) {
        CommunicationManager.post( lastRequest.requestUrl, lastRequest.requestObject, lastRequest.callback );
    } else {
        CommunicationManager.get( lastRequest.requestUrl, lastRequest.requestObject, lastRequest.callback );
    }
};