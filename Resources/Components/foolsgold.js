// Written By JimMarlowe, 2017
// Using the Atomic Game Engine
// MIT licenesed

"atomic component";

// a pickup type object
// fools gold doesnt spin, it should laugh maniacally though.

exports.component = function(self) {

    var hideHowlong = 0.0;
    var shown = 1;  // DO NOT turn off the node, or else it does not update

    self.start = function() {
        shown = 1;
    };

    self.node.subscribeToEvent( self.node, "NodeCollision", function(event) {
        var pbody = self.node.getComponent("RigidBody");
        pbody.enabled = false;
        var pmodel = self.node.getComponent("StaticModel");
        pmodel.enabled = false;
        shown = 0; // hide the pickup
        hideHowlong = 20.0;  // reset the clock
        if ( event.otherNode.name == "Dwarf") {
            self.node.sendEvent("Pickup", { whoAmI: self.node.name, whoID: self.node.id } );
            self.node.unsubscribeFromAllEvents();
            self.node.remove(); // these ones go away after you get fooledgold
        }
    });

    self.update = function(delta) {
        hideHowlong -= delta;
        if ( hideHowlong < 0.0 && shown === 0 ) { // unhide the pickup
            var pbody = self.node.getComponent("RigidBody");
            pbody.enabled = true;
            var pmodel = self.node.getComponent("StaticModel");
            pmodel.enabled = true;
            shown = 1;  // show the pickup again
        }
    };

};
