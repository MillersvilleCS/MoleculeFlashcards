/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

Game = function ( camera )
{
    this.m_camera = camera;
    this.m_screen = new GameScreen ( );
    
    return this;
};

Game.prototype =
{
    constructor: Game,
    
    m_camera: undefined,
    m_screen: undefined,
    
    init: function ( )
    {
        this.m_screen.init( );
        //temporary
        this.m_camera.position.y = 7;
        this.m_camera.position.z = 5;
        this.m_camera.position.x = 3;
        this.m_camera.lookAt(new THREE.Vector3(0,0,0));
    },
            
    update: function ( )
    {
        this.m_screen.update ( 0 );
    },
    getCamera: function ( )
    {
        return this.m_camera;
    },
            
    getCurrentScene: function ( )
    {
        return this.m_screen.getScene ( );
    }
    
    
};



