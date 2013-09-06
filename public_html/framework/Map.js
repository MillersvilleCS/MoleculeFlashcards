/*
 * replace with map class when javascript 6 is finalized.
 */
Map = function() {
    'use strict';
    this.size = 0;
};

Map.prototype = {
    constructor: Map,
    put: function(key, value) {
        'use strict';
        this[ key ] = value;
        ++this.size;
    },
    get: function(key) {
        'use strict';
        return this[ key ];
    },
    remove: function(key) {
        'use strict';
        this[ key ] = null;
        --this.size;
    },
    contains: function(key) {
        'use strict';
        return this.hasOwnProperty(key);
    }
};
