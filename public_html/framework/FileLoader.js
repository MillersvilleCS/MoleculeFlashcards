/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


FileLoader = function ( )
{
    
};

FileLoader.FILE_READY = 4;
FileLoader.FILE_FOUND = 200;

FileLoader.prototype.loadText = function ( url )
{
    var textFile;
    
    if ( window.XMLHttpRequest )
    {
        textFile = new XMLHttpRequest ( );
    }
    textFile.onreadystatechange = function ( )
    {
        if ( textFile.readyState === FileLoader.FILE_READY && 
                textFile.status === FileLoader.FILE_FOUND )
        {
           allText = textFile.responseText;
           lines = textFile.responseText.split ( '\n' );
           console.log('These are split correctly! Shows them weird in console, good to parse!');
           console.log(lines);
        }    
    };
    textFile.open( "GET", url, true );
    textFile.setRequestHeader( "Content-Type", "text/plain" );
    textFile.send( null );
};