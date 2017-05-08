// Service the main menu
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

//  init, pass in uiview to hange the ui off of, and which levels have been completed
exports.init = function(uiview, l1, l2, l3, l4 ) {

    var inputx = Atomic.input; // and the inout object
    var host = Atomic.engine; // host for sendEvents

    if ( !inputx.isMouseVisible() )
        inputx.setMouseVisible(true);

    window = new UIWindow();
    window.settings = Atomic.UI.WINDOW_SETTINGS_TITLEBAR;
    window.text = "Menu";
    window.load("Scenes/menu.ui.txt");
    window.resizeToFitContent();
    uiview.addChild(window);
    window.center();

    //  affix button disabling ( settings.level1 = 1 ) always on ...
    if ( l1 > 0.0 ) window.getWidget("play2").setOpacity(1.0);
    if ( l2 > 0.0 ) window.getWidget("play3").setOpacity(1.0);
    if ( l3 > 0.0 ) window.getWidget("play4").setOpacity(1.0);

    window.getWidget("play1").onClick = function () {
        closeWindow();
        if ( inputx.isMouseVisible() ) inputx.setMouseVisible(false);
        host.sendEvent("gotoPlay", { level: 1 } );
    };

    window.getWidget("play2").onClick = function () {
        if ( window.getWidget("play2").getOpacity() < 1.0 ) return;
        closeWindow();
        if ( inputx.isMouseVisible() ) inputx.setMouseVisible(false);
        host.sendEvent("gotoPlay", { level: 2 } );
    };

    window.getWidget("play3").onClick = function () {
        if ( window.getWidget("play3").getOpacity() < 1.0 ) return;
        closeWindow();
        if ( inputx.isMouseVisible() ) inputx.setMouseVisible(false);
        host.sendEvent("gotoPlay", { level: 3 } );
    };

    window.getWidget("play4").onClick = function () {
        if ( window.getWidget("play4").getOpacity() < 1.0 ) return;
        closeWindow();
        if ( inputx.isMouseVisible() ) inputx.setMouseVisible(false);
        host.sendEvent("gotoPlay", { level: 4 } );
    };

    window.getWidget("info").onClick = function () {
        closeWindow();
        host.sendEvent("gotoInfo", { } );
    };

    window.getWidget("exit").onClick = function () {
        host.sendEvent("DoExit", { } );
    };

};

exports.shutdown = function() {
    closeWindow();
};
