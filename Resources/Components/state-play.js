// play state(s) 
// Written By JimMarlowe, 2017
// Using the Atomic Game Engine
// MIT licenesed

// This is necessary if you want to take advantage of setTimeout/clearTimeout, setInterval/clearInterval, setImmediate/clearImmediate
require('AtomicEventLoop');
require("Plat");  // the tmx2scene module
var mainx = require("Scripts/main"); // holds THE scene object for the app

var hud;
var scoreLimit;
var scoreCount;
var startTime;
var myfps;  // have fps during game
var jumpView = null;  // jump button on mobile

exports.init = function( uiview, levelx ) {

    scoreLimit = 0;
    scoreCount = 0;

    var inputx = Atomic.input;
    var host = Atomic.engine;

    var mytime = new Atomic.Time();

    //init DPad if its a mobile platform
    if(Atomic.platform == "Android" || Atomic.platform == "iOS") {

        var DPad = require("DPad");
        var dpad = new DPad();
        dpad.addAll();
        dpad.init();
        
        /* jump removed
                jumpView = new Atomic.UIView();

                var jumpButton = new Atomic.UIButton();
                //unset its skin, because we will use UIImageWidget
                jumpButton.skinBg = "";
                //create ours jump button image
                var jumpButtonImage = new Atomic.UIImageWidget();
                //load image
                jumpButtonImage.setImage("UI/jumpButton.png");
                //resize ours image by 2.2x
                var jumpButtonWidth = jumpButtonImage.imageWidth*2.2;
                var jumpButtonHeight = jumpButtonImage.imageHeight*2.2;
                //calculate position
                var posX = Atomic.graphics.width - Atomic.graphics.width/8-jumpButtonWidth/2;
                var posY = Atomic.graphics.height - Atomic.graphics.height/4-jumpButtonHeight/2;

                //sets jumpButton rect, specify position and end position
                jumpView.rect = [posX, posY, posX+jumpButtonWidth, posY+jumpButtonHeight];
                jumpButton.rect = [0, 0, jumpButtonWidth, jumpButtonHeight];
                //sets jumpButtonImage rect, we specify there only end position
                jumpButtonImage.rect = [0, 0, jumpButtonWidth, jumpButtonHeight];
                //adds image to jumpButton
                jumpButton.addChild(jumpButtonImage);
                //adds jumpButton to the dpad view
                jumpView.addChild(jumpButton);
                //sets jumpButton capturing to false, because we wanna make it multitouchable
                jumpButton.setCapturing(false);
                //binds jumpButton to KEY_SPACE
                Atomic.input.bindButton(jumpButton, Atomic.KEY_SPACE);
                // binds FIRE to the jump key!
               // Atomic.input.bindButton(jumpButton, Atomic.KEY_Z);
        */

    }

    if ( inputx.isMouseVisible() )
        inputx.setMouseVisible(false);

    var hud = new Atomic.UILayout();
    hud.id = "HUD";
    hud.rect = uiview.rect;
    hud.axis = Atomic.UI_AXIS_Y;
    hud.layoutSize = Atomic.UI_LAYOUT_SIZE_AVAILABLE;
    hud.layoutDistribution = Atomic.UI_LAYOUT_DISTRIBUTION_AVAILABLE;
    hud.layoutPosition = Atomic.UI_LAYOUT_POSITION_GRAVITY;
    hud.load("Scenes/gamehud.ui.txt");
    uiview.addChild(hud);

    host.subscribeToEvent( "updateScore", function(ev) {

        scoreCount += 1;

        if ( scoreCount == scoreLimit ) { // winner

            if(Atomic.platform == "Android" || Atomic.platform == "iOS") {
                //jump removed    jumpView.removeChild(jumpButton);
                dpad.remove();
            }

            hud.die();
            hud = null;

            clearTimeout(myfps);

            host.sendEvent("LevelDone", { level: levelx } );

            var secs = mytime.getElapsedTime()- startTime;
            var date = new Date(0);
            date.setSeconds(secs);
            var result = date.toISOString().substr(11, 8);

            host.sendEvent("gotoDone", { winTime: result } );

            host.unsubscribeFromEvent( "updateScore" ); // git rid of the event handlers OR ELSE!
            host.unsubscribeFromEvent( "updateFps" );

            AtomicPlayer.Player.currentScene.setUpdateEnabled(false);  // stop movement in this dead scene

        }

        if ( hud !== null ) {
            var scoretext = hud.getWidget("scoretext");
            scoretext.text = "Treasure: " + scoreCount + " (" + scoreLimit + ")";
        }

    });

    host.subscribeToEvent( "updateFps", function(ev) {
        if ( hud === null ) return;
        var fpstext = hud.getWidget("fpstext");
        fpstext.text = "FPS: " + ev.Fps;
        myfps = setTimeout( updateFps, 1111 ); // update it every 1.1 seconds
    });

    // a crutch for development
    host.subscribeToEvent( "debugText", function(ev) {
        if ( hud === null ) return;
        var title = hud.getWidget("titletext");
        title.text = ev.str;
    });

    prepareScene( levelx );
    scoreLimit = Atomic.Plat.getNumTreasure();
    addPlayer();
    updateFps(); // start the clock
    if ( hud !== null ) {
        var scoretext = hud.getWidget("scoretext");
        scoretext.text = "Treasure: " + scoreCount + " (" + scoreLimit + ")";
    }

    startTime = mytime.getElapsedTime(); // play the game now!

};


updateFps = function() {
    var fps = Atomic.engine.getFps();
    Atomic.engine.sendEvent("updateFps", { Fps: fps } );
};


prepareScene = function(levelx) {

    mainx.installScene( "Scenes/Scene.scene" ); // have main wipe and recreate scene

    if ( levelx == 1 ) Atomic.Plat.loadTmxMap ( "Scenes/Adventure1.tmx" );
    else if ( levelx == 2 ) Atomic.Plat.loadTmxMap ( "Scenes/Adventure2.tmx" );
    else if ( levelx == 3 ) Atomic.Plat.loadTmxMap ( "Scenes/Adventure3.tmx" );
    else if ( levelx == 4 ) Atomic.Plat.loadTmxMap ( "Scenes/Adventure4.tmx" );

};


addPlayer = function() {

    var scenex = Atomic.Plat.getScene();  // get the right/current scene
    var nodex = scenex.getChild ("Dwarf", true ); // already instrumented -- remove it, we'll recreate it
    if ( nodex !== null ) {
        nodex.remove();
        nodex = null;
    }
    
    var playr = scenex.createChildPrefab("Dwarf", "Prefabs/psionic_dwarf.prefab");
    playr.scale = [ 0.025, 0.025, 0.025 ];

    var sp = Atomic.Plat.getRandomSpawn();  // find a spawn point, genius...
    playr.position = sp;

};

exports.shutdown = function() {

    clearTimeout(myfps);
    if ( hud !== null )
        hud.die();
    hud = null;

};
