<?php
/**
 * @package WordPress
 * @subpackage Default_Theme
 */

get_header();
?>
<div class="col-8 wpmain"><!-- main col -->
<?php	$wp_query = $tmp_query;
$args = array(
'post_type' => array( 'post', 'externalpost'),
'post_per_page' => 5
);
query_posts($args);
	                if (have_posts()) :
	                while (have_posts()) : the_post();
	?>
									<!-- Linkziel der Überschrift extrahieren -->
								<?php
								if ( 'externalpost' == get_post_type() )
									{
									$mykey_values = get_post_custom_values('externallink');
									  foreach ( $mykey_values as $key => $value ) {
									    $headlink = $value; 
									  }
									}	
								?>
								<!-- Darstellung je nach Typ -->
								<?php
								if ( 'externalpost' == get_post_type() )
									{
									?>	
									<div class="mod mod-skin2"><!-- ein post -->
										<div class="hd">
											<div class="col-1">
												<div class="sprite big-arrow-up"></div>
											</div><!-- col 2 -->
											<div class="col-7">
												<h2 class="h3">
													<a id="post-<?php the_ID(); ?>" href="<?php echo $headlink ?>"rel="bookmark" title="<?php the_title_attribute(); ?>" class="wplnk"><?php the_title(); ?></a>
												</h2>
											</div><!-- col 6 -->
											<div class="col-4 last">
												<div class="media">
													<div class="img-ext">
														<img src="http://a3.twimg.com/profile_images/696769359/me_uxebu_cropped-uxebu-overlayed.jpg" alt="Wolfram Kriesing" class="media-xs" />
													</div>
													<div class="bd font-small tar">
														<?php the_time('F jS, Y') ?><br />
														<?php printf('<a class="wplnk-bold" href="'. get_author_posts_url(get_the_author_ID()) .'" title="'. sprintf(__("Posts by %s","uxebu"), attribute_escape(get_the_author())).' ">'. get_the_author() .'</a>'); ?>
													</div>
												</div><!-- end media -->
											</div><!-- end col 4 -->
										</div>	<!-- hd -->
										<div class="bd">
											<div class="col-1">
												&nbsp;
											</div>
										<div class="col-11">
												<?php the_content('read more...'); ?>
												<!--<?php trackback_rdf(); ?>-->
										</div>
										</div><!-- bd -->
									</div><!-- end mod -->
																											

									<?php
								}	
								else 
								{
									?>
									<div class="mod mod-skin2"><!-- ein post -->
										<div class="hd">		
											<div class="col-8">
													<h2 class="h3"><a id="post-<?php the_ID(); ?>" href="<?php the_permalink(); ?>"rel="bookmark" title="<?php the_title_attribute(); ?>" class="wplnk"><?php the_title(); ?></a></h2>
											</div>
											<div class="col-4 last">
												<div class="media">
													<div class="img-ext">
														<img src="http://a3.twimg.com/profile_images/696769359/me_uxebu_cropped-uxebu-overlayed.jpg" alt="Wolfram Kriesing" class="media-xs" />
													</div>
													<div class="bd font-small tar">
														<?php the_time('F jS, Y') ?><br />
														<?php printf('<a class="wplnk-bold" href="'. get_author_posts_url(get_the_author_ID()) .'" title="'. sprintf(__("Posts by %s","uxebu"), attribute_escape(get_the_author())).' ">'. get_the_author() .'</a>'); ?>
													</div>
												</div><!-- end media -->
											</div><!-- end col -->
									</div><!-- end hd -->
									<div class="bd">
										<?php the_content('read more...'); ?>
										<!--<?php trackback_rdf(); ?>-->

									</div><!-- end bd -->
									</div><!-- end mod -->
									
									<?php
									
								}
								?>	
				

		<?php endwhile; ?>
		<div class="tar">	
			<a class="font-small footerlink" href="<?php echo get_option('home'); ?>/archive/">View all posts...</a>
		</div>

		<?php else : ?>

			<p>Sorry, nothing found</p>

		<?php endif; ?>

</div><!-- End col-8 main col -->
<div class="col-4 last"><!-- sidebar col -->
		<div class="sidebar-right">
			<ul class="man">
				<?php if ( function_exists ( dynamic_sidebar('Sidebar2') ) ) : dynamic_sidebar ('Sidebar2'); endif; ?>
			</ul>
			<a href="##" class="viewall tar">View past events...</a>
		</div>
</div><!-- end col-4 sidebar -->



<?php get_footer(); ?>
