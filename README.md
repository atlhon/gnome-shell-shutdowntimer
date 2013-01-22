gnome-shell-shutdowntimer
=========================

GNOME shell 3.6 extension placing an icon in status area with a simple slider for fast and easy setup of scheduled shutdown.

Heavily based on Lukas Knuth's Backslide code at https://bitbucket.org/LukasKnuth/backslide

Known issues
------------

There are no notifications sent reminding that the timer is running. If the *Even with unsaved documents* is enabled there is not even a shutdown dialog. But who cares, right? :)

**Solved**: The shutdown does not complete until confirmed in a dialog invoked if there is an application like Rhytmbox running (and playing).
