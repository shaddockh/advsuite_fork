// Derivitive of the Avatar class from the Atomic examples
// fixed for the Psionic remanufactured Dwarf model

// designate component
"atomic component";

//import gl-matrix library   https://github.com/toji/gl-matrix for more information
var glmatrix = require("gl-matrix");
var quat = glmatrix.quat;

require("Plat");  // the tmx2scene module needed for random spawn point


// An character component
exports.component = function(self) {

    //link to the current node
    var node = self.node;

    //get Animation and character controller components
    var idle = true;
    var animCtrl = node.getComponent("AnimationController");
    var controller = node.getJSComponent("CharacterController");
    var sound1 = Atomic.cache.getResource("Sound", "Sounds/feets.ogg");
    var playerSound1 = null;
    var playerSource1 = null;
    var sound2 = Atomic.cache.getResource("Sound", "Sounds/magic1.ogg");
    var playerSound2 = null;
    var playerSource2 = null;
    var sound3 = Atomic.cache.getResource("Sound", "Sounds/spell.ogg");
    var playerSound3 = null;
    var playerSource3 = null;

//
//  start
//
    self.start = function() {

        //get main camera of the current scene since were gonna attach it to this character
        var camera = node.scene.getMainCamera();
        //if it exists
        if (camera) {
            camera.node.position = [0, 0, -10];
            camera.node.pitch(20);
            Atomic.audio.listener = camera.node.getComponent("SoundListener");
        }

        playerSound1 = self.node.getChild("Sound1");  // it may have been created before
        if ( playerSound1 === null ) playerSound1 = self.node.createChild("Sound1");
        playerSource1 = playerSound1.getComponent("SoundSource3D");
        if ( playerSource1 === null ) {
            playerSource1 = playerSound1.createComponent( "SoundSource3D");
            playerSource1.setGain(0.1);
            playerSource1.setSoundType("Ambient");
        }

        playerSound2 = self.node.getChild("Sound2");
        if ( playerSound2 === null ) playerSound2 = self.node.createChild("Sound2");
        playerSource2 =  playerSound2.getComponent("SoundSource3D");
        if ( playerSource2 === null ) {
            playerSource2 = playerSound2.createComponent("SoundSource3D");
            playerSource2.setGain(0.5);
            playerSource2.setSoundType("Effect");
        }

        playerSound3 = self.node.getChild("Sound3");
        if ( playerSound3 === null ) playerSound3 = self.node.createChild("Sound3");
        playerSource3 = playerSound3.getComponent("SoundSource3D");
        if ( playerSource3 === null ) {
            playerSource3 = playerSound3.createComponent("SoundSource3D");
            playerSource3.setGain(0.5);
            playerSource3.setSoundType("Effect");
        }

        // use anim trigger (file) to play the footsteps sounds 
        self.subscribeToEvent("AnimationTrigger", function(ev) {

            if (playerSource1 !== null ) {
                if ( !playerSource1.isPlaying()) {
                    if (playerSound1 !== null ) playerSound1.position = self.node.position;
                    playerSource1.play(sound1);
                }
            }

        });

        // weve run into a pickup class object, lets see what it does
        self.node.subscribeToEvent("Pickup", function(ev) {

            if ( ev.whoAmI == "FoolsGold") {  // when you get one of these, instead of getting points, you
                                              // get punished by sending you back to a spawn point!
                var sp = Atomic.Plat.getRandomSpawn();
                self.node.position = sp;
                if (playerSound2 !== null ) playerSound2.position = self.node.position;
                if (playerSource2 !== null ) playerSource2.play(sound2);

            }

            if ( ev.whoAmI == "Chest") { // good job, got some gold!
                Atomic.engine.sendEvent("updateScore", { } );  // do some scoring

                if (playerSound3 !== null ) playerSound3.position = self.node.position;
                if (playerSource3 !== null ) playerSource3.play(sound3);
            }
        });

        // start up the animation
        animCtrl.playExclusive("Models/DwarfJM/psionic_dwarf_jm@idle1.ani", 0, true, 0.0);

        //rotate current node around Y axis
        var dir = quat.create();
        //set y value
        quat.setAxisAngle(dir, [0, 1, 0], 180 );
        // rotate node, no pitch change, thats just for the camera
        node.setRotation([dir[3], dir[0], dir[1], dir[2]]);
    };


//
//  update
//  make it do something already.
//
    self.update = function(timeStep) {

        // we arent implementing this right now
        if ( controller.fire ) {
            animCtrl.playExclusive("Models/DwarfJM/psionic_dwarf_jm@attack1.ani", 0, true, 1.0);
        }

        if (idle != controller.idle) {

            idle = controller.idle;

            // hey if we blend - blend anims at "Spine2" bone

            if (idle) {  // two idle anims, to make it look a little more lifelike
                if ( Math.random() > 0.5 ) animCtrl.playExclusive("Models/DwarfJM/psionic_dwarf_jm@idle1.ani", 0, true, 0.1);
                else animCtrl.playExclusive("Models/DwarfJM/psionic_dwarf_jm@idle2.ani", 0, true, 0.1);
            } else {
                animCtrl.playExclusive("Models/DwarfJM/psionic_dwarf_jm@walk.ani", 0, true, 0.1);
            }
        }
    };

};
