<?php
/*
Template Name: Archiv
*/
get_header();
?>
<div class="col-8 wpmain"><!-- main col -->
	<div class="mod-skin2 pal mtl">
				<div class="hd">
					<h3 class="line default mhl">Archive</h3> 
				</div>
<?php	$wp_query = $tmp_query;
	                query_posts('posts_per_page=-1'); 
	                if (have_posts()) :
	                while (have_posts()) : the_post();
	?>
			<div class="container mal">
				<div class="bd">
					<div class="col-3">
						<span class="font-small"><?php the_time('M jS, Y') ?></span>
					</div>
						<div class="col-9 last">
							<div class="media man">
								<div class="img mrs">
									<?php echo get_avatar(get_the_author_id(), 20 ); ?>
								</div>
								<div class="bd">
									<a id="post-<?php the_ID(); ?>" href="<?php the_permalink() ?>" rel="bookmark" title="<?php the_title_attribute(); ?>"><?php the_title(); ?></a>
								</div>
							</div>
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
