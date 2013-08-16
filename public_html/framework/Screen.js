( function () {
    'use strict';

    var Screen = function () {
        this.scene = new THREE.Scene ();
        return null;
    };

    Screen.prototype = {
        constructor: Screen,
        onUpdate: function (delta) {
            throw new UnimplementedFunctionException ("onUpdate");
        },
        onPause: function () {
            throw new UnimplementedFunctionException ("onPause");
        },
        onLeave: function () {
            throw new UnimplementedFunctionException ("onLeave");
        },
        onResume: function () {
            throw new UnimplementedFunctionException ("onResume");
        },
        getElement: function () {
            throw new UnimplementedFunctionException ("getElement");
        }
    };
    
    // export Screen
    window.Screen = Screen;
}) ( );
