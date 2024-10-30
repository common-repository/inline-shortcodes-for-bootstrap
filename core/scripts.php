<?php
////////////////////////////////////////////////////////////////////////////////////////////////////
//
//		File:
//			scripts.php
//		Description:
//			Enqueue scripts and styles for ternstyle's WordPress Themes
//		Actions:
//			1) Enqueue scripts and styles
//		Date:
//			Added on February 4th, 2015
//		Copyright:
//			Copyright (c) 2016 thnkng.co
//
////////////////////////////////////////////////////////////////////////////////////////////////////

/****************************************Commence Script*******************************************/

/*------------------------------------------------------------------------------------------------
	Events
------------------------------------------------------------------------------------------------*/

add_action('init','thnk_bis_admin_css');
add_action('init','thnk_bis_admin_js');
add_action('admin_print_scripts','thnk_bis_admin_js_print');

/*------------------------------------------------------------------------------------------------
	Scripts
------------------------------------------------------------------------------------------------*/

function thnk_bis_admin_css() {
	wp_enqueue_style('font-awesome',THKN_BIS_URL.'tools/font-awesome/css/font-awesome.min.css',array(),'1.0','all');
	wp_enqueue_style('thnk_bis_amdin',THKN_BIS_URL.'css/admin.css',array(),'1.0','all');
}
function thnk_bis_admin_js() {
	wp_enqueue_script('jquery-ui-droppable');
	wp_enqueue_script('jquery-ui-tooltip');
	wp_enqueue_script('underscore-1.7');
	wp_enqueue_script('thnk_bis_shortcodes',THKN_BIS_URL.'js/shortcodes.js',array('jquery'),'1.0',true);
}
function thnk_bis_admin_js_print() {
	$sliders = get_posts('numberposts=4&post_type=slider&orderby=menu_order&order=asc');
	$a = array();
	foreach((array)$sliders as $v) {
		$s = get_post_meta($v->ID,'_slide_ids',true);
		$a[(int)$v->ID] = array(
			'name'	=>	$v->post_title,
			'num'	=>	count(json_decode($s))
		);
	}
	echo '<script type="text/javascript">var thnk_bis_sliders = '.json_encode($a).'</script>';
	
}

/****************************************Terminate Script******************************************/
?>