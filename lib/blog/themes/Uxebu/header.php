<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta http-equiv="Content-Type" content="<?php bloginfo('html_type'); ?>; charset=<?php bloginfo('charset'); ?>" />

<title><?php bloginfo('name'); ?> <?php if ( is_single() ) { ?> &raquo; Blog Archiv <?php } ?> <?php wp_title(); ?></title>
<link rel="stylesheet/less" href="/static/less/style.less" type="text/css" media="all" />
<script src="/static/js/less-1.1.3.min.js"></script>
<script src="static/js/main.js"></script>
<meta name="generator" content="WordPress <?php bloginfo('version'); ?>" /> <!-- leave this for stats -->
<link rel="alternate" type="application/rss+xml" title="<?php bloginfo('name'); ?> RSS Feed" href="<?php bloginfo('rss2_url'); ?>" />
<link rel="pingback" href="<?php bloginfo('pingback_url'); ?>" />

<?php wp_head(); ?>
</head>

<body>
    <div class="container">
        <div class="row">
            <div class="mod mod-skin3 no-top-radius">
                <div class="bd">
                    <div class="col-4">
                        <h1 style="font-size:1em;margin:5px 10px;">
                            <a href="/">
                                <img alt="uxebu" style="display:inline;vertical-align:text-bottom;" src="/static/img/logo_glow_small.png">
                            </a>
                        </h1>
                    </div>
                    <div class="col-8 last">
                        <ul class="nav">
                            <li class="list-el list-el-hz">
                                <a href="/">About</a>
                            </li>
                            <li class="list-el list-el-hz active">
                                <a href="/">Blog / Events</a>
                            </li>
                            <li class="list-el list-el-hz">
                                <a class="dropdown-arrow" href="#table">Open Source</a>
                            </li>
                            <div class="dropdown">
                                <ul class="mod mod-skin4">
                                    <li class="bullet">
                                        <h4><a href="http://apparat.io">Apparat.io</a></h4><p><a href="http://apparat.io">Package your HTML5 apps</a></p>
                                    </li>
                                    <li class="bullet">
                                        <h4><a href="http://embedjs.org">EmbedJS</a></h4><p><a href="http://embedjs.org">Ship no useless byte</a></p>
                                    </li>
                                    <li class="bullet">
                                        <h4><a href="https://github.com/tobeytailor/gordon">Gordon</a></h4><p><a href="https://github.com/tobeytailor/gordon">Flash(TM) runtime in JavaScript</a></p>
                                    </li>
                                    <li class="bullet">
                                        <h4><a href="http://humanapi.org">HumanAPI</a></h4><p><a href="http://humanapi.org">Interface hardware with webtech</a></p>
                                    </li>
                                    <li class="bullet">
                                        <h4><a href="https://github.com/jensarps/StorageJS">StorageJS</a></h4><p><a href="https://github.com/jensarps/StorageJS">Synchronous storage</a></p>
                                    </li>
                                    <li class="bullet">
                                        <h4><a href="http://uxebu.com/blog/2010/04/27/touchscroll-a-scrolling-layer-for-webkit-mobile/">TouchScroll</a></h4><p><a href="http://uxebu.com/blog/2010/04/27/touchscroll-a-scrolling-layer-for-webkit-mobile/">Scrolling for iOS and others</a></p>
                                    </li>
                                </ul>
                            </div>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="container">
    <div class="row">
