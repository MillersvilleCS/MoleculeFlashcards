/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


function MouseManager ( )
{
    
};

MouseManager.leftPressed = false,
MouseManager.rightPressed = false,

//The mouse button standard values
MouseManager.LEFT_STD_BUTTON = 0;
MouseManager.MIDDLE_STD_BUTTON = 1;
MouseManager.RIGHT_STD_BUTTON = 2;

//Microsofts values
MouseManager.LEFT_WIN_BUTTON = 1;
MouseManager.MIDDLE_WIN_BUTTON = 4;
MouseManager.RIGHT_WIN_BUTTON = 2;

MouseManager.onMouseDown = function ( event )
{
    if ( !event )
    {
        event = window.event;
    }
};

MouseManager.onMouseUp = function ( event )
{
    if ( !event )
    {
        event = window.event;
    }
};
