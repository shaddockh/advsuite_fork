// Written By JimMarlowe, 2017
//
// platform specific file writer 
// for saving configuration files
//
var storage = function( filename, data ) {

    var filesystem = Atomic.getFileSystem(); // Get the FileSystem subsystem
    var documentsDir = "";
    if (Atomic.platform == "Android" || Atomic.platform == "iOS")
        documentsDir = filesystem.getUserDocumentsDir(); // somewhere writable on android
    else documentsDir = filesystem.getAppPreferencesDir("Piranasoft", "advsuite"); // desktop systems

    documentsDir += filename; // add on our app dir, file for where our data will be

    var datafile = new Atomic.File(documentsDir, Atomic.FILE_WRITE);
    if (datafile.isOpen() ) {
        datafile.writeString( data );
        datafile.close();
    }

};

exports.storage = storage;
