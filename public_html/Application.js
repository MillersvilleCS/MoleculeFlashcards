/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


Application = function ( game, title, width, height )
{
    this.m_game = game;
    this.m_renderer =  new THREE.WebGLRenderer( );
    this.m_renderer.setSize(width, height);
    this.init ( );
    
    $container.append( this.m_renderer.domElement );
    
    return this;
};

Application.prototype =
{
    constructor: Application,
    
    m_game: undefined,
    m_renderer: undefined,
    
    init: function ( )
    {
        this.m_game.init ( );
    },
            
    loop: function ( )
    {
         this.m_game.update ( );
         this.m_renderer.render ( this.m_game.getCurrentScene ( ), this.m_game.getCamera ( ));
    },
            
    exit: function ( )
    {
        
    },
    
    onMouseDown: function ( )
    {
        alert("Mouse Down");
    },
            
    onMouseUp: function ( )
    {
        alert("Mouse Up");
    }
};
