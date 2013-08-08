/*
 * replace with map class when javascript 6 is finalized.
 */
Map = function ( )
{
    
};

Map.prototype = {
    constructor: Map,
    size: 0,
    put: function ( key, value )
    {
        this[ key ] = value;

        ++this.size;
    },
    get: function ( key )
    {
        return this[ key ];
    },
    remove: function ( key )
    {
        delete this[ key ];
        --this.size;
    },
    contains: function ( key )
    {
        return this.hasOwnProperty ( key );
    }
};
