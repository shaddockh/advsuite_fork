// Written By JimMarlowe, 2017
//
//  Screenshot JS component
//  ScreenshotXXX(argument)
//    Pick one of the file types for XXX : PNG, JPG, BMP
//    if no argument is given, it creates a pathname for you with the format screen-DD-MM-YYYY_HH_MM_SS.xxx
//    if an argument is given, it will attempt to save the screen shot to that pathname
//
// v1. NOTE -- DO NOT use colons in filenames on windows! It will not create the file.
// v2. made desc in GetUniqueFilename so it can be changed easier, if wanted.

var GetUniqueFilename = function (userExt) {
    var desc = "screen-";
    var d = new Date();  // get the date NOW
    var datestring = ("0" + d.getDate()).slice(-2) + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" + d.getFullYear()
                     + "_" + ("0" + d.getHours()).slice(-2) + "_" + ("0" + d.getMinutes()).slice(-2) + "_" + ("0" + d.getSeconds()).slice(-2);
    var filesystem = Atomic.getFileSystem();  // Get the FileSystem subsystem
    var documentsDir = filesystem.getUserDocumentsDir();  // Get documents folder
    var filename = documentsDir + desc + datestring + "." + userExt;  // make filename
    return (filename);  // return filename
};

var ScreenshotPNG = function(userpath) {
    var screenfile;
    if ( userpath === undefined) // use a unique file name
        screenfile = GetUniqueFilename ("png");
    else screenfile = userpath;  // or use user's pathname
    var myimage = new Atomic.Image(); //make an image
    if (Atomic.graphics.takeScreenShot(myimage)) //take the screenshot
        if( myimage.savePNG(screenfile) )   //  save the file
            return screenfile;    // return the filename
    return "";   // if weve failed return empty name
};

var ScreenshotJPG = function (userpath) {
    var quality = 92; // very good quality jpeg
    var screenfile;
    if ( userpath === undefined)
        screenfile = GetUniqueFilename ("jpg");
    else screenfile = userpath;
    var myimage = new Atomic.Image();
    if (Atomic.graphics.takeScreenShot(myimage))
        if( myimage.saveJPG(screenfile, quality))
            return screenfile;
    return "";
};

var ScreenshotBMP = function (userpath) {
    var screenfile;
    if ( userpath === undefined)
        screenfile = GetUniqueFilename ("bmp");
    else screenfile = userpath;
    var myimage = new Atomic.Image();
    if (Atomic.graphics.takeScreenShot(myimage))
        if( myimage.saveBMP(screenfile))
            return screenfile;
    return "";
};

module.exports.ScreenshotPNG = ScreenshotPNG;
module.exports.ScreenshotJPG = ScreenshotJPG;
module.exports.ScreenshotBMP = ScreenshotBMP;

