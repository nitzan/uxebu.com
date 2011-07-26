<?php
/*
Template Name: Archiv
*/
get_header();
?>
<div class="col-8 wpmain"><!-- main col -->
	<div class="mod-skin2 pal">
<?php	$wp_query = $tmp_query;
	                query_posts('posts_per_page=-1'); 
	                if (have_posts()) :
	                while (have_posts()) : the_post();
	?>
			<div class="container mal">
				<div class="bd">
					<div class="col-3">
						<?php the_time('F jS, Y') ?><br />
					</div>
						<div class="col-9 last">
							<a id="post-<?php the_ID(); ?>" href="<?php the_permalink() ?>" rel="bookmark" title="<?php the_title_attribute(); ?>"><?php the_title(); ?></a>
						</div>

					</div>

				
				</div><!-- end bd -->


		<?php endwhile; ?>
			

		<?php else : ?>

			<p>Sorry, nothing found</p>

		<?php endif; ?>
				</div><!-- end mod -->
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
