CommunicationManager = function () {

};

CommunicationManager.parse = function (text) {
    'use strict';
    try {
        return JSON.parse (text);
    } catch (err) {
        throw new Exception ('JSON syntax error, invalid server response');
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
            ).fail(
                function()  {
                    var response = {};
                    response.success = false;
                    callback (CommunicationManager.parse (response));
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
            ).fail(
                function()  {
                    var response = {};
                    response.success = false;
                    callback ('Ajax Failure');
                }
            );
};
