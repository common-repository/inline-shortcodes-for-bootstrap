/**************************************************************************************************/
/*
/*		File:
/*			tinymce.js
/*		Description:
/*			This file contains Javascript for the administrative aspects of ternstyle's (tm) Themes.
/*		Date:
/*			Added on January 29, 2015
/*		Copyright:
/*			Copyright (c) 2016 Ternstyle LLC.
/*
/**************************************************************************************************/

/****************************************Commence Script*******************************************/

(function ($) {
	$(document).ready(function () {

/*------------------------------------------------------------------------------------------------
	tinyMCE (Plugin)
------------------------------------------------------------------------------------------------*/
	
	$('#tern-theme-shortcode-add').bind('click',function (e) {
		e.preventDefault();
		tern_theme_shortcodes_open();
	});
	
	/*
	tinymce.PluginManager.add('terncodes',function (o) {
		o.addButton('terncodes',{
			//autofocus		:
			//border		:
			classes			: ' wp-tts widget btn ',
			//disabled		:
			//hidden		:
			icon 			: false,
			//image			:
			//margin		:
			//minHeight		:
			//minWidth		:
			//name			:
			//padding		:
			//role			:
			//size			:
			//style			:
			text			: '',
			tooltip			: 'Add Shortcode',
			onclick 		: function () {
				tern_theme_shortcodes_open();
			}
		});
	});
	*/
	tinymce_editors_save = function () {
		for(k in tinyMCE.editors) {
			tinyMCE.editors[k].save();
		}
	}
	
/*------------------------------------------------------------------------------------------------
	tinyMCE (Selection)
------------------------------------------------------------------------------------------------*/
   
   
   
/****************************************Terminate Script******************************************/

	});
})(jQuery);