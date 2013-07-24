/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


GameScreen = function ( )
{
    this.m_scene = new THREE.Scene ( );
    
    return this;
};

GameScreen.prototype =
{
    constructor: GameScreen,
            
    m_scene: undefined,
    
    init: function ( )
    {
        var geometry = new THREE.CubeGeometry( 1, 1, 1 );
        var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
        var cube = new THREE.Mesh( geometry, material );
        this.m_scene.add ( cube );

    },
            
    update: function ( delta )
    {
        
    },
    
    pause: function ( )
    {
        
    },
            
    onLeave: function ( )
    {
        
    },
            
    onResume: function ( )
    {
        
    },
    
    getScene: function ( )
    {
        return this.m_scene;
    }
};
