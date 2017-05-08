// This script is the main entry point of the Adventure Suite, using the TMX2SCENE (Plat) utility
// Written By JimMarlowe 2017
// Using the Atomic Game Engine
// MIT licenesed

require("Plat");  // the tmx2scene module
var ss = require("Components/screenshot");  // take a picture, it will last longer
var storage = require("Components/storage"); // save platform specific data
// the game states for this fine program
var menu_ = require("Components/state-menu");
var info_ = require("Components/state-info");
var play_ = require("Components/state-play");
var done_ = require("Components/state-done");

var scene = null;    // the scene
var hasdata = false; // has the ability to save and load data files
var pgmSettings = {  // program settings object
    level1 : 0,  //completed level 1
    level2 : 0,  //completed level 2
    level3 : 0,  //completed level 3
    level4 : 0,  //completed level 4
    debug : 0,  // show scene geometry debug
    shadows : 0, // override no shadows on linux and android
    mobile : 0  // override mobile dpi
};

// create the plat == tmx2scene converter
var plat = Atomic.Plat;

// see what the file situation is
var filesystem = Atomic.getFileSystem();  // Get the FileSystem subsystem
var documentsDir = ""; // Get out documents folder
if (Atomic.platform == "Android" || Atomic.platform == "iOS")
    documentsDir = filesystem.getUserDocumentsDir(); // somewhere writable on android
else documentsDir = filesystem.getAppPreferencesDir("Piranasoft", "advsuite"); // on desktop systems
// check to see if the data directory exists and can be written to
if ( !filesystem.dirExists( documentsDir ) ) {  //does this dir exist?
    if ( filesystem.createDir( documentsDir ) ) {  // attempt to create it ..
        hasdata = true;
    } else hasdata = false;
} else hasdata = true;


// load up the saved data, if its got any
if ( hasdata ) {
    var configFile = documentsDir + "config.json";
    if (filesystem.fileExists( configFile ) ) {
        var configdata = "";
        var cfile = new Atomic.File(configFile, Atomic.FILE_READ);
        if ( cfile.isOpen() ) {
            configdata = cfile.readString();
            pgmSettings = JSON.parse(configdata);
            cfile.close();
        }
    }
}

// create host object for GUI
var uiview = new Atomic.UIView();

// add a gooder font
Atomic.ui.addFont("Textures/Pretzel Regular.ttf", "Pretzel");

//load the app skins for mobile and desktop, et al
if (( Atomic.platform == "Android" ) || Atomic.platform == "iOS") {
    if ( pgmSettings.mobile === 0 ) {  // guess whats right
        if (Atomic.graphics.width < 1200)
            Atomic.ui.loadSkin("Textures/tablet.tb.txt");
        else Atomic.ui.loadSkin("Textures/mobile.tb.txt");
    } // user tells you whats right-ish
    else if ( pgmSettings.mobile == 1 ) Atomic.ui.loadSkin("Textures/mobile.tb.txt");
    else if ( pgmSettings.mobile == 2 ) Atomic.ui.loadSkin("Textures/tablet.tb.txt");
    else if ( pgmSettings.mobile == 3 ) Atomic.ui.loadSkin("Textures/desktop.tb.txt");
} else // desktop is a desktop
    Atomic.ui.loadSkin("Textures/desktop.tb.txt" );


// subscribe to event handlers for switching program states
Atomic.engine.subscribeToEvent("gotoMenu", function(ev) {
    menu_.init(uiview, pgmSettings.level1, pgmSettings.level2, pgmSettings.level3, pgmSettings.level4 );
});
Atomic.engine.subscribeToEvent("gotoInfo", function(ev) {
    info_.init(uiview, pgmSettings.debug, pgmSettings.shadows, pgmSettings.mobile );
});
Atomic.engine.subscribeToEvent("gotoPlay", function(ev) {
    play_.init(uiview, ev.level);
});
Atomic.engine.subscribeToEvent("gotoDone", function(ev) {
    done_.init(uiview, ev.winTime);
});


// manually start the state machine
menu_.init(uiview,  pgmSettings.level1, pgmSettings.level2, pgmSettings.level3, pgmSettings.level4 );


// and put in the intro scene
installScene ("Scenes/Intro.scene");


// function to save the config settings
function saveConfig() {
    if ( hasdata ) {  // has local data and program settings
        var configFile = "config.json";
        storage.storage ( configFile, JSON.stringify(pgmSettings));
    }
}

// event handler for "LevelDone" which updates the persistant levels done program settings
Atomic.engine.subscribeToEvent( "LevelDone", function(ev) {

    if ( ev.level == 1 ) pgmSettings.level1 = 1;
    else if ( ev.level == 2 ) pgmSettings.level2 = 1;
    else if ( ev.level == 3 ) pgmSettings.level3 = 1;
    else if ( ev.level == 4 )  pgmSettings.level4 = 1;
    saveConfig(); // save it now, why wait

});

// event handler for "configDone" which updates program settings
Atomic.engine.subscribeToEvent( "configDone", function(ev) {

    pgmSettings.debug = ev.debug;
    pgmSettings.shadows = ev.shadows;
    pgmSettings.mobile = ev.mobile;
    saveConfig(); // save it now, why wait

});

// event handler for "DoExit" which can be called from the menu
Atomic.engine.subscribeToEvent( "DoExit", function() {
    saveConfig();
    Atomic.engine.exit();
});

// establish the scene here and be able to load in different scenes
function installScene ( scenename ) {

    if ( scene !== null ) {  // the scene has contents, weve got to clean up some.
        for( var nn=0; nn<scene.getNumChildren(true); nn++ ) { // get rid of the old event handlers
                                                               // OR ELSE they will continue to be called!
            var child = scene.getChildAtIndex (nn);            // true story.
            if ( child !== null ) child.unsubscribeFromAllEvents(); // these are the problem children.
        }
        scene.unsubscribeFromAllEvents();
        scene.clear(true, true);  //  get rid of the scene nodes 
        Atomic.player.unloadScene ( scene ); // and unload it
    }

    scene = Atomic.player.loadScene(scenename); // now bring it.
    Atomic.player.setCurrentScene (scene);
    AtomicPlayer.Player.currentScene = scene; // grrr fix this global for 3D
    plat.init( scene );  // tell the tmx2scene module that we have a new scene

    // strike up the boys in the band, do they only know ONE song?  
    var sfx = Atomic.cache.getResource("Sound", "Sounds/SoundHelix-marlowe_-_The_marching_frog_from_above.ogg");
    sfx.looped = true;

    var sfxNode = scene.createChild("SFXNode");
    var sfxSource = sfxNode.createComponent("SoundSource");
    sfxSource.gain = 0.3;
    sfxSource.soundType = Atomic.SOUND_MUSIC;
    sfxSource.stop();
    sfxSource.play(sfx);

    // fix up shadows for platform issues
    // shadows on linux are bad (if done per vertex, they are a no show)
    // and android they are a little wonky, windows is good though, OSX is OK, ios = ?
    if (  Atomic.platform == "Android" || Atomic.platform == "Linux" )  {
        var globallite = scene.getChild ("GlobalLight", true );
        if ( globallite !== null && pgmSettings.shadows === 0 ) {  // if not overridden fon the config
            var lite = globallite.getComponent("Light");
            lite.castShadows = false;
            lite.perVertex = false;
        }
    }

    if ( pgmSettings.debug > 0 ) { // turn on scene debugging -- really a dev feature
        // we get a debugRenderer from the scene, if scene doesn't have one, it won't work
        var debug = scene.getComponent("DebugRenderer");
        var world = scene.getComponent("PhysicsWorld");
        // we excecute drawDebugGeometry function to render world debug geometry
        scene.subscribeToEvent(Atomic.PostRenderUpdateEvent(function() {
            world.drawDebugGeometry(debug, true);
        }));
    }

}


//  update - do things every once in a while
function update(timeStep) {  // called per frame
    var inputx = Atomic.input;
    if ( inputx.getKeyDown(Atomic.KEY_ESCAPE) ) {
        saveConfig();
        Atomic.engine.exit();
    } else if ( inputx.getKeyDown(Atomic.KEY_F1 ) ) {
        var got = ss.ScreenshotJPG();
        console.log ( "Screenshot saved at " + got );
    }
}


exports.installScene = installScene;
exports.update = update;
