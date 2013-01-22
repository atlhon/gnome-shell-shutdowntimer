const Lang = imports.lang;
const GLib = imports.gi.GLib;
const GnomeSession = imports.misc.gnomeSession;
const ConsoleKit = imports.misc.loginManager;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const Util = imports.misc.util;

/**
 * This is where the shutdown command is defined
 */
const Command = new Lang.Class({
    Name: "Command",

    /**
     * Constructs a new class for shutdown
     * @private
     */
    _init: function(){

    },

    /**
     * Start shutdown sequence
     */
    shutdown: function(){
	let session = new GnomeSession.SessionManager();
	session.ShutdownRemote();
	//Util.spawn(['notify-send', 'Shutdown', 'SessionManager']);
    },

    /**
     * Start shutdown sequence even if there are unsaved documents or media players playback
     */
    shutdownForced: function(){
	let console = new ConsoleKit.LoginManagerConsoleKit();
	console.powerOff();
	//Util.spawn(['notify-send', 'Shutdown', 'ConsoleKitManager']);
    }
});
