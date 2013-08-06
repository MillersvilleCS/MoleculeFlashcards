Molecule = function ( pdbStr )
{
    this.mesh = Molecule.extractor.load ( pdbStr );
};

Molecule.extractor = new MoleculeGeometryBuilder ( );

Molecule.prototype =
{
    constructor: Molecule,
    
    setPosition: function ( x, y, z )
    {
        this.mesh.position.x = x;
        this.mesh.position.y = y;
        this.mesh.position.z = z;
        
        return this;
    },
            
    addPosition: function ( x, y, z )
    {
        this.mesh.position.x += x;
        this.mesh.position.y += y;
        this.mesh.position.z += z;
        
        return this;
    },
            
    setNonuniformScale: function ( x, y, z )
    {
        this.mesh.scale.x = x;
        this.mesh.scale.y = y;
        this.mesh.scale.z = z;
        
        return this;
    },
            
    setUniformScale: function ( scalar )
    {   
        return this.setNonuniformScale ( scalar, scalar, scalar );
    }
};
