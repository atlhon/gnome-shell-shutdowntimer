const Lang = imports.lang;
const GLib = imports.gi.GLib;
const GnomeSession = imports.misc.gnomeSession;
const ConsoleKit = imports.misc.loginManager;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const UPowerGlib = imports.gi.UPowerGlib;
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
        this._upClient = new UPowerGlib.Client();
    },

    /**
     * Start shutdown sequence
     */
    shutdown: function(action){
    	let session = new GnomeSession.SessionManager();
        if (action == 0) {
            Util.spawn(['notify-send', 'SHUTDOWN', 'SessionManager']);
            session.ShutdownRemote();
        } else {
            Util.spawn(['notify-send', 'SUSPEND', 'SessionManager']);
            this._upClient.suspend_sync(null);
        }
    },

    /**
     * Start shutdown sequence even if there are unsaved documents or media players playback
     */
    shutdownForced: function(action){
	let console = new ConsoleKit.LoginManagerConsoleKit();
        if (action == 0) {
            Util.spawn(['notify-send', 'SHUTDOWN', 'ConsoleKit']);
            console.powerOff();
        } else {
            Util.spawn(['notify-send', 'SUSPEND', 'ConsoleKit']);
            this._upClient.suspend_sync(null);
        }    
    }
});
