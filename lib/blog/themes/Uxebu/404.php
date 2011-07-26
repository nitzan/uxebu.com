<?php
/**
 * @package WordPress
 * @subpackage Default_Theme
 */

get_header();
?>
<div class="col-8 wpmain"><!-- main col -->
<p>Page doesn't exist</p>

</div><!-- End col-8 main col -->
<div class="col-4 last"><!-- sidebar col -->
    <div class="mod mod-skin1">
        <div class="class="sidebar-right"">
            <ul>
                <?php if ( function_exists ( dynamic_sidebar('Sidebar1') ) ) : dynamic_sidebar ('Sidebar1'); endif; ?>
            </ul>
        </div>
    </div>
</div><!-- end col-4 sidebar -->

<?php get_footer(); ?>
