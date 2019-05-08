/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights
 *          reserved. For licensing, see LICENSE.md or
 *          http://ckeditor.com/license
 */
CKEDITOR.editorConfig = function( config ) {
	config.toolbarGroups = [
		{ name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
		{ name: 'editing', groups: [ 'find', 'selection', 'spellchecker', 'editing' ] },
		{ name: 'links', groups: [ 'links' ] },
		{ name: 'insert', groups: [ 'insert' ] },
		{ name: 'forms', groups: [ 'forms' ] },
		{ name: 'tools', groups: [ 'tools' ] },
		{ name: 'others', groups: [ 'others' ] },
		{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
		{ name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
		{ name: 'styles', groups: [ 'styles' ] },
		{ name: 'colors', groups: [ 'colors' ] }
	];
	config.language = 'zh-cn';
	config.height = '300px';
	
	config.removeButtons = 'Subscript,Superscript,Cut,Copy,Redo,Undo,Replace,SelectAll,Scayt,Anchor,Flash,PageBreak,Iframe,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,CreateDiv,Blockquote,BidiRtl,BidiLtr,Language';
	config.removeDialogTabs = 'image:advanced;image:Link;link:advanced';
	
	config.extraPlugins = 'video';
	
	config.filebrowserVideoUploadUrl = '../../fileUpLoadController?method=Uploadvideo';
	config.format_tags = 'p;h1;h2;h3;pre';
	config.image_previewText = ' '; 
	config.filebrowserImageUploadUrl = "../../fileUpLoadController?method=UploadFileInfoText1";
	config.uploadUrl = "../../fileUpLoadController?method=UploadFilePaste";
};
