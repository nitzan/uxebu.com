

!function(){
    dojo.require('dojo.NodeList-traverse');
    dojo.require('dojo.io.script');
    dojo.require("dojo.date");
    dojo.require("dojo.date.locale");
    dojo.require("dojox.widget.AutoRotator");
    dojo.require("dojox.widget.rotator.Fade");

    /* Helper */
    function formatDate(date){
        var today = new Date();
        var yesterday = dojo.date.add(today, "day", -1);
        var str;

        yesterday.setHours(23);
        yesterday.setMinutes(59);
        yesterday.setSeconds(59);

        if (date <= yesterday){
            str = dojo.date.locale.format(date);
        }else{
            var diff = dojo.date.difference(date, today, "minute"),
                diffObj;

            if (diff > 59){
                diff = Math.round(diff/60);
                diffObj = {
                    diff: "about " + diff,
                    unit: diff > 1 ? "hours" : "hour"
                }
            }else if (diff > 0){
                diffObj = {
                    diff: diff,
                    unit: diff > 1 ? "minutes" : "minute"
                }
            }else{
                diffObj = {
                    diff: "",
                    unit: "just a moment"
                }
            }
            str = diffObj.diff + " " + diffObj.unit + " ago";
        }
        return str;
    }

    /* Core */
    function initMenu(){
        var navAll = dojo.query('.dropdown-arrow, .dropdown');
        var navDropdown = dojo.query('.dropdown');
        var navMenu = navAll.parent();

        // Behaviour:
        //
        // 1. Mouse enters, menu opens
        // 2. Mouse leaves, menu closes
        // 3. If menu open and user clicks after first enter, it gets pinned
        // 4. If menu is pinned and user clicks it closes
        // 5. If menu is pinned and user leaves, it stays open
        // 6. If menu is pinned and user clicks outside it closes

        var pinned = false;

        function deactivate(){
            navDropdown.style('display', 'none');
            navMenu.removeClass('active');
        }

        navAll.connect('mouseover', function(){
            navDropdown.style('display', 'block');
            navMenu.addClass('active');
        }).connect('mouseout', function(){
            !pinned && deactivate();
        });

        navMenu.connect('click', function(e){
            e.stopPropagation();
            pinned = !pinned;
            !pinned && deactivate();
        });

        dojo.connect(dojo.body(), 'click', function(){
            pinned && deactivate();
            pinned = false;
        });
    }

    function initPage(){
        var pages = {
            team: initTeam,
            index: initIndex
        };

        var id = dojo.attr(dojo.body(), 'id');
        if (pages[id] && typeof pages[id] !== 'undefined'){
            pages[id]();
        }
    }

    function initIndex(){
        var p = dojo.query('.pane');
        var panes = p.map(function(pane){
            return {
                innerHTML: pane.outerHTML
            }
        });
        console.log(panes);
        var r = new dojox.widget.AutoRotator({
            duration: 5000,
            //panes: panes,
            transition: "dojox.widget.rotator.crossFade",
            suspendOnHover: true,
            pauseOnManualChange: true
        }, dojo.query('.trailer')[0]);

    }

    function initTeam(){
        var container = dojo.query('.tweets')[0];
        var user = dojo.attr(container, 'data-username');
        dojo.io.script.get({
            url: 'http://api.twitter.com/1/statuses/user_timeline.json?screen_name=' + user + '&count=10',
            jsonp: "callback",
            load: function(data){
                dojo.query('.loading', container).orphan();
                dojo.forEach(data, function(tweet){
                    dojo.place('<p>' + tweet.text.replace(/((ftp|http|https):\/\/(\S+))/, '<a href="$1" target="_blank">$1</a>') + '<br /><span class="font-small">' + formatDate(new Date(tweet.created_at)) + '</span>', container, 'last');
                });
            }
        });
    }

    dojo.ready(function(){
        initMenu();
        initPage();
    });
}();

