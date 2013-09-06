/*
 * Don't ever modify me
 */
var Screen = function($element) {
    'use strict';
    this.$element = $element;
    this.scene = new THREE.Scene();
};

Screen.prototype = {
    constructor: Screen,
    onUpdate: function(delta) {
        'use strict';
        throw new UnimplementedFunctionException('onUpdate');
    },
    onPause: function() {
        'use strict';
        throw new UnimplementedFunctionException('onPause');
    },
    onLeave: function() {
        'use strict';
        throw new UnimplementedFunctionException('onLeave');
    },
    onResume: function() {
        'use strict';
        throw new UnimplementedFunctionException('onResume');
    }
};