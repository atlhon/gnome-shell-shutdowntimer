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
// Actions
const Action = {
    SHUTDOWN: 0,
    SUSPEND: 1
};

const Gettext = imports.gettext.domain('shutdowntimer-shell-extension');
const _ = Gettext.gettext;
const _shell = imports.gettext.domain('gnome-shell').gettext;
const ngettext = Gettext.ngettext;

const ActionItem = new Lang.Class({
    Name: 'ActionItem',
    Extends: PopupMenu.PopupBaseMenuItem,

    _init: function(label, iconName) {
        this.parent();

        this.actor.add_style_class_name('status-chooser-status-item');

        this._icon = new St.Icon({ style_class: 'popup-menu-icon' });
        this.addActor(this._icon);

        if (iconName)
            this._icon.icon_name = iconName;

        this.label = new St.Label({ text: label });
        this.actor.label_actor = this.label;
        this.addActor(this.label);
    }
});

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

    // Select box
    this._section = new PopupMenu.PopupMenuSection();
    this._combo = new PopupMenu.PopupComboBoxMenuItem({ style_class: 'status-chooser-combo' });
    
    this._section.addMenuItem(this._combo);
    this.menu.addMenuItem(this._section);

    let item;
    item = new ActionItem(_shell("Power Off"), 'system-shutdown-symbolic');
    this._combo.addMenuItem(item, Action.SHUTDOWN);

    item = new ActionItem(_shell("Suspend"), 'preferences-desktop-screensaver-symbolic');
    this._combo.addMenuItem(item, Action.SUSPEND);

    this._combo.setActiveItem(settings.getAction());

    this._combo.connect('active-item-changed',
        Lang.bind(this, function(menuItem, id){
            if (id == Action.SHUTDOWN) {
                settings.setAction(Action.SHUTDOWN);
            } else if (id == Action.SUSPEND) {
                settings.setAction(Action.SUSPEND);
            }
        })
    );    

    // Force option
    let forceShutdown = new PopupMenu.PopupSwitchMenuItem(_("Even if documents not saved:"), settings.getForced());
    forceShutdown.connect("toggled", Lang.bind(this, function(item){
        settings.setForced(!settings.getForced());
    }));
    this.menu.addMenuItem(forceShutdown);

    let hoursSet = Math.floor(settings.getDelay() / 60);
    let minutesSet = settings.getDelay();

    // Slider
    let delay_slider_label = new Widget.LabelWidget(_("Delay") + " " +
            ((minutesSet > 60)
                ? hoursSet + " " + ngettext("hour", "hours", hoursSet).format(hoursSet)
                : minutesSet + " " + ngettext("minute", "minutes", minutesSet).format(minutesSet))
        );
        this.menu.addMenuItem(delay_slider_label);
        let delay_slider = new Widget.DelaySlider(settings.getDelay() );
        this.menu.addMenuItem(delay_slider);

        
        // React on toggle-interaction:
        timer.setCallback(function(){
        if (toggle.state && forceShutdown.state) {
            shutdown_command.shutdownForced(settings.getAction());
        } else if (toggle.state) {
            shutdown_command.shutdown(settings.getAction());
        }
        });

        // React on delay-change:
        delay_slider.connect('value-changed', function(){
            settings.setDelay(delay_slider.getMinutes());
            let minutes = delay_slider.getMinutes();
            if (minutes > 60){
        let hours = Math.floor(minutes / 60);
                delay_slider_label.setText(_("Delay") + " " + hours + " " + ngettext("hour", "hours", hours).format(hours));
            } else {
                delay_slider_label.setText(_("Delay") + " " + minutes + " " + ngettext("minute", "minutes", minutes).format(minutes));
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
