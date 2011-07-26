<?php
/*
Template Name: Kalender-Archiv
*/
get_header();
?>
<div class="col-8 wpmain"><!-- main col -->
  <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
	<h2 class="h3"><?php the_title(); ?></h2>
		<?php endwhile; endif ?>

			<div class="container mal">
				<div class="bd">
				<?php echo do_shortcode('[google-calendar-events id="2" type="list"]'); ?>
					</div>			
				</div><!-- end bd -->


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
