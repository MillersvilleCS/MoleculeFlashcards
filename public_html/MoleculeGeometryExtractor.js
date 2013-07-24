/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


MoleculeGeometryExtractor = function ()
{
    
};

MoleculeGeometryExtractor.prototype =
{
    constructor: MoleculeGeometryExtractor,
    
    parseSDF: function(str) 
    {
        var atoms = this.atoms;
        var protein = this.protein;

        var lines = str.split("\n");
        if (lines.length < 4)
        {
            return;
        }
        var atomCount = parseInt(lines[3].substr(0, 3));
        
        if (isNaN(atomCount) || atomCount <= 0)
        {
            return;
        }
        var bondCount = parseInt(lines[3].substr(3, 3));
        var offset = 4;
        
        if (lines.length < 4 + atomCount + bondCount)
        {
            return;
        }
        
        for (var i = 1; i <= atomCount; i++)
        {
           var line = lines[offset];
           offset++;
           var atom = {};
           atom.serial = i;
           atom.x = parseFloat(line.substr(0, 10));
           atom.y = parseFloat(line.substr(10, 10));
           atom.z = parseFloat(line.substr(20, 10));
           atom.hetflag = true;
           atom.atom = atom.elem = line.substr(31, 3).replace(/ /g, "");
           atom.bonds = [];
           atom.bondOrder = [];
           atoms[i] = atom;
        }
        
        for (i = 1; i <= bondCount; i++) 
        {
           var line = lines[offset];
           offset++;
           var from = parseInt(line.substr(0, 3));
           var to = parseInt(line.substr(3, 3));
           var order = parseInt(line.substr(6, 3));
           atoms[from].bonds.push(to);
           atoms[from].bondOrder.push(order);
           atoms[to].bonds.push(from);
           atoms[to].bondOrder.push(order);
        }

        protein.smallMolecule = true;
        return true;
    },

    parseXYZ: function(str) {
       var atoms = this.atoms;
       var protein = this.protein;

       var lines = str.split("\n");
       if (lines.length < 3) return;
       var atomCount = parseInt(lines[0].substr(0, 3));
       if (isNaN(atomCount) || atomCount <= 0) return;
       if (lines.length < atomCount + 2) return;
       var offset = 2;
       for (var i = 1; i <= atomCount; i++) {
          var line = lines[offset++];
          var tokens = line.replace(/^\s+/, "").replace(/\s+/g," ").split(" ");
          console.log(tokens);
          var atom = {};
          atom.serial = i;
          atom.atom = atom.elem = tokens[0];
          atom.x = parseFloat(tokens[1]);
          atom.y = parseFloat(tokens[2]);
          atom.z = parseFloat(tokens[3]);
          atom.hetflag = true;
          atom.bonds = [];
          atom.bondOrder = [];
          atoms[i] = atom;
       }
       for (var i = 1; i < atomCount; i++) // hopefully XYZ is small enough
          for (var j = i + 1; j <= atomCount; j++)
             if (this.isConnected(atoms[i], atoms[j])) {
                atoms[i].bonds.push(j);
                atoms[i].bondOrder.push(1);
                atoms[j].bonds.push(i);
                atoms[j].bondOrder.push(1);
             }
       protein.smallMolecule = true;
       return true;
    },
    
    buildGeometry: function ( )
    {
        
    }
};




