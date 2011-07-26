<?php
/**
 * @package WordPress
 * @subpackage Default_Theme
 */

get_header();
?>

<!--single.php-->
<div class="col-8 wpmain"><!-- main col -->
  <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
	<div class="container">
		<div class="mod mod-skin2 mbm mtl"><!-- ein post -->
			<div class="container"><!-- h2 & content -->
			<div class="hd line default mhx">
					<div class="col-7">
						<h2 class="h3 mhn"><?php the_title(); ?></h2>
					</div>
					<div class="col-5 last">
						<div class="media mhn mtl ptm">
							<div class="img-ext mlm">
								<?php echo get_avatar(get_the_author_id(), 38 ); ?>
							</div>
							<div class="bd font-small tar" style="display: block;">
								<?php the_time('F jS, Y') ?><br />
		                     	<?php printf('<strong><a class="wplnk" href="'. get_author_posts_url(get_the_author_ID()) .'" title="'. sprintf(__("Posts by %s","uxebu"), attribute_escape(get_the_author())).' ">'. get_the_author() .'</a></strong>'); ?>
							</div>
						</div><!-- end media -->
					</div><!-- end col -->
			</div><!-- end hd -->
			<div class="tar"><p><?php the_tags('',''); ?></p></div>
			<div class="bd">
				<?php the_content('read more... &#187;'); ?>
				<!--<?php trackback_rdf(); ?>-->
			</div><!-- end bd -->
			</div><!-- container -->
			</div><!-- end mod post -->

	<?php endwhile; else: ?>
		<p>No articles unfortunately</p>
	<?php endif; ?>
	</div><!-- container post -->
<div class="container commentload">
 <?php comments_template(); ?>
</div><!-- container comment -->

</div><!-- End col-8 main col -->
<div class="col-4 last"><!-- sidebar col -->
	<div class="mod mod-skin1">
		<div class="sidebar-right">
			<ul class="mtn mln mrn pbm">
				<?php if ( function_exists ( dynamic_sidebar('Sidebar1') ) ) : dynamic_sidebar ('Sidebar1'); endif; ?>
			</ul>
		</div>
	</div>
</div><!-- end col-4 sidebar -->


	
<?php get_footer(); ?>

