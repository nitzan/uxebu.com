<?php
/**
 * @package WordPress
 * @subpackage Default_Theme
 */

// Diese Zeilen nicht loeschen
    if (!empty($_SERVER['SCRIPT_FILENAME']) && 'comments.php' == basename($_SERVER['SCRIPT_FILENAME']))
        die ('What are you trying to do partner?');


?>



<?php if ( have_comments() ) : ?>

<div class="mod mod-skin1 mbl">
    <h3>Comments</h3>
</div>



    <?php wp_list_comments('style=div&type=comment&callback=uxebu_comment'); ?>
<?php else : ?>

<?php endif; ?>


<?php if ('open' == $post->comment_status) : ?>

<!--formular begin -->
<div class="container">
    <div id="respond" class="mod mod-skin1"><!-- id lassen -->
        <h3 class="line business"><?php comment_form_title( 'Leave a Reply', 'Leave a Reply' ); ?></h3>
        <div class="cancel-comment-reply">
            <small><?php cancel_comment_reply_link(); ?></small>
        </div>
        <?php if ( get_option('comment_registration') && !$user_ID ) : ?>
            <p>Please register before commenting: <a href="<?php echo get_option('siteurl'); ?>/wp-login.php?redirect_to=<?php echo urlencode(get_permalink()); ?>">log in</a></p>
        <?php else : ?>
            <form action="<?php echo get_option('siteurl'); ?>/wp-comments-post.php" method="post" id="commentform" class="uni-form">
                <?php if ( $user_ID ) : ?>
                    <p>Hi <a href="<?php echo get_option('siteurl'); ?>/wp-admin/profile.php"><?php echo $user_identity; ?></a>. <a href="<?php echo wp_logout_url(get_permalink()); ?>" title="Log out of this account">Log out &raquo;</a></p>
                <?php else : ?>
                    <div class="ctrl-holder">
                        <div class="col-6">
                            <label for="author">Your Name</label>
                            <div class="mrl">
                                <input type="text" required="required" class="text-input large" name="author" id="author" value="<?php echo $comment_author; ?>" tabindex="1" <?php if ($req) echo "aria-required='true'"; ?> />
                            </div>
                        </div>
                        <div class="col-6 last">
                            <label for="email">Your Email</label>
                            <input type="email" required="required" class="text-input large" name="email" id="email" value="<?php echo $comment_author_email; ?>"  tabindex="2" <?php if ($req) echo "aria-required='true'"; ?> />
                        </div>
                        </div><!-- ctrl holder -->
                        <div class="ctrl-holder">
                            <label for="url">Your Website</label>
                            <input type="text" class="text-input large" name="url" id="url" value="<?php echo $comment_author_url; ?>" tabindex="3" />
                        </div>
                    <?php endif; ?>
                    <div class="ctrl-holder pbm">
                        <label for="url">Your Message</label>
                        <textarea name="comment" required="required" id="comment" cols="50" rows="7" tabindex="4" class="text-input large"></textarea>
                        <p class="mhn"><input name="submit" class="primary-action button comment-submit" type="submit" id="submit" tabindex="5" value="send" />
                            <?php comment_id_fields(); ?>
                        </p>
                    </div>

                <?php do_action('comment_form', $post->ID); ?>
            </form>
    </div><!-- respond -->
</div><!-- container -->
<?php endif; ?>
<?php endif; ?>
