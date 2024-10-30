<?php
////////////////////////////////////////////////////////////////////////////////////////////////////
//
//		File:
//			tinymce.php
//		Description:
//			Configure tinyMCE for ternstyle's WordPress Themes
//		Actions:
//			1) configure tinyMCE
//		Date:
//			Added on February 4th, 2015
//		Copyright:
//			Copyright (c) 2016 thnkng.co
//
////////////////////////////////////////////////////////////////////////////////////////////////////

/****************************************Commence Script*******************************************/

add_action('admin_footer','thnk_bis_shortcode_form');

/*------------------------------------------------------------------------------------------------
	Filters
------------------------------------------------------------------------------------------------*/

add_filter( 'tiny_mce_before_init','thnk_bis_tinymce_settings' );
add_filter('mce_external_plugins','thnk_bis_tinymce_javascript');
//add_filter('mce_buttons_3','thnk_bis_tinymce_buttons');
add_filter('tiny_mce_before_init', 'thnk_bis_tinymce_options');
add_action('admin_init','thnk_bis_tinymce_styles');
add_action('admin_footer','thnk_bis_tinymce_js');
add_action('media_buttons','thnk_bis_tinymce_shortcode_button',20);

/*------------------------------------------------------------------------------------------------
	Styles
------------------------------------------------------------------------------------------------*/

function thnk_bis_tinymce_styles() {
	add_editor_style(THKN_BIS_URL.'tools/bootstrap/css/bootstrap.min.css');
	add_editor_style(THKN_BIS_URL.'css/tinymce.css');
	add_editor_style(THKN_BIS_URL.'tools/font-awesome/css/font-awesome.css');
	add_editor_style('https://www.google.com/fonts#QuickUsePlace:quickUse/Family:Playfair+Display');
}

/*------------------------------------------------------------------------------------------------
	Settings
------------------------------------------------------------------------------------------------*/

function thnk_bis_tinymce_settings($s) {
	//$s['wpautop'] = false;
	return $s;
}

/*------------------------------------------------------------------------------------------------
	Tags
------------------------------------------------------------------------------------------------*/


function thnk_bis_tinymce_options($a) {
	$o = 'pre[id|name|class|style],iframe[align|longdesc|name|width|height|frameborder|scrolling|marginheight|marginwidth|src],div[align|class|style|id|role|aria-multiselectable|aria-labelledby],br[class],a[href|id|class|title|target|role|data-parent|data-toggle|aria-expanded|aria-controls],span[style|id|class|title]';
	if(isset($a['extended_valid_elements'])) {
		$a['extended_valid_elements'] .= ','.$o;
	}
	else {
		$a['extended_valid_elements'] = $o;
	}
	//$a['plugins'] .= ',noneditable';
	$a['setup'] = <<<JS
[function(ed) {
	ed.on('PreInit',function() {
		tern_theme_shortcodes_init();
	});
	ed.on('keydown',function(e) {
		tern_theme_shortcodes_keydown(e);
	});
	ed.on('setcontent',function() {
		if(tinymce_setting_content) {
			return;
		}
		tern_theme_shortcodes_set();
	});
	ed.on('SaveContent',function(e) {
		tern_theme_shortcodes_remove(e);
	});
}][0]
JS;
	return $a;
}

/*------------------------------------------------------------------------------------------------
	Buttons
------------------------------------------------------------------------------------------------*/

function thnk_bis_tinymce_javascript($a) {
	$a['terncodes'] = THKN_BIS_URL.'js/tinymce.js';
	$a['jquery'] = get_bloginfo('wpurl').'/wp-includes/js/jquery/jquery.js';
	return $a;
}

/*------------------------------------------------------------------------------------------------
	Button
------------------------------------------------------------------------------------------------*/

function thnk_bis_tinymce_shortcode_button() {
	include(THNK_BIS_DIR.'/view/shortcode-add.html');
}

/*------------------------------------------------------------------------------------------------
	Views
------------------------------------------------------------------------------------------------*/

function thnk_bis_shortcode_form() {
	global $ternSel;
	$features = get_posts(array(
		'post_type'		=>	'feature',
		'numberposts'	=>	-1
	));
	$sliders = get_posts(array(
		'post_type'		=>	'slider',
		'numberposts'	=>	-1
	));
	$slides = get_posts(array(
		'post_type'		=>	'slide',
		'numberposts'	=>	-1
	));
	$features = json_decode(json_encode($features),true);
	$sliders = json_decode(json_encode($sliders),true);
	$slides = json_decode(json_encode($slides),true);
	include(THNK_BIS_DIR.'/view/shortcodes.html');
}
function thnk_bis_tinymce_js() {
	$p = get_pages();
	$s = '';
	foreach((array)$p as $v) {
		$s .= $v->ID.':"'.get_permalink($v->ID).'",';
	}
	echo '<script type="text/javascript">var shortcodes_pages = {'.$s.'};</script>';
}

/****************************************Terminate Script******************************************/
?>