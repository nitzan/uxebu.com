<?php
/*
Plugin Name: RecentArticlesUxebuStyle
Plugin URI: 
Description: Dieses Plugin erstellt ein Sidebar-Widget das die aktuellen Artikel im Uxebu-Style ausgibt.
Author: Nicoletta Arps 
Version: 1.0
Author URI: http://wp-spezialist.de
*/
function recentarticles_widget_sidebar_init() {
if ( !function_exists('register_sidebar_widget') )
return;
function recentarticles_widget_sidebar() {
// eiger Code Start
	echo '<li class="widget widget-recentarticlesuxebustyle"><div class="hd"><div class="col-6"><h3 class="widgettitle">Recent</h3></div><div class="col-6 last"><a class="viewall" href="/archive" title="View all posts">View all posts...</a></div></div><hr class="widget-hr" /><div class="bd"><ul>';
	 $recent_posts = wp_get_recent_posts('numberposts=3');
		foreach( $recent_posts as $post ){
			echo '<li class="uxebu-recent-articles mbl"><a class="article-sidebar-link" href="' . get_permalink($post["ID"]) . '" title="Look '.$post["post_title"].'" >' .   $post["post_title"].'</a><br />'. get_the_author() . ' | ' . get_the_time('F jS') . '</li> ';
		}
	echo '</ul></div></li>';
// eiger Code Ende
}
register_sidebar_widget('RecentArticlesUxebuStyle', 'recentarticles_widget_sidebar');
}
add_action('plugins_loaded', 'recentarticles_widget_sidebar_init');
?>