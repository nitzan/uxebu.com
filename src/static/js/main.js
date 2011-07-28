!function(){
    dojo.require('dojo.NodeList-traverse');
    dojo.require('dojo.io.script');
    dojo.require("dojo.date");
    dojo.require("dojo.date.locale");

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
                };
            }else if (diff > 0){
                diffObj = {
                    diff: diff,
                    unit: diff > 1 ? "minutes" : "minute"
                };
            }else{
                diffObj = {
                    diff: "",
                    unit: "just a moment"
                };
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
            };
        });

        // Math.max.apply( Math, [1, 4, 3, 23] ); would be nice :)
        var h = 0; // maxHeight
        var o; // offsetHeight
        var trailerStatus = dojo.query('.trailer-status');
        var statusNode = document.createElement('div');
        p.forEach(function(node){
            dojo.style(node, {
                position: 'absolute',
                left: '0px',
                top: '0px',
                display: 'block'
            });
            o = node.offsetHeight;
            h = o > h ? o : h;

            // Append indicator to trailer-status
            trailerStatus[0].appendChild(statusNode.cloneNode(false));
        });
        p.parent().style('height', h +'px');

        trailerStatus.connect('onclick', function(e){
            if (e.target.parentNode == trailerStatus[0]){
                showTrailerNode(dojo.indexOf(trailerStatus[0].childNodes, e.target));
                clearInterval(intv);
            }
        });

        var index = currentIndex = 0;
        var statusNodes = trailerStatus.children();
        showTrailerNode(index);
        var intv = setInterval(function(){
            index = p[++index] ? index : 0;
            showTrailerNode(index);
        }, 5000);

        function showTrailerNode(index){
            dojo.removeClass(statusNodes[currentIndex], 'active');
            dojo.removeClass(p[currentIndex], 'visible');
            dojo.addClass(statusNodes[index], 'active');
            dojo.addClass(p[index], 'visible');
            currentIndex = index;
        }

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


