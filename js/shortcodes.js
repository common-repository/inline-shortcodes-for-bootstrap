/**************************************************************************************************/
/*
/*		File:
/*			shortcodes.js
/*		Description:
/*			This file contains Javascript for the administrative aspects of ternstyle's (tm) Themes.
/*		Date:
/*			Added on February 5th, 2015
/*		Copyright:
/*			Copyright (c) 2016 Ternstyle LLC.
/*
/**************************************************************************************************/

/****************************************Commence Script*******************************************/

var tinymce_setting_content = false;
var shortcode_object = false;
var shortcode_object_column = false;
var shortcode_edit = false;
var shortcodes = ['accordion','row','alert','button','collapse','code','feature','image','rule','slider','spacer','tab','text','well'];

(function ($) {
	$(document).ready(function () {
		
/*------------------------------------------------------------------------------------------------
	Shortcode (Wrap)
------------------------------------------------------------------------------------------------*/

	tern_theme_shortcodes_remove = function (e) {
		
		//console.log('removing');
		
		var c = $('<div />').html(e.content);

		c.find('*')/*.removeClass('mceNonEditable')*/.removeClass('ui-droppable').removeClass('ui-sortable');
		c.find('.tern-theme-shortcode-control, .drag, .drag-hover, .column-header').remove();
		while(c.find('.tern-theme-shortcode').get(0)) {
			c.find('.tern-theme-shortcode').each(function () {
				
				$(this).find('p').each(function() {
					if($(this).html().replace(/\s|&nbsp;/g,'').length == 0) {
						$(this).remove();
					}
				});
				
				//var x = $('<div />').append($(this).find('[data-shortcode]').clone(true)).html();
				//$(this).replaceWith(x);
				
				var p = $(this).parent();
				var c = $(this).html();
				var x = $('<div />').html(c);
				var y = $(this).prev();
				$(this).remove();
				if(y.get(0)) {
					$(x.html()).insertAfter(y);
				}
				else {
					p.prepend(x.html());
				}
			});
		}
		
		c.find('.btn').each(function () {
			var p = $(this).parent();
			if(p.get(0).nodeName.toLowerCase() !== 'p') {
				return;
			}
			
			p.replaceWith(p.html());
			/*
			var x = $('<div />').html(p.html());
			if(p.prev().get(0)) {
				$(x.html()).insertAfter(p.prev());
				p.remove();
			}
			else {
				p.parent().prepend(x.html());
				p.remove();
			}
			*/
		});
		
		e.content = c.html();
	}

/*------------------------------------------------------------------------------------------------
	Shortcode (Display)
------------------------------------------------------------------------------------------------*/
	
	var thickbox_remove = null;
	tern_theme_shortcodes_open = function () {
		shortcode_edit = false;
		$('.tern-theme-model-form').removeClass('editing');
		tinymce_setting_content = true;
		tinymce_selection_save();
		thickbox_open();
		form_reset();
	};
	function shortcodes_close() {
		tinymce_setting_content = shortcode_object = false;
		form_reset();
		thickbox_close();
	}
	function thickbox_hijack() {
		thickbox_remove = window.tb_remove;
		tb_remove = function() {
			shortcodes_close();
		};
	}
	function thickbox_open() {
		tb_show('','#TB_inline?inlineId=tern-theme-form-shortcodes&width=753&height=800');
		$('#TB_window').css('overflow','scroll');
	}
	function thickbox_close() {
		thickbox_remove();
	}
	thickbox_hijack();

/*------------------------------------------------------------------------------------------------
	Shortcode (Form)
------------------------------------------------------------------------------------------------*/

	var form = $('#tern-theme-form-shortcodes');
	var form_parent = $('#tern-theme-shortcodes');
	var form_buttons = form_parent.find('a');
	var form_buttons_back = $('.tern-theme-model-form .back');
	var form_selected = null;
	var form_image_selector = null;
	
	function form_buttons_bind() {
		form_buttons.bind('click',function (e) {
			e.preventDefault();
			form_select($(this).attr('data-target'));
			form_goto();
		});
		form_buttons_back.bind('click',function (e) {
			e.preventDefault();
			
			if(shortcode_edit) {
				var r = confirm('You are about to overwrite a shortcode Would you like to proceed?');
				if(r) {
					form_reset();
				}
			}
			else {
				form_reset();
			}
			
		});
		
		$('.tern-theme-shortcode-form .button-add').bind('click',function (e) {
			e.preventDefault();
			eval($(this).parents('.tern-theme-shortcode-form').attr('data-type')+'_add();');
			shortcodes_close();
		});
		$('.tern-theme-shortcode-form .button-update').bind('click',function (e) {
			e.preventDefault();
			eval($(this).parents('.tern-theme-shortcode-form').attr('data-type')+'_update();');
			shortcodes_close();
		});
		
	}
	function form_select(t) {
		form_selected = $('#tern-theme-shortcodes-'+t);
	}
	function form_deselect() {
		form_selected = null;
	}
	function form_goto(t) {
		if(t) {
			form_is_update();
			form_select(t);
		}
		form_parent_close();
		form_tinymce_add();
		form_selected_open();
	}
	function form_is_update() {
		$('.tern-theme-shortcode-form').addClass('update');
	}
	function form_isnt_update() {
		$('.tern-theme-shortcode-form').removeClass('update');
	}
	function form_parent_open() {
		form_parent.animate({ height:form_parent.find('> div').outerHeight(),opacity:1 },{ duration:300 });
	}
	function form_parent_close() {
		form_parent.animate({ height:0,opacity:0 },{ duration:300 });
	}
	function form_selected_open() {
		form_selected.animate({ height:form_selected.find('> div').outerHeight()+50,opacity:1 },{ duration:300 });
	}
	function form_selected_close() {
		if(form_selected) {
			form_selected.animate({ height:0,opacity:0 },{ duration:300 });
		}
	}
	function form_reset() {
		form_isnt_update();
		form_selected_close();
		form_deselect();
		form_parent_open();
	}
	function form_tinymce_add() {
		var i = 0;
		form_selected.find('.editors textarea').each(function () {
			var x = form_selected.attr('id')+'-text-'+i;
			$(this).attr('id',x).addClass('mceEditor');
			window.tinyMCE.execCommand('mceRemoveEditor',false,x);
			window.tinyMCE.execCommand('mceAddEditor',false,x);
			i++;
		});
	}
	form_buttons_bind();
	
/*------------------------------------------------------------------------------------------------
	tinyMCE (Initalize)
------------------------------------------------------------------------------------------------*/
	
	tern_theme_shortcodes_init = function () {
		tinymce_get();
		tinymce_body_get();
		if(tinymce_body) {
			tinymce_body_bind();
			//tinymce_edit_disallow();
		}
		
	};
	tern_theme_shortcodes_set = function() {
		tinymce_get();
		tinymce_body_get();
		if(tinymce_body) {
			tinymce_shortcodes_fix();
			tinymce_bind();
		}
	};
	function tinymce_get() {
		$tinymce = tinyMCE.get('content');
	}
	function tinymce_body_get() {
		tinymce_body = null;
		if($tinymce) {
			tinymce_body = $($tinymce.getBody());
		}
	}
	function tinymce_body_bind() {
		tinymce_body.unbind('mouseup.slection').bind('mouseup.slection',function (e) {
			if(tinymce_selection_fix_mouseup()) {
				e.preventDefault();
				return false;
			}
		});
		/*
		tinymce_body.unbind('keydown.selection').bind('keydown.selection',function (e) {
			if(tinymce_selection_fix_keydown(e.keyCode)) {
				e.preventDefault();
				return false;
			}
		});
		*/
		tinymce_body.unbind('keyup.selection').bind('keyup.selection',function (e) {
			if(tinymce_selection_fix_keyup(e.keyCode)) {
				e.preventDefault();
				return false;
			}
		});
	}
	tern_theme_shortcodes_keydown = function (e) {
		if(tinymce_selection_fix_keydown(e.keyCode)) {
			e.preventDefault();
			return false;
		}
	}
	function tinymce_edit_allow() {
		tinymce_body.find('.tern-theme-shortcode').removeClass('mceNonEditable').removeAttr('data-mce-contenteditable').find('*').removeClass('mceNonEditable').removeAttr('data-mce-contenteditable');
	}
	function tinymce_edit_disallow() {
		tinymce_body.find('.tern-theme-shortcode').addClass('mceNonEditable').attr('data-mce-contenteditable',false).find('*').addClass('mceNonEditable').attr('data-mce-contenteditable',false);
	}
	function tinymce_bind() {
		tinymce_shortcode_bind();
		tinymce_button_bind();
		tinymce_button_edit_bind();
		tinymce_button_delete_bind();
		tinymce_button_copy_bind();
		tinymce_button_below_bind();
		tinymce_button_above_bind();
		tinymce_button_disable_bind();
		tinymce_button_drag_bind();
		tinymce_button_row_bind();
		//tinymce_body.tooltip();
	}

/*------------------------------------------------------------------------------------------------
	tinyMCE (Buttons)
------------------------------------------------------------------------------------------------*/
	
	function tinymce_shortcode_bind() {
		tinymce_body.find('.tern-theme-shortcode *').unbind().bind('mousedown mouseup click select',function (e) {
			//tinymce_body.find('*').blur();
			$('.mce-toolbar-grp').remove();
		}).bind('contextmenu select',function (e) {
			e.preventDefault();
			tinymce_body.find('*').blur();
			$('.mce-toolbar-grp').remove();
			return false;
		});
	}
	function tinymce_button_bind() {
		tinymce_body.find('.btn').unbind().bind('mousedown mouseup click contextmenu',function (e) {
			e.preventDefault();
			tinymce_body.find('*').blur();
			return false;
		});
		
		tinymce_body.find('.drag').bind('click contextmenu',function (e) {
			e.preventDefault();
			return false;
		});
	}
	function tinymce_button_edit_bind() {
		tinymce_body.find('.edit').unbind('mousedown.edit').bind('mousedown.edit',function(e) {
			e.preventDefault();
			return false;
		});
		tinymce_body.find('.edit').unbind('click.edit').bind('click.edit',function(e) {
			e.preventDefault();
			shortcode_object = '#'+$(this).parents('.tern-theme-shortcode').attr('id');
			tern_theme_shortcodes_open();
			shortcode_edit = true;
			$('.tern-theme-model-form').addClass('editing');
			form_goto($(this).parents('.tern-theme-shortcode').attr('data-type'));
			eval($(this).parents('.tern-theme-shortcode').attr('data-type')+'_edit();');
			return false;
		});
	}
	function tinymce_button_delete_bind() {
		tinymce_body.find('.delete').unbind('mousedown.delete').bind('mousedown.delete',function(e) {
			e.preventDefault();
			return false;
		});
		tinymce_body.find('.delete').unbind('click.delete').bind('click.delete',function(e) {
			e.preventDefault();
			var r = confirm('Are you sure you want to delete this element?!');
			if(r) {
				$(this).parents('.tern-theme-shortcode:first').remove();
			}
		});
	}
	function tinymce_button_copy_bind() {
		tinymce_body.find('.copy').unbind('mousedown.delete').bind('mousedown.delete',function(e) {
			e.preventDefault();
			return false;
		});
		tinymce_body.find('.copy').unbind('click.copy').bind('click.copy',function(e) {
			e.preventDefault();
			var x = $(this).parents('.tern-theme-shortcode:first');
			var id = x.attr('id');
			var o = x.clone();
			var t = $(o).attr('data-type');
			var i = t+'-'+parseInt(Math.random()*1000);
			$(o).insertAfter(x);
			
			var a = ['id','data-id','href','data-mce-href','data-parent','aria-controls'];
			$(o).attr('id',i).find('[data-shortcode]').attr('data-id',i).find('div,a').each(function () {
				for(k in a) {
					if($(this).attr(a[k]) && $(this).attr(a[k]).length > 0) {
						$(this).attr(a[k],$(this).attr(a[k]).replace(id,i));
					}
				}
			});
			
			tinymce_bind();
		});
	}
	function tinymce_button_below_bind() {
		tinymce_body.find('.below').unbind('mousedown.delete').bind('mousedown.delete',function(e) {
			e.preventDefault();
			return false;
		});
		tinymce_body.find('.below').unbind('click.below').bind('click.below',function(e) {
			var o = $(this).parents('.tern-theme-shortcode');
			var x = o.next().get(0);
			if(x && x.nodeName.toLowerCase() == 'p') {
				$tinymce.selection.setCursorLocation(x);
			}
			else {
				var x = $('<p>&nbsp;</p>').insertAfter(o).get(0);
				$tinymce.selection.setCursorLocation(x);
			}
			
		});
	}
	function tinymce_button_above_bind() {
		tinymce_body.find('.above').unbind('mousedown.delete').bind('mousedown.delete',function(e) {
			e.preventDefault();
			return false;
		});
		tinymce_body.find('.above').unbind('click.above').bind('click.above',function(e) {
			var o = $(this).parents('.tern-theme-shortcode');
			var x = o.prev().get(0);
			if(x && x.nodeName.toLowerCase() == 'p') {
				$tinymce.selection.setCursorLocation(x);
			}
			else {
				var x = $('<p>&nbsp;</p>').insertBefore(o).get(0);
				$tinymce.selection.setCursorLocation(x);
			}
			tinymce_body.focus();
		});
	}
	function tinymce_button_disable_bind() {
		tinymce_body.find('.disable').unbind('mousedown.delete').bind('mousedown.delete',function(e) {
			e.preventDefault();
			return false;
		});
		tinymce_body.find('.disable').unbind('click.disable').bind('click.disable',function(e) {
			var o = $(this).parents('.tern-theme-shortcode:first');
			if(o.hasClass('disabled')) {
				o.removeClass('disabled').find('[data-shortcode]:first').removeClass('disabled');
			}
			else {
				o.addClass('disabled').find('[data-shortcode]:first').addClass('disabled');
			}
		});
	}
	function tinymce_button_row_bind() {
		tinymce_body.find('.btn-add').bind('mouseup',function (e) {
			shortcode_object_column = $(this).parents('.column').find('.column-content');
			tern_theme_shortcodes_open();
		});
	}
	
	var tinymce_sort_body = null;
	var tinymce_sort_column = null;
	//var tinymce_drag_column = null;
	var tinymce_sort_drop = null;
	var tinymce_sort_object = null;
	
	function tinymce_button_drag_bind() {
		
		//tinymce_sort_column_destroy();
		tinymce_sort_destroy();
		
		tinymce_sort_body = null;
		tinymce_sort_column = null;
		//tinymce_drag_column = null;
		tinymce_sort_drop = null;
		tinymce_sort_object = null;
		
		//tinymce_sort_column_create();
		tinymce_sort_create();
		
		tinymce_sort_fix_p();
		
	}
	function tinymce_sort_create() {
		
		var i = '';
		tinymce_body.find('.row > div').each(function () {
			i += i.length > 0 ? ',#'+$(this).attr('id')+' .column-content' : '#'+$(this).attr('id')+' .column-content';
		});
		
		tinymce_sort_body = tinymce_body.sortable({
			handle : tinymce_body.find('> .tern-theme-shortcode > .tern-theme-shortcode-control > .drag'),
			items : '> .tern-theme-shortcode',
			connectWith : tinymce_body.find(i),
			//helper : 'clone',
			tolerance : 'pointer',
			toleranceElement : '.tern-theme-shortcode-control',
			//cursor : 'move',
			placeholder : 'tinymce-placeholder',
			//forceHelperSize : true,
			//forcePlaceholderSize : true,
			start : function (e,u) {
				tinymce_sort_object = u.item;
				//tinymce_body.find('.tinymce-placeholder').animate({ height:$(tinymce_sort_object).outerHeight() });
			},
			stop : function () {

				if(tinymce_sort_drop && !tinymce_sort_drop.find('.tern-theme-shortcode').get(0)) {
					tinymce_sort_object.remove();
					tinymce_sort_drop.prepend(tinymce_sort_object);
					//tinymce_button_drag_bind();
				}
				tinymce_body.find('.row > div').removeClass('active-drag');

			},
			sort : function (e) {
				tinymce_mouse_is_over_column(e);
			}
		});
		
		tinymce_sort_column = tinymce_body.find(i).sortable({
			handle : '.drag',//tinymce_body.find(i).find('.tern-theme-shortcode > .tern-theme-shortcode-control > .drag'),
			items : '.tern-theme-shortcode',
			connectWith : tinymce_body.add(tinymce_body.find(i)),
			//helper : 'clone',
			tolerance : 'pointer',
			toleranceElement : '.tern-theme-shortcode-control',
			placeholder : 'tinymce-placeholder',
			start : function (e,u) {
				tinymce_sort_object = u.item;
			},
			stop : function () {
				if(tinymce_sort_drop && !tinymce_sort_drop.find('.tern-theme-shortcode').get(0)) {
					tinymce_sort_object.remove();
					tinymce_sort_drop.prepend(tinymce_sort_object);
				}
				tinymce_body.find('.row > div').removeClass('active-drag');
				tinymce_button_drag_bind();
			},
			sort : function (e) {
				tinymce_mouse_is_over_column(e);
			}
		});
		
	}
	function tinymce_sort_destroy() {
		if(tinymce_sort_body) {
			tinymce_sort_body.sortable('destroy');
		}
		if(tinymce_sort_column) {
			tinymce_sort_column.sortable('destroy');
		}
	}
	/*
	function tinymce_sort_column_create() {
		tinymce_sort_column = tinymce_body.find('.column-content').sortable({
			handle : '.drag',
			start : function (e,u) {
				tinymce_sort_object = u.item;
			},
			beforeStop : function () {
				//console.log('dropping2'+":"+tinymce_sort_drop);
				if(tinymce_sort_drop) {
					tinymce_sort_object.remove();
					tinymce_sort_drop.prepend(tinymce_sort_object);
					tinymce_button_drag_bind();
				}
				tinymce_body.find('.row > div').removeClass('active-drag');
			},
			sort : function (e) {
				tinymce_mouse_is_over_column(e);
			}
		});
	}
	function tinymce_sort_column_destroy() {
		if(tinymce_sort_column) {
			tinymce_sort_column.sortable('destroy');
		}
	}
	function tinymce_drag_column_destroy() {
		if(tinymce_drag_column) {
			tinymce_drag_column.droppable('destroy');
		}
	}
	*/
	function tinymce_mouse_is_over_column(e) {
		var x = e.pageX;
		var y = e.pageY;
		var r = tinymce_body.find('.row > div');
		tinymce_sort_drop = null;
		r.each(function () {
			var o = $(this);
			if(x > o.offset().left && x < (o.offset().left+o.innerWidth()) && y > o.offset().top && y < (o.offset().top+o.innerHeight())) {
				tinymce_sort_drop = o.find('.column-content');
				if(!o.find('.tern-theme-shortcode').get(0)) {
					o.addClass('active-drag');
				}
			}
			else {
				o.removeClass('active-drag');
			}
		});
	}
	function tinymce_sort_fix_p() {
		tinymce_body.find('.row .column-content').contents().each(function () {
			//console.log($(this).get(0).nodeType);
			if(($(this).get(0).nodeType == 3 && $(this).text() == String.fromCharCode(160)) || $(this).get(0).nodeName.toLowerCase() == 'p') {
				$(this).remove();
			}
		});
	}
	
/*------------------------------------------------------------------------------------------------
	tinyMCE (Selection)
------------------------------------------------------------------------------------------------*/
	
	var tinymce_selection_stop = false;
	
	function tinymce_selection_save() {
		tinymce_selection = $tinymce.selection.getRng();
	}
	function tinymce_selection_fix_mouseup() {
		tinymce_selection_node_set();
		return tinymce_selection_fix();
	}
	function tinymce_selection_fix_keydown(k) {
		tinymce_selection_node_set();

		var r = $tinymce.selection.getRng();

		//using backspace to delete from the front
		if(k && k == 46 && $(tinymce_node).next().hasClass('tern-theme-shortcode') && r.endOffset >= $(tinymce_node).text().length) {
			if($(tinymce_node).text().trim().length > 0) {
				$tinymce.selection.setCursorLocation(tinymce_node);
			}
			else {
				tinymce_selection_cursor_in_next_node_set();
				$(tinymce_node).remove();
			}
			return true;
		}
		
		//using delete to delete from behind
		tinymce_selection_parent_set();
		if(k && k == 8 && $(tinymce_node_parent).prev().hasClass('tern-theme-shortcode') && r.startOffset < 1 && (r.collapsed)) {
			//tinymce_selection_stop = true;
			if($(tinymce_node).text().trim().length > 0) {
				$tinymce.selection.setCursorLocation(tinymce_node);
			}
			else {
				tinymce_selection_cursor_in_next_node_set();
				$(tinymce_node).remove();
			}
			/*
			if($(tinymce_node).text().trim().length > 0) {
				$tinymce.selection.setCursorLocation(tinymce_node);
			}
			else {
				tinymce_selection_cursor_in_prev_node_set();
				$(tinymce_node).remove();
			}
			*/
			return true;
		}
		
	}
	function tinymce_selection_fix_keyup(k) {
		
		if(tinymce_selection_stop) {
			tinymce_selection_stop = false;
			return true;
		}
		
		tinymce_selection_node_set();
		//using delete to delete from behind
		//if(k && k == 8 && $(tinymce_node).prev().hasClass('tern-theme-shortcode') && $tinymce.selection.getRng().startOffset <= 1) {
		//	tinymce_selection_last_p();
		//	return true;
		//}
		return tinymce_selection_fix();
	}
	function tinymce_selection_fix() {
		if(tinymce_selection_shortcode_selected()) {
			tinymce_selection_parent_set();
			
			//if(tinymce_node_parent.nodeName.toLowerCase() == '#document') {
				tinymce_selection_last_p_select();
			/*
			}
			else if(tinymce_node_parent) {
				var x = $(tinymce_node_parent).next().get(0);
				if(x && x.nodeName.toLowerCase() == 'p') {
					$tinymce.selection.setCursorLocation(x);
				}
				else {
					var x = $('<p>&nbsp;</p>').insertAfter(tinymce_node_parent).get(0);
					$tinymce.selection.setCursorLocation(x);
				}
			}
			else {
				tinymce_selection_last_p_select();
			}
			*/
			return true;
		}
		return false;
	}
	function tinymce_selection_cursor_in_next_node_set() {
		var n = tinymce_node;
		while($(n).next().get(0) && $(n).next().hasClass('tern-theme-shortcode')) {
			n = $(n).next().get(0);
		}
		if(n == tinymce_node) {
			tinymce_selection_last_p_select();
		}
		else {
			$tinymce.selection.setCursorLocation(n);
		}
	}
	function tinymce_selection_cursor_in_prev_node_set() {
		tinymce_selection_parent_set();
		var n = tinymce_node_parent;
		while($(n).prev().get(0) && $(n).prev().hasClass('tern-theme-shortcode')) {
			n = $(n).prev().get(0) ? $(n).prev().get(0) : n;
		}
		if($(n).prev().get(0)) {
			$tinymce.selection.setCursorLocation($(n).prev().get(0));
		}
		else {
			tinymce_selection_first_p_select();
		}
	}
	function tinymce_selection_node_set() {
		tinymce_node = $tinymce.selection.getNode();
		tinymce_node_start = $tinymce.selection.getStart();
		tinymce_node_end = $tinymce.selection.getEnd();
		tinymce_node_content = $tinymce.selection.getContent();
	}
	function tinymce_selection_shortcode_selected() {
		if($([tinymce_node,tinymce_node_start,tinymce_node_end]).hasClass('tern-theme-shortcode') || $([tinymce_node,tinymce_node_start,tinymce_node_end]).parents('.tern-theme-shortcode').get(0) || tinymce_node_content.indexOf('tern-theme-shortcode') !== -1) {
			return true;
		}
		return false;
	}
	function tinymce_selection_parent_set() {
		tinymce_node_parent = null;
		if($(tinymce_node).hasClass('tern-theme-shortcode')) {
			//console.log('parent: is shortcode');
			tinymce_node_parent = $(tinymce_node).get(0);
		}
		else if($(tinymce_node_start).parents('.tern-theme-shortcode').get(0)) {
			//console.log('parent: start parent is shortcode');
			tinymce_node_parent = $(tinymce_node_start).parents('.tern-theme-shortcode').get(-1);
		}
		else if($(tinymce_node_start).hasClass('tern-theme-shortcode')) {
			//console.log('parent: start is shortcode');
			tinymce_node_parent = $(tinymce_node_start).get(0);
		}
		else if($(tinymce_node_end).parents('.tern-theme-shortcode').get(0)) {
			//console.log('parent: end parent is shortcode');
			tinymce_node_parent = $(tinymce_node_end).parents('.tern-theme-shortcode').get(-1);
		}
		else if($(tinymce_node_end).hasClass('tern-theme-shortcode')) {
			//console.log('parent: end is shortcode');
			tinymce_node_parent = $(tinymce_node_end).get(0);
		}
		else if($(tinymce_node).parents('.tern-theme-shortcode').get(0)) {
			//console.log('parent: parent is shortcode');
			tinymce_node_parent = $(tinymce_node).parents('.tern-theme-shortcode').get(-1);
		}
		else {
			//console.log('parent: is body');
			tinymce_node_parent = tinymce_node;
			var x = 0;
			while(x != $(tinymce_body).get(0) && $(tinymce_node_parent).parent().get(0)) {
				x = $(tinymce_node_parent).parent().get(0);
				if(x != $(tinymce_body).get(0)) {
					tinymce_node_parent = x;
				}
			}
		}
	}
	function tinymce_selection_collapse() {
		$tinymce.selection.collapse();
	}
	function tinymce_selection_node_select() {
		$tinymce.selection.select(tinymce_node);
		$tinymce.selection.collapse(true);
	}
	function tinymce_selection_last_p() {
		tinymce_body.unbind('keyup.delete').bind('keyup.delete',function () {
			tinymce_selection_last_p_select();
			tinymce_body.unbind('keyup.delete');
		});
	}
	function tinymce_selection_first_p_select() {
		var p = tinymce_body.find('*>:first').get(0);
		if(p.nodeName.toLowerCase() == 'p') {
			$tinymce.selection.setCursorLocation(p);
		}
		else {
			var x = $('<p>&nbsp;</p>').get(0);
			tinymce_body.prepend(x);
			$tinymce.selection.setCursorLocation(x);
		}
	}
	function tinymce_selection_last_p_select() {
		
		var p = tinymce_body.find('>p:last').get(0);
		////console.log(p+":"+$(p).text().length+":"+!$(p).parents('.tern-theme-shortcode').get(0));
		if(p && $(p).text().length > 0 && !$(p).parents('.tern-theme-shortcode').get(0)) {
			$tinymce.selection.setCursorLocation(p);
		}
		else {
			tinymce_selection_create_and_move_last_p();
		}
		
		//hack job
		if(!tinymce_node_parent) {
		tinymce_selection_parent_set();
		if(tinymce_node_parent) {
			tinymce_selection_create_and_move_last_p();
		}
		}
		
		
		/*
		var p = tinymce_body.find('*>:last').get(0);
		if(p.nodeName.toLowerCase() == 'br') {
			$(p).remove();
		}
		p = tinymce_body.find('*>:last').get(0);
		if(p.nodeName.toLowerCase() == 'p') {
			$tinymce.selection.setCursorLocation(p);
		}
		else {
			var x = $('<p>&nbsp;</p>').get(0);
			tinymce_body.append(x);
			$tinymce.selection.setCursorLocation(x);
		}
		*/
	}
	function tinymce_selection_create_and_move_last_p() {
		var x = $('<p>&nbsp;</p>').get(0);
		tinymce_body.append(x);
		$tinymce.selection.setCursorLocation(x);
	}
	
/*------------------------------------------------------------------------------------------------
	tinyMCE (Content)
------------------------------------------------------------------------------------------------*/
	
	function tinymce_shortcodes_fix() {
		if(tinymce_body.find('.tern-theme-shortcode').get(0)) {
			return;
		}
		
		for(k in shortcodes) {
			tinymce_body.find('*[data-shortcode='+shortcodes[k]+']').each(function () {
				
				if(shortcodes[k] == 'row') {
					var x = 0;
					$(this).find('.column').each(function () {
						
						var t = _.template($('#shortcodes-'+shortcodes[k]+'-label').html());
						var s = t({
							item : {
								id : x
							}
						});
						$(this).prepend(s);
						
						var t = _.template($('#shortcodes-'+shortcodes[k]+'-button').html());
						var s = t({
							item : {
								id : $(this).attr('id')
							}
						});
						$(this).append(s);
						x++;
					});
				}
				
				var t = _.template($('#shortcodes-'+shortcodes[k]+'-container').html());
				var s = t({
					item : {
						id : $(this).attr('data-id'),
						shortcode : $('<div />').append($(this).clone(true)).html()
					}
				});
				s = $(s);
				
				if($(this).prev().get(0)) {
					var o = $(s).insertAfter($(this).prev());
				}
				else {
					var o = $(this).parent().prepend(s).find('#'+$(this).attr('data-id'));
				}
				eval(shortcodes[k]+'_desc.apply(o);');
				
				if($(this).hasClass('disabled')) {
					if(o.hasClass('tern-theme-shortcode')) {
						o.addClass('disabled');
					}
					else {
						o.parents('.tern-theme-shortcode:first').addClass('disabled');
					}
				}
				
				$(this).remove();
				
			});
		}
		tinymce_shortcodes_inside_p();
		//tinymce_shortcodes_bind();
	}
	function tinymce_shortcodes_inside_p() {
		tinymce_body.find('.tern-theme-shortcode').each(function () {
			if($(this).parent().get(0).nodeName.toLowerCase() == 'p') {
				var p = $(this).parent();
				//console.log('inside <p>');
				$($(this).clone(true)).insertBefore(p);
				p.remove();
				$(this).remove();
			}
		});
	}
	function tinymce_content_update(c) {
		$tinymce.setContent(c);
		tinymce_bind();
	}
	function tinymce_selection_update(c) {
		if(shortcode_edit) {
			//var r = confirm('You are about to overwrite a shortcode Would you like to proceed?');
			//if(r) {
				return tinymce_content_update(tinymce_shortcode_replace(c));
				
			//}
		}
		else {
			if(shortcode_object_column) {
				shortcode_object_column.prepend(c);
				shortcode_object_column = false;
			}
			else {
				$tinymce.selection.setRng(tinymce_selection);
				$tinymce.selection.setContent(c);
			}
		}
		
		tinymce_shortcodes_inside_p();
		tinymce_bind();
	}
	function tinymce_shortcode_replace(s) {
		var c = tinyMCE.get('content').getContent();
		var p = $('<div />').html(c);
		var y = p.find(shortcode_object);
		if(y.prev().get(0)) {
			var o = y.prev();
			y.remove();
			$(s).insertAfter(o);
		}
		else {
			y.parent().prepend(s);
			y.remove();
		}
		tinymce_bind();
		return p.html();
	}
	/*
	function tinymce_shortcodes_bind() {
		tinymce_body.find('.tern-theme-shortcode a').bind('mousedown click',function (e) {
			if(e.button == 2) {
				e.preventDefault();
				return false;
			}
		});
	}
	*/
	
/*------------------------------------------------------------------------------------------------
	Accordion
------------------------------------------------------------------------------------------------*/
	
	function accordion_desc() {
		this.find('.desc').text('This accordion has '+this.find('.panel').length+' tabs.');
	}
	function accordion_add() {
		tinymce_selection_update(accordion_compile());
	}
	function accordion_edit() {
		accordion_num_set();
		accordion_tabs_add();
		accordion_values_set();
	}
	function accordion_update() {
		tinymce_content_update(tinymce_shortcode_replace(accordion_compile(false)));
	}
	function accordion_compile(b) {
		var t = _.template($('#shortcodes-accordion').html());
		var s = t({
			item : {
				id : 'accordion-'+parseInt(Math.random()*1000),
				tabs : accordian_compile_tabs()
			}
		});
		return s;
	}
	function accordian_compile_tabs() {
		var tabs = [];
		var x = 0;
		tinymce_editors_save();
		$('#tern-theme-shortcodes-accordion .tabs li').each(function () {
			tabs[tabs.length] = {
				id : x,
				title : $(this).find('input[name=title]').val(),
				content : $(this).find('textarea[name=content]').val()
			};
			x++;
		});
		return tabs;
	}
	
	function accordion_num_set() {
		$('#tern-theme-shortcodes-accordion input[name=number]').val(tinymce_body.find(shortcode_object).find('.panel').length);
	}
	function accordion_tabs_add(v) {
		var v = v ? v : tinymce_body.find(shortcode_object).find('.panel').length;
		var l = $('#tern-theme-shortcodes-accordion .tabs li').length;
		if(v == l || v < 1) {
			return;
		}
		else if(v < l) {
			$('#tern-theme-shortcodes-accordion .tabs li:gt('+(v-1)+')').remove();
		}
		else {
			for(var i=0;i<(v-l);i++) {
				$('#tern-theme-shortcodes-accordion .tabs').append('<li>'+$('#tern-theme-shortcodes-accordion-tab-form').html()+'</li>');
			}
		}
		form_tinymce_add()
		form_selected_open();
	}
	function accordion_values_set() {
		var o = tinymce_body.find(shortcode_object);
		$('#tern-theme-shortcodes-accordion .tabs li').each(function () {
			$(this).find('input[name=title]').val(o.find('.panel:eq('+$(this).index()+') h4').text());
			tinyMCE.get($(this).find('textarea').attr('id')).setContent(o.find('.panel:eq('+$(this).index()+') .panel-body').html());
		});
	}
	$('#tern-theme-shortcodes-accordion .number-update').bind('click',function () {
		var v = $('#tern-theme-shortcodes-accordion input[name=number]').val();
		if(!/^[0-9]+$/.test(v) && v.length > 0) {
			alert('Please choose a numeric value only.');
			return;
		}
		accordion_tabs_add(parseInt(v));
	});
	
/*------------------------------------------------------------------------------------------------
	Rows / Columns
------------------------------------------------------------------------------------------------*/
	
	function row_desc() {
		this.find('.desc').text('This row has '+this.find('.column').length+' columns.');
	}
	function row_add() {
		tinymce_selection_update(row_compile());
	}
	function row_edit() {
		row_num_set();
		row_columns_set();
	}
	function row_update() {
		var o = tinymce_body.find(shortcode_object);
		var x = 0;
		$('#tern-theme-shortcodes-row .row li').each(function () {
			var self = this;
			if(o.find('.column:eq('+x+')').get(0)) {
				o.find('.column:eq('+x+')').attr('class','column col-xs-'+$(this).attr('data-span-xs')+' col-sm-'+$(this).attr('data-span-sm')+' col-md-'+$(this).attr('data-span-md')+' col-lg-'+$(this).attr('data-span-lg')).attr('data-span',$(this).attr('data-span')).attr('data-lg',$(this).attr('data-span-lg')).attr('data-md',$(this).attr('data-span-md')).attr('data-sm',$(this).attr('data-span-sm')).attr('data-xs',$(this).attr('data-span-xs'));
			}
			else {
				o.find('.row').append(row_column_compile(shortcode_object,x,$(this).attr('data-span')));
			}
			x++;
		});
	}
	function row_compile(b) {
		var t = _.template($('#shortcodes-row').html());
		var s = t({
			item : {
				id : 'row-'+parseInt(Math.random()*1000),
				columns : row_compile_columns()
			}
		});
		return s;
	}
	function row_compile_columns() {
		var columns = [];
		var x = 0;
		$('#tern-theme-shortcodes-row .row li').each(function () {
			columns[columns.length] = {
				id : x,
				span : $(this).attr('data-span'),
				'span-lg' : $(this).attr('data-span-lg') ? $(this).attr('data-span-lg') : $(this).attr('data-span'),
				'span-md' : $(this).attr('data-span-md') ? $(this).attr('data-span-md') : $(this).attr('data-span'),
				'span-sm' : $(this).attr('data-span-sm') ? $(this).attr('data-span-sm') : $(this).attr('data-span'),
				'span-xs' : $(this).attr('data-span-xs') ? $(this).attr('data-span-xs') : $(this).attr('data-span')
			};
			x++;
		});
		return columns;
	}
	function row_num_set() {
		$('#tern-theme-shortcodes-row input[name=number]').val(tinymce_body.find(shortcode_object).find('.column').length);
	}
	function row_columns_set() {
		var c = tinymce_body.find(shortcode_object).find('.column');
		var a = [];
		c.each(function () {
			a[a.length] = {
				span : $(this).attr('data-span'),
				'span-lg' : $(this).attr('data-lg'),
				'span-md' : $(this).attr('data-md'),
				'span-sm' : $(this).attr('data-sm'),
				'span-xs' : $(this).attr('data-xs')
			}
		});
		row_columns(c.length,a);
	}
	function row_columns(v,a) {
		var l = $('#tern-theme-shortcodes-row .row li').length;
		if(v !== l && v > 0) {
			if(v < l) {
				$('#tern-theme-shortcodes-row .row li:gt('+(v-1)+')').remove();
			}
			else {
				for(var i=0;i<(v-l);i++) {
					$('#tern-theme-shortcodes-row .row').append($('#tern-theme-shortcodes-row .row li:first').clone(true));
				}
			}
			
			var l = $('#tern-theme-shortcodes-row .row li').length;
			var x = Math.floor(12/l);
			$('#tern-theme-shortcodes-row .row li').attr('class','span'+x).attr('data-span',x);
			$('#tern-theme-shortcodes-row .row li:last').attr('class','span'+(x+(12-(l*x)))).attr('data-span',(x+(12-(l*x))));
		}

		if(typeof(a) != 'undefined' && a.length > 0) {
			for(var i=0;i<$('#tern-theme-shortcodes-row .row li').length;i++) {
				//console.log(a[i]);
				$('#tern-theme-shortcodes-row .row li:eq('+i+')').attr('class','span'+a[i].span).attr('data-span',a[i].span).attr('data-span-lg',a[i]['span-lg']).attr('data-span-md',a[i]['span-md']).attr('data-span-sm',a[i]['span-sm']).attr('data-span-xs',a[i]['span-xs']);
			}
		}
	}
	function row_set() {
		if($('#tern-theme-shortcodes-row .row li').length == 12) {
			$('#tern-theme-shortcodes-row .row li').addClass('noplus');
		}
		else {
			var o = $('#tern-theme-shortcodes-row .row li').get().sort(function (a,b) {
				return ((parseInt($(a).attr('data-span')) < parseInt($(b).attr('data-span'))) ? -1 : ((parseInt($(a).attr('data-span')) > parseInt($(b).attr('data-span'))) ? 1 : 0));
			});
			var x = 0;
			var b = false;
			$(o).each(function () {
				var i = parseInt($(this).attr('data-span'));
				if(i > 1 && x == 12 && !b) {
					$(this).addClass('noplus');
				}
				else {
					$(this).removeClass('noplus');
				}
				if(i > 1) {
					b = true;
				}
			});
		}
	}
   
   $('#tern-theme-shortcodes-row input[name=number]').bind('keyup',function () {
		if(!/^[0-9]+$/.test($(this).val()) && $(this).val().length > 0) {
			alert('Please choose a numeric value only.');
			return;
		}
		row_columns(parseInt($(this).val()));
		row_set();
	});
	
	$('#tern-theme-shortcodes-row .row a.button-plus,#tern-theme-shortcodes-row .row a.button-minus').bind('click',function (e) {
		e.preventDefault();
		var w = parseInt($(this).attr('data-way'));
		var p = $('#tern-theme-shortcodes-row .row');
		var q = p.find('li');
		var o = $(this).parents('li');
		var x = parseInt(o.attr('data-span'));
		var i = o.index();
		var n = p.find('li:eq('+(i+1)+')');
		var y = parseInt(n.attr('data-span'));
		if(!n.get(0) && i > 0) {
			var n = p.find('li:eq('+(i-1)+')');
			var y = parseInt(n.attr('data-span'));
		}
		var j = n.index();
		if(w) {
			if(i < j) {
				var z = 1;
				while(y == 1 && (i+z) < q.length) {
					n = p.find('li:eq('+(i+z)+')');
					y = parseInt(n.attr('data-span'));
					z++;
				}
			}
			if(j > i || y == 1) {
				var z = 1;
				while(y == 1 && (i-z) >= 0) {
					n = p.find('li:eq('+(i-z)+')');
					y = parseInt(n.attr('data-span'));
					z++;
				}
			}
			if(n.get(0) && y > 1) {
				o.attr('class','span'+(x+1)).attr('data-span',(x+1));
				n.attr('class','span'+(y-1)).attr('data-span',(y-1));
			}
		}
		else {
			if(n.get(0) && x > 1) {
				o.attr('class','span'+(x-1)).attr('data-span',(x-1));
				n.attr('class','span'+(y+1)).attr('data-span',(y+1));
			}
		}
		row_set();
	});
	$('#tern-theme-shortcodes-row .row a.button-config').bind('click',function () {
		
		var self = $(this).parents('li:first');
		
		$('#tern-theme-shortcodes-row .row li').removeClass('active');
		$(self).addClass('active');
		
		$('#tern-theme-shortcodes-row .column-config select').each(function () {
			//console.log($(this).attr('name')+":"+parseInt($(self).attr('data-'+$(this).attr('name'))));
			$(this).val(parseInt($(self).attr('data-'+$(this).attr('name'))));
		}).unbind().bind('change',function () {
			$(self).attr('data-'+$(this).attr('name'),$(this).val());
		});
		
		$('#tern-theme-shortcodes-row .column-config').animate({ height:$('#tern-theme-shortcodes-row .column-config > div').outerHeight() },{ complete : function () {
			form_selected_open();
		}});
	});
	$('#tern-theme-shortcodes-row .button-span-done').bind('click',function () {
		$('#tern-theme-shortcodes-row .column-config').animate({ height:0 },{ complete : function () {
			form_selected_open();
		}});
	});
	
/*------------------------------------------------------------------------------------------------
	Alerts
------------------------------------------------------------------------------------------------*/
	
	function alert_desc() {
		this.find('.desc').text('This is type "'+this.find('.alert').attr('role')+'" starting with "'+this.find('.alert').text().substr(0,15)+'..."');
	}
	function alert_add() {
		tinymce_selection_update(alert_compile());
	}
	function alert_edit() {
		var t = tinymce_body.find(shortcode_object).find('.alert').attr('role');
		var c = tinymce_body.find(shortcode_object).find('.alert').text();
		$('#tern-theme-shortcodes-alert select[name=type]').val(t);
		$('#tern-theme-shortcodes-alert input[name=message]').val(c);
		$('#tern-theme-shortcodes-alert .alert').attr('class','alert alert-'+t);
		$('#tern-theme-shortcodes-alert .alert').text(c);
	}
	function alert_update() {
		tinymce_content_update(tinymce_shortcode_replace(alert_compile()));
	}
	function alert_compile() {
		var t = _.template($('#shortcodes-alert').html());
		var s = t({
			item : {
				id : 'alert-'+parseInt(Math.random()*1000),
				type : $('#tern-theme-shortcodes-alert select[name=type]').val(),
				message : $('#tern-theme-shortcodes-alert input[name=message]').val()
			}
		});
		return s;
	}
	$('#tern-theme-shortcodes-alert select[name=type]').bind('change',function () {
		$('#tern-theme-shortcodes-alert .alert').attr('class','alert alert-'+$(this).val());
	});
	$('#tern-theme-shortcodes-alert input[name=message]').bind('keyup',function () {
		$('#tern-theme-shortcodes-alert .alert').text($(this).val());
	});
	
/*------------------------------------------------------------------------------------------------
	Buttons
------------------------------------------------------------------------------------------------*/
	
	function button_desc() {
		this.find('.desc').text('This is type "'+this.find('.btn-shortcode').attr('role')+'". Text is "'+this.find('.btn-shortcode').text()+'"');
	}
	function button_add() {
		tinymce_selection_update(button_compile());
	}
	function button_update() {
		tinymce_content_update(tinymce_shortcode_replace(button_compile()));
	}
	function button_edit() {
		var o = tinymce_body.find(shortcode_object).find('.btn-shortcode');
		$('#tern-theme-shortcodes-button select[name=type]').val(o.attr('role'));
		$('#tern-theme-shortcodes-button input[name=text]').val(o.text());
		if(typeof(o.attr('data-page')) != 'undefined' && o.attr('data-page').length > 0) {
			$('#tern-theme-shortcodes-button select[name=page]').val(o.attr('data-page'));
			$('#tern-theme-shortcodes-button input[name=url]').val('');
		}
		else {
			$('#tern-theme-shortcodes-button input[name=url]').val(o.attr('href'));
			$('#tern-theme-shortcodes-button select[name=page]').val('');
		}
		if(o.attr('target') == '_blank') {
			$('#tern-theme-shortcodes-button input[name=target]').attr('checked','checked');
		}
		button_set();
	}
	function button_compile() {
		var t = _.template($('#shortcodes-button').html());
		var s = t({
			item : {
				id : 'button-'+parseInt(Math.random()*1000),
				type : $('#tern-theme-shortcodes-button select[name=type]').val(),
				text : $('#tern-theme-shortcodes-button input[name=text]').val(),
				url : $('#tern-theme-shortcodes-button select[name=page]').val().length > 0 ? shortcodes_pages[$('#tern-theme-shortcodes-button select[name=page]').val()] : $('#tern-theme-shortcodes-button input[name=url]').val(),
				page : $('#tern-theme-shortcodes-button select[name=page]').val(),
				target : $('#tern-theme-shortcodes-button input[name=target]').prop('checked') == true ? '_blank' : '_top'
			}
		});
		return s;
	}
	function button_set() {
		$('#tern-theme-shortcodes-button .btn').attr('class','btn btn-'+$('#tern-theme-shortcodes-button select[name=type]').val());
		$('#tern-theme-shortcodes-button .btn').text($('#tern-theme-shortcodes-button input[name=text]').val());
	}
	$('#tern-theme-shortcodes-button select[name=type]').bind('change',button_set);
	$('#tern-theme-shortcodes-button input[name=text]').bind('keyup',button_set);
	$('#tern-theme-shortcodes-button select[name=page]').bind('change',function () {
		if($(this).val().length > 0) {
			$('#tern-theme-shortcodes-button input[name=url]').val('');
		}
	});
	$('#tern-theme-shortcodes-button input[name=url]').bind('keyup',function () {
		if($(this).val().length > 0) {
			$('#tern-theme-shortcodes-button select[name=page]').val('');
		}
	});
	
/*------------------------------------------------------------------------------------------------
	Collapse
------------------------------------------------------------------------------------------------*/
	
	function collapse_desc() {
		this.find('.desc').text('Button style: '+this.find('.btn-shortcode').attr('data-type')+', Button text: "'+this.find('.btn-shortcode').text()+'"');
	}
	function collapse_add() {
		tinymce_selection_update(collapse_compile());
	}
	function collapse_edit() {
		collapse_values_set();
	}
	function collapse_update() {
		tinymce_content_update(tinymce_shortcode_replace(collapse_compile(false)));
	}
	function collapse_compile() {
		tinymce_editors_save();
		var t = _.template($('#shortcodes-collapse').html());
		var s = t({
			item : {
				id : 'collapse-'+parseInt(Math.random()*1000),
				type : $('#tern-theme-shortcodes-collapse select[name=type]').val(),
				text : $('#tern-theme-shortcodes-collapse input[name=text]').val(),
				content : $('#tern-theme-shortcodes-collapse textarea[name=content]').val()
			}
		});
		return s;
	}
	function collapse_values_set() {
		var o = tinymce_body.find(shortcode_object);
		$('#tern-theme-shortcodes-collapse select[name=type]').val(o.find('.btn-shortcode').attr('data-type'));
		$('#tern-theme-shortcodes-collapse input[name=text]').val(o.find('.btn-shortcode').text());
		tinyMCE.get($('#tern-theme-shortcodes-collapse textarea').attr('id')).setContent(o.find('.well').html());
	}
	
/*------------------------------------------------------------------------------------------------
	Code
------------------------------------------------------------------------------------------------*/
	
	function code_desc() {
		this.find('.desc').text('Code starts with: "'+this.find('.code').text().substr(0,20)+'"');
	}
	function code_add() {
		tinymce_selection_update(code_compile());
	}
	function code_edit() {
		$('#tern-theme-shortcodes-code textarea[name=code]').val(from_htmlentities(tinymce_body.find(shortcode_object).find('.code').text()));
	}
	function code_update() {
		tinymce_content_update(tinymce_shortcode_replace(code_compile()));
	}
	function code_compile() {
		var t = _.template($('#shortcodes-code').html());
		var s = t({
			item : {
				id : 'code-'+parseInt(Math.random()*1000),
				code : htmlentities($('#tern-theme-shortcodes-code textarea[name=code]').val())
			}
		});
		return s;
	}
	
/*------------------------------------------------------------------------------------------------
	Features
------------------------------------------------------------------------------------------------*/

	function feature_desc() {
		this.find('.desc').text('Number of features: '+this.find('.column').length+', Number of columns: '+(12/parseInt(this.find('.row').attr('data-span'))));
	}
	function feature_add() {
		tinymce_selection_update(feature_compile());
	}
	function feature_edit() {
		feature_num_set();
		feature_items();
		$('#tern-theme-shortcodes-feature .row li').each(function () {
			var i = $(this).index();
			$(this).find('select').val(tinymce_body.find(shortcode_object).find('.column:eq('+i+')').attr('data-id'));
		});
	}
	function feature_update() {
		tinymce_content_update(tinymce_shortcode_replace(feature_compile()));
	}
	function feature_compile(b) {
		var t = _.template($('#shortcodes-feature').html());
		var s = t({
			item : {
				id : 'feature-'+parseInt(Math.random()*1000),
				columns : feature_compile_columns(),
				span : 12/parseInt($('#tern-theme-shortcodes-feature select[name=number_columns]').val())
			}
		});
		return s;
	}
	function feature_compile_columns() {
		var columns = [];
		var x = 0;
		$('#tern-theme-shortcodes-feature .row li').each(function () {
			columns[columns.length] = {
				id : x,
				feature : $(this).find('select').val()
			};
			x++;
		});
		return columns;
	}
	function feature_num_set() {
		$('#tern-theme-shortcodes-feature input[name=number]').val(tinymce_body.find(shortcode_object).find('.column').length);
		$('#tern-theme-shortcodes-feature select[name=number_columns]').val(12/parseInt(tinymce_body.find(shortcode_object).find('.row').attr('data-span')));
	}
	function feature_items(n) {
		var n = n ? n : parseInt($('#tern-theme-shortcodes-feature input[name=number]').val());
		
		var l = $('#tern-theme-shortcodes-feature .row li').length;
		var t = l > n ? l-n : n-l;
		if(l > n) {
			for(var i=l;i>=n;i--) {
				$('#tern-theme-shortcodes-feature .row li:eq('+i+')').remove();
			}
		}
		else {
			for(var i=0;i<t;i++) {
				$('#tern-theme-shortcodes-feature .row').append($('#tern-theme-shortcodes-feature .row li:eq(0)').clone());
			}
		}
		feature_columns();
	}
	function feature_columns(n) {
		
		var n = n ? n : parseInt($('#tern-theme-shortcodes-feature select[name=number_columns]').val());
		
		//var z = $('#tern-theme-shortcodes-feature .row li').length/10;
		//if($('#tern-theme-shortcodes-feature .row li').length > 10) {
			//var x = Math.floor(100/($('#tern-theme-shortcodes-feature .row li').length/n));
			var x = Math.floor(100/n);
			$('#tern-theme-shortcodes-feature .row li').css('width',x+'%');
		//}
		//else {
		//	var x = Math.floor(100/$('#tern-theme-shortcodes-feature .row li').length);
		//	$('#tern-theme-shortcodes-feature .row li').css('width',x+'%');
		//}
		form_selected_open();
	}
	function feature_set() {
		
	}
	$('#tern-theme-shortcodes-feature .number-update').bind('click',function () {
		var v = $('#tern-theme-shortcodes-feature input[name=number]');
		if(!/^[0-9]+$/.test(v.val()) && v.val().length > 0) {
			alert('Please choose a numeric value only.');
			return;
		}
		feature_items(parseInt(v.val()));
	});
	$('#tern-theme-shortcodes-feature select[name=number_columns]').bind('change',function () {
		if(!/^[0-9]+$/.test($(this).val()) && $(this).val().length > 0) {
			alert('Please choose a numeric value only.');
			return;
		}
		feature_columns();
	});
	
/*------------------------------------------------------------------------------------------------
	Image
------------------------------------------------------------------------------------------------*/
	
	function image_desc() {
		this.find('.desc').text('Image title: '+this.find('img').attr('alt'));
	}
	function image_add() {
		tinymce_selection_update(image_compile());
	}
	function image_edit() {
		
		var t = tinymce_body.find(shortcode_object).attr('data-thumb');
		$('#tern-theme-shortcodes-image .image').html('<img src="'+t+'" />');
		$('#tern-theme-shortcodes-image input[name=image]').val(tinymce_body.find(shortcode_object).find('*[data-shortcode=image]').html());
		
		/*
		var t = tinymce_body.find(shortcode_object).find('hr').attr('data-type');
		$('#tern-theme-shortcodes-rule .rule').removeClass('active');
		$('#tern-theme-shortcodes-rule .rule').each(function () {
			if($(this).find('hr').attr('data-type') == t) {
				$(this).addClass('active');
				return false;
			}
		});
		*/
	}
	function image_update() {
		tinymce_content_update(tinymce_shortcode_replace(image_compile()));
	}
	function image_compile() {
		var t = _.template($('#shortcodes-image').html());
		var s = t({
			item : {
				id : 'image-'+parseInt(Math.random()*1000),
				image : $('#tern-theme-shortcodes-image input[name=image]').val(),
				thumb : $('#tern-theme-shortcodes-image .image').attr('src')
			}
		});
		return s;
	}
	function image_set() {
		var state = form_image_selector.state('insert');
		var attachment = state.get('selection').first();
			
		if(!attachment) {
			return;
		}
		
		var display = state.display(attachment).toJSON();
		var obj_attachment = attachment.toJSON();
		var caption = obj_attachment.caption;
		if(!wp.media.view.settings.captions) {
			delete obj_attachment.caption;
		}
		display = wp.media.string.props(display,obj_attachment);
		delete(display.width);
		delete(display.height);
		var thumb = wp.media.string.props(display,obj_attachment);
		delete(thumb.width);
		delete(thumb.height);
		display.url = display.src;
		thumb.url = attachment.attributes.sizes.thumbnail.url;
		var o = {
			id : obj_attachment.id,
			post_content : obj_attachment.description,
			post_excerpt : caption
		};
		if(display.linkUrl) {
			o.url = display.linkUrl;
		}
		if('image' === obj_attachment.type) {
			var html = wp.media.string.image(display);
			var thumb = wp.media.string.image(thumb);
			_.each({
				align : 'align',
				size :  'image-size',
				alt :   'image_alt'
			},function(option,prop) {
				if(display[prop]) {
					o[option] = display[prop];
				}
			});
		}
		else if('video' === obj_attachment.type) {
			var html = wp.media.string.video(display,obj_attachment);
		}
		else if ( 'audio' === obj_attachment.type ) {
			var html = wp.media.string.audio(display,obj_attachment);
		}
		else {
			var html = wp.media.string.link(display);
			o.post_title = display.title;
		}
		attachment.attributes['nonce'] = wp.media.view.settings.nonce.sendToEditor;
		attachment.attributes['attachment'] = o;
		attachment.attributes['html'] = html;
		attachment.attributes['thumb'] = thumb;
		attachment.attributes['post_id'] = wp.media.view.settings.post.id;
		////console.log(attachment.attributes);
		////console.log(attachment.attributes['attachment']);
		////console.log(attachment.attributes['html']);
		
		$('#tern-theme-shortcodes-image .image').html(thumb);
		$('#tern-theme-shortcodes-image input[name=image]').val(html);
		form_selected_open();
	}
	$('.tern-theme-shortcode-form .btn-image-select').bind('click',function (e) {
		e.preventDefault();
		form_image_selector = wp.media({
			frame : 'post',
			state : 'insert',
			title : 'Select an Image',
			button : {
				text : 'Select image'
			},
			editing : true,
			multiple : false,
			displaySettings : true,
			displayUserSettings : false
		}).on('insert',function () {
			image_set();
		}).open();
	});
	
/*------------------------------------------------------------------------------------------------
	Rule
------------------------------------------------------------------------------------------------*/
	
	function rule_desc() {
		this.find('.desc').text('Rule type: '+this.find('hr').attr('data-type'));
	}
	function rule_add() {
		tinymce_selection_update(rule_compile());
	}
	function rule_edit() {
		var t = tinymce_body.find(shortcode_object).find('hr').attr('data-type');
		$('#tern-theme-shortcodes-rule .rule').removeClass('active');
		$('#tern-theme-shortcodes-rule .rule').each(function () {
			if($(this).find('hr').attr('data-type') == t) {
				$(this).addClass('active');
				return false;
			}
		});
	}
	function rule_update() {
		tinymce_content_update(tinymce_shortcode_replace(rule_compile()));
	}
	function rule_compile() {
		var t = _.template($('#shortcodes-rule').html());
		var s = t({
			item : {
				id : 'rule-'+parseInt(Math.random()*1000),
				class : $('#tern-theme-shortcodes-rule .rule.active hr').attr('data-type')
			}
		});
		return s;
	}

	$('#tern-theme-shortcodes-rule .rule').bind('click',function () {
		$('#tern-theme-shortcodes-rule .rule').removeClass('active');
		$(this).addClass('active');
	});
	
/*------------------------------------------------------------------------------------------------
	Slides
------------------------------------------------------------------------------------------------*/

	function slider_desc() {
		var i = this.find('.slider').attr('data-slider');
		this.find('.desc').html('Using slider: <a href="post.php?action=edit&post='+i+'" target="_blank">'+sliders[i].name+'</a> which has <a href="edit.php?post_type=slide" target="_blank">'+sliders[i].num+' slide'+(sliders[i].num == 1 ? '' : 's')+'</a>').find('a').bind('click',function () {
			window.open($(this).attr('href'),'_blank');
		});;
	}
	function slider_add() {
		tinymce_selection_update(slider_compile());
	}
	function slider_edit() {
		$('#tern-theme-shortcodes-slider select[name=slider]').val(tinymce_body.find(shortcode_object).find('.slider').attr('data-slider'));
		
		//slider_num_set();
		//slider_items();
		//var o = tinymce_body.find(shortcode_object).find('.slider').attr('data-items').split(',');
		//$('#tern-theme-shortcodes-slider .row li').each(function () {
		//	var i = $(this).index();
		//	$(this).find('select').val(o[i]);
		//});
	}
	function slider_update() {
		tinymce_content_update(tinymce_shortcode_replace(slider_compile()));
	}
	function slider_compile(b) {
		var t = _.template($('#shortcodes-slider').html());
		var s = t({
			item : {
				id : 'slider-'+parseInt(Math.random()*1000),
				slider : $('#tern-theme-shortcodes-slider select[name=slider]').val()
				//slides : slider_compile_slides(),
				//length : $('#tern-theme-shortcodes-slider .row li').length
			}
		});
		return s;
	}
	/*
	function slider_compile_slides() {
		var slides = '';
		$('#tern-theme-shortcodes-slider .row li').each(function () {
			slides += slides.length > 0 ? ','+$(this).find('select').val() : $(this).find('select').val();
		});
		return slides;
	}
	function slider_num_set() {
		$('#tern-theme-shortcodes-slider input[name=number]').val(tinymce_body.find(shortcode_object).find('.slider').attr('data-length'));
	}
	function slider_items(n) {
		var n = n ? n : parseInt($('#tern-theme-shortcodes-slider input[name=number]').val());
		
		var l = $('#tern-theme-shortcodes-slider .row li').length;
		var t = l > n ? l-n : n-l;
		if(l > n) {
			for(var i=l;i>=n;i--) {
				$('#tern-theme-shortcodes-slider .row li:eq('+i+')').remove();
			}
		}
		else {
			for(var i=0;i<t;i++) {
				$('#tern-theme-shortcodes-slider .row').append($('#tern-theme-shortcodes-slider .row li:eq(0)').clone());
			}
		}
		form_selected_open();
	}
	$('#tern-theme-shortcodes-slider .number-update').bind('click',function () {
		var v = $('#tern-theme-shortcodes-slider input[name=number]');
		if(!/^[0-9]+$/.test(v.val()) && v.val().length > 0) {
			alert('Please choose a numeric value only.');
			return;
		}
		slider_items(parseInt(v.val()));
	});
	*/
	
/*------------------------------------------------------------------------------------------------
	Tab
------------------------------------------------------------------------------------------------*/
	
	function tab_desc() {
		this.find('.desc').text('Number of tabs: '+this.find('.tab-pane').length);
	}
	function tab_add() {
		tinymce_selection_update(tab_compile());
	}
	function tab_edit() {
		tab_num_set();
		tab_tabs_add();
		tab_values_set();
	}
	function tab_update() {
		tinymce_content_update(tinymce_shortcode_replace(tab_compile(false)));
	}
	function tab_compile(b) {
		var t = _.template($('#shortcodes-tab').html());
		var s = t({
			item : {
				id : 'tab-'+parseInt(Math.random()*1000),
				tabs : tab_compile_tabs()
			}
		});
		return s;
	}
	function tab_compile_tabs() {
		var tabs = [];
		var x = 0;
		tinymce_editors_save();
		$('#tern-theme-shortcodes-tab .tabs li').each(function () {
			tabs[tabs.length] = {
				id : x,
				title : $(this).find('input[name=title]').val(),
				content : $(this).find('textarea[name=content]').val()
			};
			x++;
		});
		return tabs;
	}
	
	function tab_num_set() {
		$('#tern-theme-shortcodes-tab input[name=number]').val(tinymce_body.find(shortcode_object).find('.tab-pane').length);
	}
	function tab_tabs_add(v) {
		var v = v ? v : tinymce_body.find(shortcode_object).find('.tab-pane').length;
		var l = $('#tern-theme-shortcodes-tab .tabs li').length;
		if(v == l || v < 1) {
			return;
		}
		else if(v < l) {
			$('#tern-theme-shortcodes-tab .tabs li:gt('+(v-1)+')').remove();
		}
		else {
			for(var i=0;i<(v-l);i++) {
				$('#tern-theme-shortcodes-tab .tabs').append('<li>'+$('#tern-theme-shortcodes-tab-form').html()+'</li>');
			}
		}
		form_tinymce_add();
		form_selected_open();
	}
	function tab_values_set() {
		var o = tinymce_body.find(shortcode_object);
		$('#tern-theme-shortcodes-tab .tabs li').each(function () {
			$(this).find('input[name=title]').val(o.find('.tab-title:eq('+$(this).index()+')').text());
			tinyMCE.get($(this).find('textarea').attr('id')).setContent(o.find('.tab-pane:eq('+$(this).index()+')').html());
		});
	}
	$('#tern-theme-shortcodes-tab .number-update').bind('click',function () {
		var v = $('#tern-theme-shortcodes-tab input[name=number]').val();
		if(!/^[0-9]+$/.test(v) && v.length > 0) {
			alert('Please choose a numeric value only.');
			return;
		}
		tab_tabs_add(parseInt(v));
	});
	
/*------------------------------------------------------------------------------------------------
	Text
------------------------------------------------------------------------------------------------*/
	
	function text_desc() {
		this.find('.desc').text('Text starts with: "'+this.find('.text').text().substr(0,25)+'"');
	}
	function text_add() {
		tinymce_selection_update(text_compile());
	}
	function text_edit() {
		tinyMCE.get($('#tern-theme-shortcodes-text textarea[name=content]').attr('id')).setContent(tinymce_body.find(shortcode_object).find('.text').html());
	}
	function text_update() {
		tinymce_content_update(tinymce_shortcode_replace(text_compile()));
	}
	function text_compile() {
		tinymce_editors_save();
		var t = _.template($('#shortcodes-text').html());
		
		var v = $('#tern-theme-shortcodes-text textarea[name=content]').val();
		v = '<p>'+v.replace(/\n([ \t]*\n)+/g,'</p><p>').replace('\n','<br />')+'</p>';
		
		var s = t({
			item : {
				id : 'text-'+parseInt(Math.random()*1000),
				text : v
			}
		});
		return s;
	}
	
/*------------------------------------------------------------------------------------------------
	Well
------------------------------------------------------------------------------------------------*/
	
	function well_desc() {
		this.find('.desc').text('Text starts with: "'+this.find('.well').text().substr(0,25)+'"');
	}
	function well_add() {
		tinymce_selection_update(well_compile());
	}
	function well_edit() {
		var o = tinymce_body.find(shortcode_object);
		tinyMCE.get($('#tern-theme-shortcodes-well .tabs textarea[name=content]').attr('id')).setContent(o.find('.well').html());
	}
	function well_update() {
		tinymce_content_update(tinymce_shortcode_replace(well_compile()));
	}
	function well_compile() {
		var t = _.template($('#shortcodes-well').html());
		tinymce_editors_save();
		var s = t({
			item : {
				id : 'well-'+parseInt(Math.random()*1000),
				content : $('#tern-theme-shortcodes-well .tabs textarea[name=content]').val()
			}
		});
		return s;
	}
	
/*------------------------------------------------------------------------------------------------
	Spacer
------------------------------------------------------------------------------------------------*/
	
	function spacer_desc() {
		this.find('.desc').text('Spacer height: '+this.find('.spacer').attr('data-height'));
	}
	function spacer_add() {
		tinymce_selection_update(spacer_compile());
	}
	function spacer_edit() {
		var o = tinymce_body.find(shortcode_object);
		$('#tern-theme-shortcodes-spacer input[name=height]').val(o.find('.spacer').attr('data-height'));
	}
	function spacer_update() {
		tinymce_content_update(tinymce_shortcode_replace(spacer_compile()));
	}
	function spacer_compile() {
		var t = _.template($('#shortcodes-spacer').html());
		var s = t({
			item : {
				id : 'spacer-'+parseInt(Math.random()*1000),
				height : $('#tern-theme-shortcodes-spacer input[name=height]').val().replace(/[^0-9]+/,'')
			}
		});
		return s;
	}

	
/*------------------------------------------------------------------------------------------------
	Miscellaneous
------------------------------------------------------------------------------------------------*/
	
	function htmlentities(s) {
		return s.replace(/./gm,function(i) {
			return '&#'+i.charCodeAt(0)+';';
		});
	}
	function from_htmlentities(s) {
		return (s+"").replace(/&#\d+;/gm,function(s) {
			return String.fromCharCode(s.match(/\d+/gm)[0]);
		});
	}
   
/****************************************terminate Script******************************************/

	});
})(jQuery);