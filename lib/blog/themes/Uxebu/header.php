<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta http-equiv="Content-Type" content="<?php bloginfo('html_type'); ?>; charset=<?php bloginfo('charset'); ?>" />
<meta name="viewport" content="width=device-width,initial-scale=1.0" />
<meta http-equiv="X-UA-Compatible" content="chrome=1" />

<title><?php bloginfo('name'); ?> <?php if ( is_single() ) { ?> &raquo; Blog Archiv <?php } ?> <?php wp_title(); ?></title>
<link rel="stylesheet" href="/static/css/style.css" type="text/css" media="all" />
<script src="https://ajax.googleapis.com/ajax/libs/dojo/1.5/dojo/dojo.xd.js"></script>
<script src="/static/js/main.js"></script>
<script type="text/javascript" src="http://use.typekit.com/vlx3ppb.js"></script>
<script type="text/javascript">try{Typekit.load();}catch(e){}</script>
<meta name="generator" content="WordPress <?php bloginfo('version'); ?>" /> <!-- leave this for stats -->
<link rel="alternate" type="application/rss+xml" title="<?php bloginfo('name'); ?> RSS Feed" href="<?php bloginfo('rss2_url'); ?>" />
<link rel="pingback" href="<?php bloginfo('pingback_url'); ?>" />

<?php wp_head(); ?>
<script type="text/javascript">
  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-4832590-1']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();
</script>
</head>

<body>
    <div class="container">
        <div class="row header">
            <div class="mod mod-skin3 no-top-radius">
                <div class="bd">
                    <div class="col-3">
                        <h1 style="font-size:1em;margin:5px 25px;"><a href="/"><img alt="uxebu" style="display:inline;vertical-align:text-bottom;" src="/static/img/logo_glow_small.png" /></a></h1>
                    </div>
                    <div class="col-7 menu">
                        <ul class="nav">
                            <li class="list-el list-el-hz"><a href="/">About</a></li>
                            <li class="active list-el list-el-hz"><a href="/blog">Blog / Events</a></li>
                            <li class="list-el list-el-hz">
                                <a href="#" class="dropdown-arrow">Open Source</a>
                            </li>
                        </ul>
                        <div class="dropdown tal">
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
                    </div>
                    <div cass="col-2 last">
                        <form class="uni-form mtl search" action="http://www.google.com/search">
                            <input type="hidden" name="sitesearch" value="uxebu.com">
                            <input type="hidden" name="domains" value="uxebu.com">
                            <input type="text" class="search-input mts" name="q" placeholder="Search...">
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="container">
    <div class="row">
