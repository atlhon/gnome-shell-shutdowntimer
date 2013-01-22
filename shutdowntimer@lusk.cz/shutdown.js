const Lang = imports.lang;
const GLib = imports.gi.GLib;
const GnomeSession = imports.misc.gnomeSession;
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
    run: function(){
	let session = new GnomeSession.SessionManager();
	session.ShutdownRemote();
    }
});
