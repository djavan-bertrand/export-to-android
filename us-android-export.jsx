/*!
 * Android Assets for Photoshop
 * =============================
 *
 * Version: 0.0.5
 * Author: Gaston Figueroa (Uncorked Studios)
 * Site: uncorkedstudios.com
 * Licensed under the MIT license
 */


// Photoshop variables
var docRef,
	activeLayer,
	activeLayer2,
	mdpiWidth, 
	mdpiHeight,
	folderPath,
	fileName,
	isPng;

/****************************************/
/*		Functions implementation		*/
/****************************************/

	/**
	* Create a settings dialog window and return it
	* In this dialog window there will be inputs for :
	* file name, size, file type, folder path
	*/
	function createSettings() {
		var dialog = new Window ("dialog", "Settings");
		
		// filename
		var fileNameGroup = dialog.add ("group");
		fileNameGroup.orientation = "row";
		fileNameGroup.alignment = "center";
		var fileNameLabel = fileNameGroup.add("statictext", undefined, "File name");
		var fileNameInput = fileNameGroup.add("edittext", [15,30,305,50], fileName);
		
		// file size
		var fileSizeGroup = dialog.add("panel",undefined,'Size of the mdpi (px)');
		
		var fileSizeRelatedCheckbox = fileSizeGroup.add("checkbox", undefined, "Same width and height");
		
		var fileSizeWidthGroup = fileSizeGroup.add ("group");
		fileSizeWidthGroup.orientation = "row";
		fileSizeWidthGroup.alignment = "center";
		var fileSizeWidthLabel = fileSizeWidthGroup.add("statictext", undefined, "Width");
		var fileSizeWidthInput = fileSizeWidthGroup.add("edittext", [15,30,60,50], mdpiWidth);
		
		var fileSizeHeightGroup = fileSizeGroup.add ("group");
		fileSizeHeightGroup.orientation = "row";
		fileSizeHeightGroup.alignment = "center";
		var fileSizeHeightLabel = fileSizeHeightGroup.add("statictext", undefined, "Height");
		var fileSizeHeightInput = fileSizeHeightGroup.add("edittext", [15,30,60,50], mdpiHeight);
		
		// file type
		var fileTypeGroup = dialog.add("panel",undefined,'File type');
		fileTypeGroup.orientation="row";
		var pngType=fileTypeGroup.add("radiobutton", undefined, "png");
		pngType.value = isPng;
		var jpgType=fileTypeGroup.add("radiobutton", undefined, "jpg");
		jpgType.value = !isPng;
		
		// custom folder path
		var customFolderPathBt = dialog.add ("button", undefined, "Use custom folder path");
		
		// buttons
		var btnGroup = dialog.add ("group");
		btnGroup.orientation = "row";
		btnGroup.alignment = "center";
		var okButton = btnGroup.add ("button", undefined, "OK");
		var cancelButton = btnGroup.add ("button", undefined, "Cancel");
		
		
		// user interaction functions
		fileNameInput.onChange = function() {
			fileName = fileNameInput.text;
		}
		
		fileSizeRelatedCheckbox.onClick = function () {
			if (fileSizeRelatedCheckbox.value === true) {
				fileSizeHeightInput.text = fileSizeWidthInput.text;
				mdpiHeight = mdpiWidth;
			}
		}
		
		fileSizeHeightInput.onChanging = function() {
			if (isNaN(fileSizeHeightInput.text)) {
				fileSizeHeightInput.text = mdpiHeight;
			} else {
				mdpiHeight = fileSizeHeightInput.text;
				// if the size are the same, also change the width
				if (fileSizeRelatedCheckbox.value === true) {
					// don't set again the height value, which will set the width, which will set the height...
					fileSizeRelatedCheckbox.value = false;
					fileSizeWidthInput.text = mdpiHeight;
					mdpiWidth = mdpiHeight;
					fileSizeRelatedCheckbox.value = true;
				}
			}
		}
		
		fileSizeWidthInput.onChanging = function() {
			if (isNaN(fileSizeWidthInput.text)) {
				fileSizeWidthInput.text = mdpiWidth;
			} else {
				mdpiWidth = fileSizeWidthInput.text;
				// if the size are the same, also change the width
				if (fileSizeRelatedCheckbox.value === true) {
					// don't set again the width value, which will set the height, which will set the width...
					fileSizeRelatedCheckbox.value = false;
					fileSizeHeightInput.text = mdpiWidth;
					mdpiHeight = mdpiWidth;
					fileSizeRelatedCheckbox.value = true;
				}
			}
		}
		
		pngType.onClick = function() {
			isPng = pngType.value;
		}
		
		jpgType.onClick = function() {
			isPng = !jpgType.value;
		}
		
		customFolderPathBt.onClick = function () {
			var folderPathTmp = Folder.selectDialog("Select folder where you want to put the drawable-mdpi folder and others");
			if (folderPathTmp != null) {
				folderPath = folderPathTmp;
			}
		}
		
		okButton.onClick = function() {
			dialog.hide();
			saveAllResources();
		}
		
		dialog.center();
		return dialog;
	}

	/**
	* Save the current document into the resource folders
	*/
	function saveAllResources() {
		// save current ruler unit settings, so we can restore it
		var ru = app.preferences.rulerUnits;
		
		// set ruler units to pixel to ensure scaling works as expected
		app.preferences.rulerUnits = Units.PIXELS;
			
		if (getSelectedLayersCount() == 0) {
			selectAllLayers();
		}
		
		saveFile(folderPath+'/drawable-xxxhdpi', mdpiWidth * 4, mdpiHeight * 4);
		saveFile(folderPath+'/drawable-xxhdpi', mdpiWidth * 3, mdpiHeight * 3);
		saveFile(folderPath+'/drawable-xhdpi', mdpiWidth * 2, mdpiHeight * 2);
		saveFile(folderPath+'/drawable-hdpi', mdpiWidth * 1.5, mdpiHeight * 1.5);
		saveFile(folderPath+'/drawable-mdpi', mdpiWidth, mdpiHeight);
		
		// confirm to the user that operation went well and remind him the paths
		if (isPng) {
			extension = ".png";
		} else {
			extension = ".jpg";
		}
		alert("Your files have been save in " + folderPath + " with name " + fileName + extension);

		// restore old ruler unit settings
		app.preferences.rulerUnits = ru;	
	}

	/**
	* Save the doc into folderPath with the given width and heigth
	*/
	function saveFile(folderPath, width, height) {
		dupToNewFile();
		var docRef2 = app.activeDocument;
		resizeDoc(docRef2, width, height);

		fileName = fileName.replace(/\.[^\.]+$/, '');
		var folder = Folder(folderPath);
		var extension,
			sfwOptions;
		if (isPng) {
			extension = ".png";
			
			sfwOptions = new ExportOptionsSaveForWeb(); 
			sfwOptions.format = SaveDocumentType.PNG; 
			sfwOptions.includeProfile = false; 
			sfwOptions.interlaced = 0; 
			sfwOptions.optimized = true; 
			sfwOptions.quality = 100;
			sfwOptions.PNG8 = false;
		} else {
			extension = ".jpg";
			
			sfwOptions = new ExportOptionsSaveForWeb(); 
			sfwOptions.format = SaveDocumentType.JPEG; 
			sfwOptions.quality = 100; 
			sfwOptions.includeProfile = true; 
			sfwOptions.optimised = true; 
		}
			
		if(!folder.exists) {
			folder.create();
		}

		var saveFile = File(folder + "/" + fileName + extension);

		// Export the layer as a PNG
		activeDocument.exportDocument(saveFile, ExportType.SAVEFORWEB, sfwOptions);

		// Close the document without saving
		activeDocument.close(SaveOptions.DONOTSAVECHANGES);
	}

	/**
	* Test if the document is unsaved
	* http://2.adobe-photoshop-scripting.overzone.net/determine-if-file-has-never-been-saved-in-javascript-t264.html
	*/
	function isDocumentUnsaved(doc){
		// assumes doc is the activeDocument
		cTID = function(s) { return app.charIDToTypeID(s); }
		var ref = new ActionReference();
		ref.putEnumerated( cTID("Dcmn"),
		cTID("Ordn"),
		cTID("Trgt") ); //activeDoc
		var desc = executeActionGet(ref);
		var rc = true;
			if (desc.hasKey(cTID("FilR"))) { //FileReference
			var path = desc.getPath(cTID("FilR"));
			
			if (path) {
				rc = (path.absoluteURI.length == 0);
			}
		}
		return rc;
	};

	/**
	* Resize the given document with width and height
	*/
	function resizeDoc(document, width, height) {

		document.resizeImage(UnitValue(width,"px"),UnitValue(height,"px"),null,ResampleMethod.BICUBIC);

		// Merge all layers inside the temp document
		activeLayer2.merge();
	}

	/**
	* create a new document to work with
	*/
	function dupToNewFile() {	
		var fileName = activeLayer.name.replace(/\.[^\.]+$/, ''), 
			calcWidth  = Math.ceil(activeLayer.bounds[2] - activeLayer.bounds[0]),
			calcHeight = Math.ceil(activeLayer.bounds[3] - activeLayer.bounds[1]),
			docResolution = docRef.resolution,
			document = app.documents.add(calcWidth, calcHeight, docResolution, fileName, NewDocumentMode.RGB,
			DocumentFill.TRANSPARENT);

		app.activeDocument = docRef;

		// Duplicated selection to a temp document
		activeLayer.duplicate(document, ElementPlacement.INSIDE);

		// Set focus on temp document
		app.activeDocument = document;

		// Assign a variable to the layer we pasted inside the temp document
		activeLayer2 = document.activeLayer;

		// Center the layer
		activeLayer2.translate(-activeLayer2.bounds[0],-activeLayer2.bounds[1]);
	}
	
	/**
	* Return the number of selected layers
	* source : http://www.ps-scripts.com/bb/viewtopic.php?t=4724
	*/
	function getSelectedLayersCount(){
		var res = new Number();
		var ref = new ActionReference();
		ref.putEnumerated( charIDToTypeID("Dcmn"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt") );
		var desc = executeActionGet(ref);
		if( desc.hasKey( stringIDToTypeID( 'targetLayers' ) ) ){
			desc = desc.getList( stringIDToTypeID( 'targetLayers' ));
			res = desc.count 
		}else{
			var vis = app.activeDocument.activeLayer.visible;
			if(vis == true) app.activeDocument.activeLayer.visible = false;
			checkVisibility();
			if(app.activeDocument.activeLayer.visible == true){
				res =1;
			}else{
				res = 0;
			}
			app.activeDocument.activeLayer.visible = vis;
		}
		return res;
	}
	
	function checkVisibility(){
		var desc = new ActionDescriptor();
		var list = new ActionList();
		var ref = new ActionReference();
		ref.putEnumerated( charIDToTypeID('Lyr '), charIDToTypeID('Ordn'), charIDToTypeID('Trgt') );
		list.putReference( ref );
		desc.putList( charIDToTypeID('null'), list );
		executeAction( charIDToTypeID('Shw '), desc, DialogModes.NO );
	}

	/**
	* Select all layers of the document
	* source : Flatten All Layer Effects.jsx in the default scripts
	*/
	function selectAllLayers() {
		var idselectAllLayers = stringIDToTypeID( "selectAllLayers" );
		var desc252 = new ActionDescriptor();
		var idnull = charIDToTypeID( "null" );
		var ref174 = new ActionReference();
		var idLyr = charIDToTypeID( "Lyr " );
		var idOrdn = charIDToTypeID( "Ordn" );
		var idTrgt = charIDToTypeID( "Trgt" );
		ref174.putEnumerated( idLyr, idOrdn, idTrgt );
		desc252.putReference( idnull, ref174 );
		executeAction( idselectAllLayers, desc252, DialogModes.NO ); 
	} 
	
	/**
	* Entry function
	* Init vars and display the settings dialog
	*/
	function main() {
		// save current ruler unit settings, so we can restore it
		var ru = app.preferences.rulerUnits;
		
		// set ruler units to pixel to ensure scaling works as expected
		app.preferences.rulerUnits = Units.PIXELS;
		
		if (app != null && app.activeDocument != null)
		{
			// init vars
			docRef = app.activeDocument;
			activeLayer = docRef.activeLayer;
			mdpiWidth = docRef.width.value;
			mdpiHeight = docRef.width.value;
			folderPath = docRef.path;
			fileName = docRef.name.replace(/\.[^\.]+$/, '');
			isPng = true;
			
			// if the document is save, save the resource
			if(!isDocumentUnsaved()) {
				var settings = createSettings();
				settings.show();
			} else {
				alert ("Please save your document before using this script");
			}
		}
		
		// restore old ruler unit settings
		app.preferences.rulerUnits = ru;
	}

/****************************************/
/*			Functions call				*/
/****************************************/	

// Run main function
main();