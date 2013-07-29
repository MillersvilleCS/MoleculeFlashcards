/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/*
 * Mouse Button
 */

MouseButton = function ( )
{
    
};

MouseButton.prototype =
{
    constructor: MouseButton,
            
    isPressed: false, 
    pressedX: 0, 
    pressedY: 0,
    pressedShift: false,
    
    press: function ( event )
    {
        this.isPressed = true;
        this.pressedShift = event.shiftKey;
        this.pressedX = event.screenX;
        this.pressedY = event.screenY;
    },
    
    release: function ( event )
    {
        this.isPressed = false;
        this.pressedX = event.screenX;
        this.pressedY = event.screenY;
    }
};



/*
 *MOUSE MANAGER
 */

function MouseManager ( )
{
    
};

MouseManager.leftButton = new MouseButton ( ),
MouseManager.rightPressed = new MouseButton ( ),

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
    if ( event.button === MouseManager.LEFT_STD_BUTTON )
    {
        MouseManager.leftButton.press ( event );
    }
    else if ( event.button === MouseManager.RIGHT_STD_BUTTON )
    {
        MouseManager.rightButton.press ( event );
    }
};

MouseManager.onMouseUp = function ( event )
{
    if ( event.button === MouseManager.LEFT_STD_BUTTON )
    {
        MouseManager.leftButton.press ( event );
    }
    else if ( event.button === MouseManager.RIGHT_STD_BUTTON )
    {
        MouseManager.rightButton.press ( event );
    }
};
