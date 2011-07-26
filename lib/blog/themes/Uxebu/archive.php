<?php
/**
 * @package WordPress
 * @subpackage Default_Theme
 */

get_header();
?>

<!--archive.php-->
<div class="col-8 wpmain"><!-- main col -->
    <div class="mod-skin2 pal mtl">
        <?php if (have_posts()) : ?>

            <?php $post = $posts[0]; // Hack. Set $post so that the_date() works. ?>
            <?php if (is_category()) { ?>
            <div class="hd">
                <h3 class="line default mhl">Archive for <?php single_cat_title(); ?></h3>
            </div>

            <?php } elseif (is_day()) { ?>
            <div class="hd">
                <h3 class="line default mhl">Archive for <?php the_time('j. F Y'); ?></h3>
            </div>

            <?php } elseif (is_month()) { ?>
            <div class="hd">
                <h3 class="line default mhl">Archive for <?php the_time('F Y'); ?></h3>
            </div>

            <?php } elseif (is_year()) { ?>
            <div class="hd">
                <h3 class="line default mhl">Archive for <?php the_time('Y'); ?></h3>
            </div>

            <?php } elseif (is_author()) { ?>
            <div class="hd">
                <h3 class="line default mhl">Authors archive</h3>
            </div>
            <?php } elseif (isset($_GET['paged']) && !empty($_GET['paged'])) { ?>
            <div class="hd">
                <h3 class="line default mhl">Blog archive</h3>
            </div>

            <?php } ?>

            <?php while (have_posts()) : the_post(); ?>

            <div class="container mal">
                <div class="bd">
                    <div class="col-3">
                        <pspan class="font-small"><?php the_time('M jS, Y') ?></p>
                    </div>
                    <div class="col-9 last">
                        <div class="media man">
                            <div class="img mrs">
                                <?php echo get_avatar(get_the_author_id(), 20 ); ?>
                            </div>
                            <div class="bd">
                                <a id="post-<?php the_ID(); ?>" href="<?php the_permalink() ?>" rel="bookmark" title="<?php the_title_attribute(); ?>" class="wplnk"><?php the_title(); ?></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div><!-- end container -->
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
            printf("<h2 class='center'>No articles available in this category: %s </h2>", single_cat_title('',false));
        else if (is_date())
            echo("<h2>No articles available.</h2>");
        else if (is_author())
            printf("<h2 class='center'>Unfortunately, we don't yet have articles from %s.</h2>", get_userdatabylogin(get_query_var('author_name'))->display_name);
        else
            echo("<h2 class='center'>No articles available, maybe try the search?</h2>");
        get_search_form();

    endif;
?>

<?php get_footer(); ?>
