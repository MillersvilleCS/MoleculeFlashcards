CommunicationsManager = function (requestURL)
{
    this.requestURL = requestURL;
};

CommunicationsManager.prototype = {
    constructor: CommunicationsManager,
    loginRequest: function (email, password)
    {
        email = email.toLowerCase ();
        var passwordHash = hex_md5 (password + email);//where is hex_md5 defined?

        var requestObject = Object ();
        requestObject.request_type = "login";
        requestObject.email = email;
        requestObject.hash = passwordHash;

        return this.sendTequest (requestObject);
    },
    getUserRequest: function ( )
    {
        //why are you are you hard-coded in?
        var user = Object ();
        user.username = "sam";
        user.authenticator = "12345";

        this.sendRequest (user);

        return user;
    },
    getContents: function (url)
    {
        var response = $.ajax
                ({
                    url: url,
                    type: 'GET',
                    async: false
                }).responseText;

        return response;
    },
    sendRequest: function ( )
    {
        if (this.requestURL === null)
        {
            console.log ("this.request==null");
        }

        //Make request
        var response = $.ajax
                ({
                    url: this.requestURL,
                    contentType: "application/x-www-form-urlencoded",
                    dataType: "html",
                    type: 'POST',
                    data: JSON.stringify (request_object),
                    async: false
                }).responseText;

        //Turn the JSON response into an object and return it
        try
        {
            return eval ('(' + response + ')');
        }
        catch (err)
        {
            var ret = Object ( );
            ret.success = false;
            ret.error = "JSON syntax error, invalid server response";
            return ret;
        }
    }
};