<?php
/**
 * @package WordPress
 * @subpackage Default_Theme
 */

get_header();
?>

<!--archive.php-->
<div class="col-8 wpmain"><!-- main col -->
	<div class="mod-skin2">
		<?php if (have_posts()) : ?>

			 <?php $post = $posts[0]; // Hack. Set $post so that the_date() works. ?>
		<?php if (is_category()) { ?>				
			<h3>Category-Archive for <?php single_cat_title(); ?></h3>

	 	  <?php } elseif (is_day()) { ?>
			<h3>Tagesarchiv f&uuml;r den <?php the_time('j. F Y'); ?></h3>

		 <?php } elseif (is_month()) { ?>
			<h3>Monatsarchiv f&uuml;r <?php the_time('F Y'); ?></h3>

			<?php } elseif (is_year()) { ?>
			<h3>Jahresarchiv f&uuml;r <?php the_time('Y'); ?></h3>

		  <?php } elseif (is_author()) { ?>
			<h3>Autoren Archiv</h3>

			<?php } elseif (isset($_GET['paged']) && !empty($_GET['paged'])) { ?>
				<h3>Blog Archiv</h3>

			<?php } ?>


			<?php while (have_posts()) : the_post(); ?>

			<div class="container mal">
				<div class="bd">
					<div class="col-3">
						<p class="mlm mrm"><?php the_time('F jS, Y') ?></p>
					</div>
						<div class="col-9 last">
						<p>	<a id="post-<?php the_ID(); ?>" href="<?php the_permalink() ?>" rel="bookmark" title="<?php the_title_attribute(); ?>" class="wplnk"><?php the_title(); ?></a></p>
						</div>

					</div>

				
				</div><!-- end bd -->


		<?php endwhile; ?>
			


		

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
<?php else :

		if (is_category()) 
			printf("<h2 class='center'>Leider, derzeit keine Artikel in der Kategorie: %s </h2>", single_cat_title('',false));
		else if (is_date()) 
			echo("<h2>Leider gibt es keine Artikel.</h2>");
		else if (is_author()) 
			printf("<h2 class='center'>Leider,%s hat noch keinen Artikel geschrieben.</h2>", get_userdatabylogin(get_query_var('author_name'))->display_name);
		else
			echo("<h2 class='center'>Leider, kein Artikel gefunden. Die Suche hilft weiter:</h2>");
		get_search_form();

	endif;
?>



<?php get_footer(); ?>
