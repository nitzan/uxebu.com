<?php
/*
Plugin Name: AutorenWidget
Plugin URI: 
Description: Dieses Plugin erstellt ein Sidebar-Widget das die Autoren auflistet und verlinkt.
Author: Nicoletta Arps 
Version: 1.0
Author URI: http://wp-spezialist.de
*/
function widget_sidebar_init() {
if ( !function_exists('register_sidebar_widget') )
return;
function widget_sidebar() {
// eiger Code Start
	echo '<li class="widget widget-autorenwidget"><h3 class="widgettitle style-head">Contributing People</h3><hr class="widget-hr" /><ul>';
	wp_list_authors('exclude_admin=0');
	echo '</ul></li>';
// eiger Code Ende
}
register_sidebar_widget('AutorenWidget', 'widget_sidebar');
}
add_action('plugins_loaded', 'widget_sidebar_init');
?>