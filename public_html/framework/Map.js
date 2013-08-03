/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */



Map = function ( )
{
    
};

Map.prototype =
{
    constructor: Map,
            
    size: 0,
    
    put: function ( key , value )
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
        this[ key ] = undefined;
        --this.size;
    },
            
    contains: function ( key )
    {
        return this[ key ] !== undefined;
    },
    
    getNumberOfElements: function ( )
    {
        return this.size;
    }
    
};