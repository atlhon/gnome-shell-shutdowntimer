// Import global libraries
const Main = imports.ui.main;
const Lang = imports.lang;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const St = imports.gi.St;
// Import own libs:
const Me = imports.misc.extensionUtils.getCurrentExtension();
const Widget = Me.imports.widgets;
const Shutdown = Me.imports.shutdown;
const Pref = Me.imports.settings;
const Time = Me.imports.timer;
const Helper = Me.imports.helper;
const Convenience = Me.imports.convenience;

const Gettext = imports.gettext.domain('shutdowntimer-shell-extension');
const _ = Gettext.gettext;

/**
 * The new entry in the gnome3 status-area.
 * @type {Lang.Class}
 */
const ShutdownTimerEntry = new Lang.Class({
    Name: Helper.uniqueClassName('ShutdownTimerEntry'),
    Extends: PanelMenu.Button,

    _init: function(){
        // Attach to status-area:
        this.parent(0.0, "shutdowntimer");
        // Add the Icon:
        this.actor.show();
        this._iconBox = new St.BoxLayout();
        this._iconIndicator = new St.Icon({
            icon_name: 'preferences-system-time-symbolic',
            style_class: 'system-status-icon'
        });
        this._iconBox.add(this._iconIndicator);
        this.actor.add_actor(this._iconBox);
        this.actor.add_style_class_name('panel-status-button');

        // Add the Widgets to the menu:
	let toggle = new PopupMenu.PopupSwitchMenuItem(_("Shutdown timer:"), false);
	toggle.connect("toggled", Lang.bind(this, function(item){
		if (item.state) {
			timer.begin();
		} else {
			timer.stop();
		}
        }));
        this.menu.addMenuItem(toggle);

        let forceShutdown = new PopupMenu.PopupSwitchMenuItem(_("Even with unsaved documents:"), false);
	forceShutdown.connect("toggled", Lang.bind(this, function(item){

        }));
        this.menu.addMenuItem(forceShutdown);

	let delay_slider_label = new Widget.LabelWidget(_("Delay") + " " +
            ((settings.getDelay() > 60)
                ? Math.floor(settings.getDelay() / 60) + " " + _("hours")
                : settings.getDelay() + " " + _("minutes"))
        );
        this.menu.addMenuItem(delay_slider_label);
        let delay_slider = new Widget.DelaySlider(settings.getDelay() );
        this.menu.addMenuItem(delay_slider);

        
        // React on toggle-interaction:
        timer.setCallback(function(){
		if (forceShutdown.state) {
			shutdown_command.shutdownForced();
		} else {
			shutdown_command.shutdown();
		}
        });

        // React on delay-change:
        delay_slider.connect('value-changed', function(){
            settings.setDelay(delay_slider.getMinutes());
            let minutes = delay_slider.getMinutes();
            if (minutes > 60){
                delay_slider_label.setText(_("Delay") + " " + Math.floor(minutes / 60) + " " + _("hours"));
            } else {
                delay_slider_label.setText(_("Delay") + " " + minutes + " " +_("minutes"));
            }
        });
    }
});

/**
 * Called when the extension is first loaded (only once)
 */
function init() {
	shutdown_command = new Shutdown.Command();
	settings = new Pref.Settings();
	timer = new Time.Timer();
	Convenience.initTranslations("shutdowntimer-shell-extension");
}

let shutdown_command;
let settings;
let timer;
let statusArea_entry;

/**
 * Called when the extension is activated (maybe multiple times)
 */
function enable() {
    statusArea_entry = new ShutdownTimerEntry();
    Main.panel.addToStatusArea('shutdowntimer', statusArea_entry, 1, 'right');
    timer.stop();
}

/**
 * Called when the extension is deactivated (maybe multiple times)
 */
function disable() {
    statusArea_entry.destroy();
    timer.stop();
}
