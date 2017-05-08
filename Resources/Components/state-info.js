// show configuration options and credits
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

exports.init = function(uiview, dbg, shd, mob ) {

    var inputx = Atomic.input;
    var host = Atomic.engine;

    if ( !inputx.isMouseVisible() )
        inputx.setMouseVisible(true);

    window = new UIWindow();
    window.settings = Atomic.UI_WINDOW_SETTINGS_TITLEBAR + Atomic.UI_WINDOW_SETTINGS_RESIZABLE;
    window.text = "Game Information";

    window.load("Scenes/info.ui.txt");
    window.resizeToFitContent();
    uiview.addChild(window);
    window.center();
    var file = Atomic.cache.getFile("Scenes/info.txt");
    var text = file.readText();
    window.getWidget("infotext").text = text;
    window.getWidget("debugScene").value = dbg;
    window.getWidget("shadowOverride").value = shd;
    if ( mob === 0 ) window.getWidget("autoSz").value = 1;
    else if ( mob == 1 ) window.getWidget("phoneSz").value = 1;
    else if ( mob == 2 ) window.getWidget("tabletSz").value = 1;
    else if ( mob == 3 ) window.getWidget("desktopSz").value = 1;

    window.getWidget("ok").onClick = function () {

        var c1 = window.getWidget("debugScene").value;
        var c2 = window.getWidget("shadowOverride").value;
        var c3 = 0;
        if ( window.getWidget("phoneSz").value > 0 ) c3 = 1;
        if ( window.getWidget("tabletSz").value > 0 ) c3 = 2;
        if ( window.getWidget("desktopSz").value  > 0 ) c3 = 3;

        host.sendEvent( "configDone", { debug: c1, shadows: c2, mobile: c3 } );

        closeWindow();

        host.sendEvent("gotoMenu", { } );
    };

};

exports.shutdown = function() {
    closeWindow();
};
