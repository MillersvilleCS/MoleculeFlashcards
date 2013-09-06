AudioObject = function(location)
{
    'use strict';
    this.audio = document.createElement('audio');
    var source = document.createElement('source');

    source.src = location;

    this.audio.appendChild(source);
};

AudioObject.prototype = {
    construcor: AudioObject,
    volume: 100,
    muted: false,
    play: function( )
    {
        'use strict';
        this.audio.play( );
    },
    setVolume: function(volume)
    {
        'use strict';
        this.volume = volume;

        if(this.volume > 100)
        {
            this.volume = 100;
        }
        else if(this.volume < 0)
        {
            this.volume = 0;
        }
    }
};

AudioManager = function( )
{
    this.soundMap = new Map( );
};

AudioManager.prototype = {
    construcor: AudioManager,
    volume: 100,
    muted: false,
    loadSound: function(source, key)
    {
        var sound = new SoundObject(source);
        this.soundMap.put(key, sound);
    },
    playSound: function(key)
    {
        this.soundMap.get(key).play( );
    },
    setGlobalVolume: function(volume)
    {
        this.volume = volume;

        if(this.volume > 100)
        {
            this.volume = 100;
        }
        else if(this.volume < 0)
        {
            this.volume = 0;
        }
    },
    setSoundVolume: function(key, volume)
    {
        this.soundMap.get(key).setVolume(volume);
    }
};
