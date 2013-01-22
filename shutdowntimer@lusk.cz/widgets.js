/**
  * This is where all the widgets for the menu life.
  */
const Lang = imports.lang;
const PopupMenu = imports.ui.popupMenu;
const St = imports.gi.St;
const Clutter = imports.gi.Clutter;
const Mainloop = imports.mainloop;
const Shell = imports.gi.Shell;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const Helper = Me.imports.helper;

// -------------------------------------------------------------------------------

/**
 * Widget for setting the delay for the shutdown.
 * @type {Lang.Class}
 */
const DelaySlider = new Lang.Class({
    Name: Helper.uniqueClassName('DelaySlider'),
    Extends: PopupMenu.PopupSliderMenuItem,

    _MINUTES_MAX: 59,
    _MINUTES_MIN: 2,
    _HOURS_MAX: 5,
    _HOURS_MIN: 1,

    /**
     * Construct a new Widget.
     * @private
     */
    _init: function(minutes){
        this.parent(0); // value MUST be specified!
        this.setMinutes(minutes); // Set the real value.
    },

    /**
     * Set the value of the slider to x minutes.
     * @param minutes the value in minutes between _MINUTES_MAX and _MINUTES_MIN
     */
    setMinutes: function(minutes){
        // Validate:
        if (isNaN(minutes) || minutes < this._MINUTES_MIN || minutes > this._HOURS_MAX*60){
            throw TypeError("'minutes' should be an integer between "
                +this._MINUTES_MIN+" and "+this._HOURS_MAX*60);
        }

        let value = 0;
        if (minutes <= this._MINUTES_MAX){
            value = (minutes - this._MINUTES_MIN) / (this._MINUTES_MAX - this._MINUTES_MIN) / 2;
        } else {
            value = (((minutes / 60) - this._HOURS_MIN) / (this._HOURS_MAX - this._HOURS_MIN) / 2) + 0.5;
        }
        this.setValue(value);
    },

    /**
     * Get the value in minutes from the slider.
     * @return int the value in minutes.
     */
    getMinutes: function(){
        let minutes = 0;
        if (this._value < 0.5){
            minutes = this._MINUTES_MIN + (this._value * 2) * (this._MINUTES_MAX - this._MINUTES_MIN);
        } else {
            minutes = (this._HOURS_MIN + (this._value - 0.5) * 2 * (this._HOURS_MAX - this._HOURS_MIN)) * 60;
        }
        return ((minutes < this._MINUTES_MIN) ? this._MINUTES_MIN : Math.floor(minutes));
    }
});

// -------------------------------------------------------------------------------

/**
 * A simple label which only displays the given text.
 * @type {Lang.Class}
 */
const LabelWidget = new Lang.Class({
    Name: Helper.uniqueClassName("LabelWidget"),
    Extends: PopupMenu.PopupBaseMenuItem,

    _init: function(text){
        this.parent({
            reactive: false // Can't be focused/clicked.
        });

        this._label = new St.Label({
            text: text
        });
        this.addActor(this._label);
    },

    /**
     * Set the text for this label.
     * @param text the new text.
     */
    setText: function(text){
        if (this._label.clutter_text){
            this._label.text = text.toString();
        }
    }
});
