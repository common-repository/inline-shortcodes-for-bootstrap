<?php
////////////////////////////////////////////////////////////////////////////////////////////////////
//
//		File:
//			shortcode.php
//		Description:
//			Render shortcode.
//		Copyright:
//			Copyright (c) 2016 thnkng.co
//
////////////////////////////////////////////////////////////////////////////////////////////////////

/****************************************Commence Script*******************************************/

/*------------------------------------------------------------------------------------------------
	Events
------------------------------------------------------------------------------------------------*/

add_filter('the_content','thnk_bis_shortcode',10);

/*------------------------------------------------------------------------------------------------
	Scripts
------------------------------------------------------------------------------------------------*/

$thnk_bis_shortcodes_remove = [];

function thnk_bis_shortcode($c) {
	global $thnk_bis_shortcodes_remove;
	if(preg_match("/(data-shortcode)/",$c)) {
		$dom = new DomDocument();
		@$dom->loadHTML($c);
		thnk_bis_shortcode_walk($dom);
		foreach((array)$thnk_bis_shortcodes_remove as $v) {
			$v->parentNode->removeChild($v);
		}
		if(version_compare(PHP_VERSION,'5.3.6') < 0){
			$dom->removeChild($dom->firstChild); 
			$dom->replaceChild($dom->firstChild->firstChild->firstChild,$dom->firstChild);
			$c = $dom->saveHTML();
		}
		else {
			$c = $dom->saveHTML($dom->getElementsByTagName('body')->item(0));
		}
	}
	return $c;
}
function thnk_bis_shortcode_walk(DomNode &$node) {
	global $thnk_bis_shortcodes_remove;
	if($node->hasAttributes()) {
		foreach($node->attributes as $v) {
			if($v->name == 'class' and preg_match("/disabled/",$v->value)) {
				$thnk_bis_shortcodes_remove[] = $node;
			}
		}
	}
	if($node->hasChildNodes()) {
		foreach($node->childNodes as $child) {
			thnk_bis_shortcode_walk($child);
		}
	}
}

/****************************************Terminate Script******************************************/
?>