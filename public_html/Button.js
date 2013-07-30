/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */



Button = function ( text )
{
    this.id = this.generateID ( );
    this.text = text;
};

Button.currButtonId = 0;

Button.prototype =
{
    constructor: Button,
            
    id: undefined, 
    text: "",
    
    bind: function ( )
    {
        $('#container').append("<button class='game_button' id='" + this.id + "'>" + this.text + "</button>");
    },
    generateID: function ( )
    {
        return Button.currButtonId++;
    }
};


