/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


FileLoader = function ( )
{
    
};

FileLoader.FILE_READY = 4;
FileLoader.FILE_FOUND = 200;

FileLoader.loadText = function ( url )
{
    var textfile;
    
    if ( window.XMLHttpRequest )
    {
        textfile = new XMLHttpRequest ( );
    }
    textfile.onreadystatechange = function ( )
    {
        if ( textfile.readyState === FileLoader.FILE_READY && 
                textfile.status === FileLoader.FILE_FOUND )
        {
           allText = textfile.responseText;
           lines = txtFile.responseText.split("\n");
        }    
    };
    textfile.send( null );
};