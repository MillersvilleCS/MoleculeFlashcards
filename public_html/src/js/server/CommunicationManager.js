CommunicationManager = function () {

};

CommunicationManager.request = function ( requestUrl, requestObject, callback ) {
    var response = $.ajax
            ({
                url: requestUrl,
                contentType: "application/x-www-form-urlencoded",
                dataType: "html",
                type: 'POST',
                data: JSON.stringify (requestObject),
                async: true
            }).done (
                function () {
                    callback (response.responseText);
                }
            );
}

CommunicationManager.parse = function ( text ) {
    try {
        return JSON.parse ( text );
    }
    catch (err) {
        var ret = {};
        ret.success = false;
        ret.error = "JSON syntax error, invalid server response";
        return ret;
    }
}

CommunicationManager.login = function ( email, password , callback) {
    email = email.toLowerCase ();
    var passwordHash = hex_md5 (password + email);

    var requestObject = {};
    requestObject.request_type = "login";
    requestObject.email = email;
    requestObject.hash = passwordHash;

    CommunicationManager.request ( 'http://exscitech.gcl.cis.udel.edu/exscitech_sam/request_handler.php', requestObject, callback );
}