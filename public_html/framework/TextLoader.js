TextLoader = function ( )
{

};

TextLoader.FILE_READY = 4;
TextLoader.FILE_FOUND = 200;

TextLoader.loadText = function ( url, callback )
{
    var textFile = $.ajax ( url )
            .done ( function () {
        callback ( textFile.responseText );
    } )
            .fail ( function () {
        callback ( 'ERROR' );
    } )
            .always ( function () {
    } );
};