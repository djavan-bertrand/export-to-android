# Android Assets for Photoshop


A Photoshop script for exporting assets for Android projects.

The script works by duplicating the selected layer (or layergroup) to a new document, then scaling it to each of the 5 common Android sizes (XXXHDPI, XXHDPI, XHDPI, HDPI and MDPI) and then putting the files inside density related folders.

You can specify some parameters for the generated files:

* the name of the generated files.
* the width/heigth of the mdpi generated file (other sizes will be related to this base size).
* the generated file type (jpg or png).
* the root folder where to store all density related folders (if no path is specified, resources will be saved in the same folder as your original resource).

![alt settingsBox](https://raw.github.com//djavan-bertrand/export-to-android/master/settingsBox.png)

This script is based on [this repo](https://github.com/UncorkedStudios/export-to-android).

## Installation
1. Download the script here

2. Move the .jsx file to your Photoshop scripts folder. If you don't know where that is, you can easily find out by following the instructions <a href="http://www.outbackphoto.net/news/2013/2/17/free-script-where-is-my-photoshop-scripts-folder.html" target="_blank">on this quick post</a>. If your resource contains multiple layers, be sure to select them all.