# Android Assets for Photoshop


A Photoshop script for exporting assets for Android projects.

The script works by duplicating the selected layer (or layergroup) to a new document, then scaling it to each of the 5 common Android sizes (XXXHDPI, XXHDPI, XHDPI, HDPI and MDPI) and then putting the files inside density related folders.

You can specify some parameters for the generated files:

* the name of the generated files.
* the width/heigth of the mdpi generated file (other sizes will be related to this base size).
* the generated file type (jpg or png).
* the root folder where to store all density related folders (if no path is specified, resources will be saved in the same folder as your original resource).

![alt settingsBox](https://raw.githubusercontent.com/djavan-bertrand/export-to-android/master/settingsBox.png)

This script is based on [this repo](https://github.com/UncorkedStudios/export-to-android).

## Installation
1. Download the script here

2. Move the .jsx file to your Photoshop scripts folder : 
* On Windows: C:\Program Files\Adobe\Adobe Photoshop CS6\Presets\Scripts (or C:\Program Files\Adobe\Adobe Photoshop CS6 (64 Bit)\Presets\Scripts if you're running a 64 bit version)
* On Mac: /Applications/Adobe Photoshop …/Presets/Scripts/

