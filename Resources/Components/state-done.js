// This script is the done state
// Written By JimMarlowe, 2017
// Using the Atomic Game Engine
// MIT licenesed

'use strict';

var UIWindow = Atomic.UIWindow;
var window;

function closeWindow() {
    if (window)
        window.die();
    window = null;
}

exports.init = function(uiview,wintime) {

    var inputx = Atomic.input;
    var host = Atomic.engine;

    if ( !inputx.isMouseVisible() )
        inputx.setMouseVisible(true);

    window = new UIWindow();
    window.settings = Atomic.UI.WINDOW_SETTINGS_TITLEBAR;
    window.text = "Game Over";
    window.load("Scenes/done.ui.txt");
    window.resizeToFitContent();
    uiview.addChild(window);
    window.center();

    var wintext = window.getWidget("donetext");
    wintext.text = "You Won! Your winning time is " + wintime + "\nNew Adventures await you!\nGood Luck.\n\n";

    window.getWidget("ok").onClick = function () {
        closeWindow();
        host.sendEvent("gotoMenu", { } ); // goto menu state
    };

};

exports.shutdown = function() {
    closeWindow();
};
