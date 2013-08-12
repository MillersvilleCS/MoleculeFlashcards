CommunicationManager = function () {

};

CommunicationManager.parse = function (text) {
    'use strict';
    try {
        return JSON.parse (text);
    } catch (err) {
        var ret = {
        };
        ret.success = false;
        ret.error = 'JSON syntax error, invalid server response';
        return ret;
    }
};

CommunicationManager.post = function (requestUrl, requestObject, callback) {
    'use strict';
    var response = $.ajax
            ({
                url: requestUrl,
                contentType: 'application/x-www-form-urlencoded',
                dataType: 'html',
                type: 'POST',
                data: JSON.stringify (requestObject),
                async: true
            }).done (
            function () {
                callback (CommunicationManager.parse (response.responseText));
            }
    );
};

CommunicationManager.get = function (requestUrl, requestObject, callback) {
    'use strict';
    var response = $.ajax
            ({
                url: requestUrl,
                contentType: 'application/x-www-form-urlencoded',
                dataType: 'html',
                type: 'GET',
                data: requestObject,
                async: true
            }).done (
            function () {
                callback (response.responseText);
            }
    );
};
