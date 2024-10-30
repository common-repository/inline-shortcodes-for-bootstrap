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

add_action('wp_print_styles','thnk_bis_front_styles');

/*------------------------------------------------------------------------------------------------
	Scripts
------------------------------------------------------------------------------------------------*/

function thnk_bis_front_styles() {
	wp_enqueue_style('thnk_bis_style',THKN_BIS_URL.'css/style.css',array(),'1.0','all');
}

/****************************************Terminate Script******************************************/
?>