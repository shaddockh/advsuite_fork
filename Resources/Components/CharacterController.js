// Derivitive of the AvatarController class from the Atomic examples
// fixed for the Psionic remanufactured Dwarf model

// designate component
"atomic component";

//import gl-matrix library
//https://github.com/toji/gl-matrix for more information
var glmatrix = require("gl-matrix");
var quat = glmatrix.quat;
var vec3 = glmatrix.vec3;

//define an inspectorFields to make variables visible in editor
var inspectorFields = {
    //needs default value to make editor understand type of that value
    speed: 1.0
};


//define a CharacterController -- deals with input, positioning and movement

exports.component = function (self) {

    var node = self.node; //link to the current node

    var animModel = node.getComponent("AnimatedModel");

    var onGround = true;
    var okToJump = true;

    //define constants
    var MOVE_FORCE = 1.8;
    var INAIR_MOVE_FORCE = 0.02;
    var BRAKE_FORCE = 0.2;
    var JUMP_FORCE = 7.0;
    var YAW_SENSITIVITY = 0.1;
    var INAIR_THRESHOLD_TIME = 0.1;

    var cameraNode;
    var cameraMode = 0;

    var yaw = 0;
    var pitch = 0;

    var moveForward = false;
    var moveBackwards = false;
    var moveLeft = false;
    var moveRight = false;
    var mouseMoveX = 0.0;
    var mouseMoveY = 0.0;
    var button0 = false;
    var button1 = false;

    self.fire = false;   //shoot!
    self.idle = true;

    self.start = function () {
        //get main camera and set its node to cameraNode
        var camera = node.scene.getMainCamera();
        cameraNode = camera.node;
    };


// fyi -- called twice as often as postUpdate...
    self.fixedUpdate = function (timestep) {

        //get a RigidBody component from the current node
        var body = node.getComponent("RigidBody");
        var inAirTimer = 0.0;

        // Update the in air timer. Reset if grounded
        if (!onGround)
            inAirTimer += timestep;
        else
            inAirTimer = 0.0;

        // When character has been in air less than 1/10 second, it's still interpreted as being on ground
        var softGrounded = inAirTimer < INAIR_THRESHOLD_TIME;

        // Get rotation of the current node
        var rot = node.getRotation();

        var moveDir = [0, 0, 0];

        // Update movement & animation
        var velocity = body.getLinearVelocity();

        // Velocity on the XZ plane
        var planeVelocity = [velocity[0], 0.0, velocity[2]];

        if (cameraMode != 2) {
            if (moveForward) {
                vec3.add(moveDir, moveDir, [0, 0, -1]);
            }
            if (moveBackwards) {
                vec3.add(moveDir, moveDir, [0, 0, 1]);
            }
            if (moveLeft) {
                vec3.add(moveDir, moveDir, [1, 0, 0]);
            }
            if (moveRight) {
                vec3.add(moveDir, moveDir, [-1, 0, 0]);
            }
        }

        if (vec3.length(moveDir) > 0.0)
            vec3.normalize(moveDir, moveDir);

        vec3.transformQuat(moveDir, moveDir, [rot[1], rot[2], rot[3], rot[0]]);
        vec3.scale(moveDir, moveDir, (softGrounded ? MOVE_FORCE : INAIR_MOVE_FORCE));

        if (softGrounded)
            vec3.scale(moveDir, moveDir, self.speed);

        body.applyImpulse(moveDir);

        if (softGrounded) {

            // When on ground, apply a braking force to limit maximum ground velocity
            vec3.negate(planeVelocity, planeVelocity);
            vec3.scale(planeVelocity, planeVelocity, BRAKE_FORCE);
            body.applyImpulse(planeVelocity);

            // Jump. Must release jump control inbetween jumps
            if (button1) {
                if (okToJump) {
                    var jumpforce = [0, 1, 0];
                    vec3.scale(jumpforce, jumpforce, JUMP_FORCE);
                    //Apply impulse to the body
                    body.applyImpulse(jumpforce);
                    okToJump = false;
                }
            } else {
                okToJump = true;
            }
        }

        if (softGrounded && vec3.length(moveDir) > 0.0)
            self.idle = false;
        else
            self.idle = true;

        // Reset grounded flag for next frame
        onGround = true;

    };

    function MoveCamera(timeStep) {   // free look, desktop only

        // Movement speed as world units per second
        var MOVE_SPEED = 15.0;
        // Mouse sensitivity as degrees per pixel
        var MOUSE_SENSITIVITY = 0.1;

        yaw = yaw + MOUSE_SENSITIVITY * mouseMoveX;
        pitch = pitch + MOUSE_SENSITIVITY * mouseMoveY;

        if (pitch < -90)
            pitch = -90;

        if (pitch > 90)
            pitch = 90;

        // Construct new orientation for the camera scene node from yaw and pitch. Roll is fixed to zero
        cameraNode.rotation = QuatFromEuler(pitch, yaw, 0.0);

        var speed = MOVE_SPEED * timeStep;

        if (Atomic.input.getKeyDown(Atomic.KEY_LSHIFT))
            speed *= 2.0;

        //translate camera on the amount of speed value
        if (moveForward)
            cameraNode.translate([0.0, 0.0, speed]);
        if (moveBackwards)
            cameraNode.translate([0.0, 0.0, -speed]);
        if (moveLeft)
            cameraNode.translate([-speed, 0.0, 0.0]);
        if (moveRight)
            cameraNode.translate([speed, 0.0, 0.0]);

    }

    function UpdateControls() {

        var input = Atomic.input;

        moveForward = false;
        moveBackwards = false;
        moveLeft = false;
        moveRight = false;
        mouseMoveX = 0.0;
        mouseMoveY = 0.0;
        button0 = false;
        button1 = false;

        //check input keys
        if (input.getKeyDown(Atomic.KEY_W) || input.getKeyDown(Atomic.KEY_UP))
            moveForward = true;
        if (input.getKeyDown(Atomic.KEY_S) || input.getKeyDown(Atomic.KEY_DOWN))
            moveBackwards = true;
        if (input.getKeyDown(Atomic.KEY_A) || input.getKeyDown(Atomic.KEY_LEFT))
            moveLeft = true;
        if (input.getKeyDown(Atomic.KEY_D) || input.getKeyDown(Atomic.KEY_RIGHT))
            moveRight = true;

        if (input.getKeyPress(Atomic.KEY_F))  // change cam view (desktop)
            button0 = true;

        // NO JUMPING! if you jump high enough, when you come down, you go straight thru the floor!
        //      if (input.getKeyPress(Atomic.KEY_SPACE))  // jump  (desktop)
        //          button1 = true;

        // NO SHOOTING this is a nonviolentish game
        //      if (input.getKeyPress(Atomic.KEY_Z)) // shoot attack dance whatever
        //          self.fire = true;
        //      else self.fire = false;

        // IF you have a UI HUD that covers the entire screen, then the touches are going to be relative
        // to a UIWidget, rather than a lack of one. Here is the hack to get around that.
        var empty1 = Atomic.ui.getWidgetAt( Atomic.graphics.width/2, Atomic.graphics.height/2, true );

        // if we are on mobile
        if (Atomic.platform == "Android" || Atomic.platform == "iOS") {

            //iterate through each TouchState, if it doesn't touch any widgets, use it as a `mouse`
            for (var i = 0; i < Atomic.input.getNumTouches(); i++) {
                var touchState = Atomic.input.getTouch(i);
                var delta = touchState.delta;
                if (touchState.touchedWidget === null) {
                    mouseMoveX = delta[0];
                    mouseMoveY = delta[1];
                } else if (touchState.touchedWidget == empty1) {  // for full HUD
                    mouseMoveX = delta[0];
                    mouseMoveY = delta[1];
                }
            }
        } else {   // if its a desktop
            // update mouse coordinates
            mouseMoveX = input.getMouseMoveX();
            mouseMoveY = input.getMouseMoveY();
        }

    }

    self.update = function (timestep) {

        UpdateControls();

        if (cameraMode != 2) { //if it's a free view
            yaw += mouseMoveX * YAW_SENSITIVITY;
            pitch += mouseMoveY * YAW_SENSITIVITY;
        }

        if (pitch < -8)  // was -45, and can see under the floor!
            pitch = -8;
        if (pitch > 45)
            pitch = 45;

        // fyi -- yaw does not need to be limited.

        if (button0) { // switch the cam mode
            cameraMode++;
            if (cameraMode == 3) // wrap around modes
                cameraMode = 0;
            if (cameraMode == 1) // animate only in 3rd person
                animModel.enabled = false;
            else
                animModel.enabled = true;
        }

    };

    //that function called right after update function
    self.postUpdate = function (timestep) {

        var rot = node.getRotation(); // Get camera lookat dir from character yaw + pitch

        var dir = quat.create(); //create quaternion
        quat.setAxisAngle(dir, [1, 0, 0], (-pitch * Math.PI / 180.0));
        quat.rotateY(dir, dir, 3.14);
        quat.multiply(dir, [rot[1], rot[2], rot[3], rot[0]], dir);

        // jm note, you MUST know what the head bone name is for your model
        var headNode = node.getChild("head", true);

        if (cameraMode == 1) { // if it's a FPS view
            var headPos = headNode.getWorldPosition();
            var offset = [0.0, 0.15, 0.2];
            vec3.add(headPos, headPos, vec3.transformQuat(offset, offset, [rot[1], rot[2], rot[3], rot[0]]));
            cameraNode.setPosition(headPos);
            cameraNode.setRotation([dir[3], dir[0], dir[1], dir[2]]);
            quat.setAxisAngle(dir, [0, 1, 0], (yaw * Math.PI / 180.0));
            quat.rotateY(dir, dir, 3.14);
            node.setRotation([dir[3], dir[0], dir[1], dir[2]]);
        } else if (cameraMode === 0) { // if it's a third person view, the prefered mode
            var aimPoint = node.getWorldPosition();
            var aimOffset = [0.4, 1.3, -0.1];
            vec3.transformQuat(aimOffset, aimOffset, dir);
            vec3.add(aimPoint, aimPoint, aimOffset);

            var rayDir = vec3.create();
            vec3.transformQuat(rayDir, [0, 0, -1], dir);
            vec3.scale(rayDir, rayDir, 8);
            vec3.add(aimPoint, aimPoint, rayDir);

            cameraNode.setPosition(aimPoint);
            cameraNode.setRotation([dir[3], dir[0], dir[1], dir[2]]);
            quat.setAxisAngle(dir, [0, 1, 0], (yaw * Math.PI / 180.0));
            node.setRotation([dir[3], dir[0], dir[1], dir[2]]);
        } else { // its free-look mode, i.e. out of model experience :)
            MoveCamera(timestep);
        }
    };
};

//
// QuatFromEuler utility function
//
function QuatFromEuler(x, y, z) {
    var M_PI = 3.14159265358979323846264338327950288;
    var q = [0, 0, 0, 0];
    x *= (M_PI / 360);
    y *= (M_PI / 360);
    z *= (M_PI / 360);
    var sinX = Math.sin(x);
    var cosX = Math.cos(x);
    var sinY = Math.sin(y);
    var cosY = Math.cos(y);
    var sinZ = Math.sin(z);
    var cosZ = Math.cos(z);
    q[0] = cosY * cosX * cosZ + sinY * sinX * sinZ;
    q[1] = cosY * sinX * cosZ + sinY * cosX * sinZ;
    q[2] = sinY * cosX * cosZ - cosY * sinX * sinZ;
    q[3] = cosY * cosX * sinZ - sinY * sinX * cosZ;
    return q;
}
