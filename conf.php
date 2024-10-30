<?php
////////////////////////////////////////////////////////////////////////////////////////////////////
//
//		File:
//			conf.php
//		Description:
//			This file initializes the Wordpress Plugin - Bootstrap Inline Shortcodes
//		Date:
//			Added on April 18th 2016
//		Version:
//			1.0
//		Copyright:
//			Copyright (c) 2016 thnkng.co
//
////////////////////////////////////////////////////////////////////////////////////////////////////

/****************************************Commence Script*******************************************/

/*------------------------------------------------------------------------------------------------
	Define
------------------------------------------------------------------------------------------------*/

define('THNK_BIS_DIR',plugin_dir_path(__FILE__));
define('THKN_BIS_URL',plugin_dir_url(__FILE__));

/*------------------------------------------------------------------------------------------------
	Load Classes
------------------------------------------------------------------------------------------------*/

require_once(dirname(__FILE__).'/class/file.php');
$getFILE = new tern_fileClass;
$l = $getFILE->directoryList(array(
	'dir'	=>	dirname(__FILE__).'/class/',
	'rec'	=>	true,
	'flat'	=>	true,
	'depth'	=>	1
));
if(is_array($l)) {
	foreach($l as $k => $v) {
		require_once($v);
	}
}

/*------------------------------------------------------------------------------------------------
	Load Core Files
------------------------------------------------------------------------------------------------*/

if(is_admin()) {
	$l = $getFILE->directoryList(array(
		'dir'	=>	dirname(__FILE__).'/core/',
		'rec'	=>	true,
		'flat'	=>	true,
		'depth'	=>	1,
		'ext'	=>	array('php')
	));
}
else {
	$l = $getFILE->directoryList(array(
		'dir'	=>	dirname(__FILE__).'/front/',
		'rec'	=>	true,
		'flat'	=>	true,
		'depth'	=>	1,
		'ext'	=>	array('php')
	));
}
if(is_array($l)) {
	foreach($l as $k => $v) {
		require_once($v);
	}
}

/*------------------------------------------------------------------------------------------------
	Initialize
------------------------------------------------------------------------------------------------*/

add_action('init','thnk_bis_init',-9999);
function thnk_bis_init() {
	global $ternSel;
	$ternSel = new tern_select();
	
}

/****************************************Terminate Script******************************************/
?>