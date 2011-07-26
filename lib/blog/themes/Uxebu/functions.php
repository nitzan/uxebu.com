<?php

// Widget Settings

if ( function_exists('register_sidebar') )
	register_sidebar(array(
		'name' => 'Sidebar1',
		'before_widget' => '<li id="%1$s" class="widget %2$s">', 
	'after_widget' => '</li>', 
	'before_title' => '<h3 class="widgettitle style-head">', 
	'after_title' => '</h3><hr class="widget-hr"/>', 
	));

if ( function_exists('register_sidebar') )
	register_sidebar(array(
		'name' => 'Sidebar2',
		'before_widget' => '<li id="%1$s" class="widget %2$s">', 
		'after_widget' => '</li>', 
		'before_title' => '', 
		'after_title' => '',
	));


// Custom Menus 
add_theme_support( 'nav-menus' );


function home_page_menu_args( $args ) {
$args['show_home'] = true;
return $args;
}
add_filter( 'wp_page_menu_args', 'home_page_menu_args' );


add_action( 'init', 'register_my_menus' );
function register_my_menus() {
register_nav_menus(
array(
'main_menu' => __( 'mainmenu' ),
      )
      );
}

// Tags
add_filter('the_tags', 'tags_add_link_class');
 
function tags_add_link_class($output) {
  $var1 = '<a';
  $var2 = '<a class="tag"';
  $output = str_replace($var1, $var2, $output);
return $output;
}

// Kommentar-Darstellung

function uxebu_comment($comment, $args, $depth) {
   $GLOBALS['comment'] = $comment; 
	static $comment_number = 0; ?>
	 <div <?php comment_class(); ?> id="comment-<?php comment_ID(); ?>">
		<div class="bd">
			<?php comment_text() ?>
				<?php if ($comment->comment_approved == '0') : ?>
	         		<em><?php _e('Your comment is awaiting moderation.') ?></em>
	      		<?php endif; ?>
			</div>
  		<div class="ft">
			<div class="col-2">
				<span class="comm-nbr"><?php $comment_number++; echo $comment_number; ?></span>
			</div>
      		<div class="col-10 last">
				<div class="media mbs">
         			<div class="img-ext media-xs">
						<?php echo get_avatar($comment,$size='48',$default='<path_to_url>' ); ?>
					</div>
         			<div class="bd comm-meta">
					<p class="mrm">	<?php printf(__('%1$s &mdash; %2$s'), get_comment_date(),  get_comment_time('h:i a')) ?><br />
						<strong><?php printf(__('%s'), get_comment_author_link()) ?></strong></p>
					<div><!-- bd comm-meta -->			
      			</div><!-- media -->
      		</div><!-- col-10 -->
		</div><!-- ft -->
     </div><!-- id comm -->
</div>
<?php
        }

// external posts

add_action( 'init', 'register_cpt_externalpost' );
function register_cpt_externalpost() {
$labels = array(
'name' => _x( 'externalposts', 'externalpost' ),
'singular_name' => _x( 'externalpost', 'externalpost' ),
'add_new' => _x( 'Add New', 'externalpost' ),
'add_new_item' => _x( 'Add New externalpost', 'externalpost' ),
'edit_item' => _x( 'Edit externalpost', 'externalpost' ),
'new_item' => _x( 'New externalpost', 'externalpost' ),
'view_item' => _x( 'View externalpost', 'externalpost' ),
'search_items' => _x( 'Search externalposts', 'externalpost' ),
'not_found' => _x( 'No externalposts found', 'externalpost' ),
'not_found_in_trash' => _x( 'No externalposts found in Trash', 'externalpost' ),
'parent_item_colon' => _x( 'Parent externalpost:', 'externalpost' ),
'menu_name' => _x( 'externalposts', 'externalpost' ),
);
$args = array(
'labels' => $labels,
'hierarchical' => false,
'description' => 'Blogpost where the Headline linkes to an external source',
'supports' => array( 'title', 'editor', 'author', 'custom-fields' ),
'taxonomies' => array( 'category', 'post_tag' ),
'public' => true,
'show_ui' => true,
'show_in_menu' => true,
'menu_position' => 5,
'show_in_nav_menus' => true,
'publicly_queryable' => true,
'exclude_from_search' => false,
'has_archive' => true,
'query_var' => true,
'can_export' => true,
'rewrite' => true,
'capability_type' => 'post'
);
register_post_type( 'externalpost', $args );
}

?>