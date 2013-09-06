
MouseButton = function( ) {
    this.isPressed = false;
    this.shifted = false;
    this.pressedX = 0;
    this.pressedY = 0;
};

MouseButton.prototype = {
    constructor: MouseButton,
    press: function(event) {
        'use strict';
        this.isPressed = true;
        this.shifted = event.shiftKey;
        this.pressedX = event.screenX;
        this.pressedY = event.screenY;
    },
    release: function(event) {
        'use strict';
        this.isPressed = false;
        this.shifted = false;
        this.pressedX = event.screenX;
        this.pressedY = event.screenY;
    }
};

function MouseManager( ) {

}
;

MouseManager.leftButton = new MouseButton( );
MouseManager.rightButton = new MouseButton( );

MouseManager.currentX = 0;
MouseManager.cuttentY = 0;

//The mouse button standard values
MouseManager.LEFT_STD_BUTTON = 0;
MouseManager.MIDDLE_STD_BUTTON = 1;
MouseManager.RIGHT_STD_BUTTON = 2;

//Microsofts values
MouseManager.LEFT_WIN_BUTTON = 1;
MouseManager.MIDDLE_WIN_BUTTON = 4;
MouseManager.RIGHT_WIN_BUTTON = 2;

MouseManager.onMouseDown = function(event) {
    'use strict';
    if(event.button === MouseManager.LEFT_STD_BUTTON) {
        MouseManager.leftButton.press(event);
    } else if(event.button === MouseManager.RIGHT_STD_BUTTON) {
        MouseManager.rightButton.press(event);
    }
};

MouseManager.onMouseUp = function(event) {
    'use strict';
    if(event.button === MouseManager.LEFT_STD_BUTTON) {
        MouseManager.leftButton.release(event);
    } else if(event.button === MouseManager.RIGHT_STD_BUTTON) {
        MouseManager.rightButton.release(event);
    }
};

MouseManager.onMouseMove = function(event) {
    'use strict';
    MouseManager.currentX = event.screenX;
    MouseManager.currentY = event.screenY;
};