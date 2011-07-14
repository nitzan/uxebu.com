/* ex: set tabstop=4 expandtab: */

var md = require('markdown').markdown;
var http = require('http');

function _prepareBlock(block){
    // still unused
    var obj = {
        h1: [""],
        ul: []
    }
}

exports.trailerBox = function(block, callb){
    // Summary:
    //      This is a special box, that we use as the trailer at the top of the site
    //      it can contain multiple things, separated by an <hr>, which is a * * * in markdown.
    //      The content can be:
    //      * two lined text, whcih will be shown as a big header
    //      * any markup, like '<iframe...>', it has to start with "<" then it
    //        is injected as pure HTML, that is best used for including iframes, script tags, etc
    //
    // Markdown:
    //      Sample markup:
    //
    //      Trailer                                     | Required but ignored
    //      =======                                     |
    //                                                  |
    //      WE BRING YOUR WEB APPS                      | Optional, this has to be a two line text
    //      TO ANY APP STORE IN THE WORLD.              |
    //                                                  |
    //      * * *                                       | A required separator if you have multiple blocks as shown here
    //                                                  |
    //      <iframe src="http://mario.qfox.nl/">        | raw markup to embed
    //          Your Browser does not support iframes.  |
    //          Please update to Internet Explorer 4!   |
    //      </iframe>                                   |
    //                                                  |
    //      * * *                                       | A required separator if you have multiple blocks as shown here
    //                                                  |
    //      WE BRING YOUR WEB APPS                      | Optional, this has to be a two line text
    //      TO ANY APP STORE IN THE WORLD.              |
    //
    // Returns:
    //      title:
    //      content:
    //      link:
    var view = {};
    // [ 'h1', 'TEXT' ]
    view.title = block.shift()[1]; // Remove the first element which is the title.
    var items = view.items = [];
    do{
        var el = block.shift();
        if (el[0]=='hr') continue;
        if (el[1].substr(0,1)=="<"){
            items.push({iframe:el[1]});
        } else {
            // todo check
            var lines = el[1].split("\n");
            items.push({twoLineText:true, one:lines[0], two:lines[1]});
        }
    } while(block.length);

    callb && callb(view);
};

exports.simpleBox = function(block, callb){
    // Summary:
    //      This is a simple textbox which renders a title, text
    //      and an optional link at the bottom.
    //
    // Markdown:
    //      Sample markup:
    //
    //      Title                       | Required
    //      =====                       |
    //                                  |
    //      Some text.                  | Required [+1, at least one]
    //                                  |
    //      [Link](http://uxebu.com)    | Optional, if available as last item.
    //
    // Returns:
    //      title:
    //      content:
    //      link:
    //      linkContent:

    var view = {};
    // [ 'h1', 'TEXT' ]
    view.title = block.shift()[1]; // Remove the first element which is the title.
    if (block[block.length-1][1][0]=='a'){ // [ 'p', [ 'a', {href: ''}, 'TEXT' ] ] ]
        var link = block.pop();
        // [ 'p', [ 'a', {href: ''}, 'TEXT' ] ] ]
        view.link = link[1][1].href;
        view.linkContent = link[1][2];
    }
    view.content = block.map(function(i){return md.renderJsonML(["html", i]);}).join(" ");

    callb && callb(view);
};

exports.listBox = function(block, callb){
    // Summary:
    //      This box renders a title and a list of content.
    //      The li item is split into two parts: header and text.
    //
    // Markdown:
    //      Sample markup:
    //
    //      Client Projects                                         | Required header
    //      ===============                                         |
    //                                                              |
    //      * Woodwing reader                                       | The list of items, where the
    //        Universal tablet pub.                                 | first line gets rendered into "list.header"
    //      * Civiguard                                             | and the second line into "list.text"
    //        Mobile App for disaster/crisi management.             |
    //      * Vodafone                                              |
    //        Mobile cross-platform approach through widgets.       |

    var view = {};
    view.title = block.shift()[1]; // Remove the first element which is the title.
    // Now we expect a "ul"
    // We take all the "li"s and pass them separately into the list-array that we iterate over in the tpl.
    view.list = block[0].slice(1).map(function(i){
        var split = i[1].split("\n");
        return {header:split[0], text:split[1]};
    });

    callb && callb(view);
};

exports.imageBox = function(block, callb){
    // Summary:
    //      This box renders a image, title, subtitle and link to a related url.
    //
    // Markdown:
    //      Sample markup:
    //
    //      * [Tobias von Klipstein](team/klipstein.html)               | Required
    //        Cofounder                                                 | Subtitle
    //        ![Tobias von Klipstein](media/img/team/klipstein.png)     | Related url
    //                                                                  |
    //      * [Wolfram Kriesing](team/kriesing.html)                    |
    //        Cofounder                                                 |
    //        ![Alttext](media/img/team/kriesing.png)                   |
    //
    // Returns:
    //      {
    //          title:
    //          imgSrc:
    //          subtitle:
    //          profileUrl:
    //      }

    var view = {};
    // [ 'h1', 'TEXT' ]
    view.title = block.shift()[1]; // Remove the first element which is the title.
    view.list = block[0].slice(1).map(function(i){
        var item;
        if (i[1][0] == 'p'){
            item = i[1].slice(1);
        }else if(i[1][0] == 'a'){
            item = i.slice(1);
        }else{
            console.log("Error: Content for imageBox is invalid! Please stick to following markup:\n\n[Name][link]\nTitle\n![Image Alt](imagelink)\n");
        }

        return {
            title: item[0][2].replace('\n', '', "gm"),
            imgSrc: item[2][1].src,
            subtitle: item[1],
            profileUrl: item[0][1].href
        }
    });
    callb && callb(view);
};

exports.profileBox = function(block, callb){
    // Summary:
    //      A box which displays user profile information such as name, subtitle,
    //      image, content
    //
    // Markdown:
    //      Sample markup:
    //
    //      Nikolai Onken                                   | Required (or undefined)
    //      =============                                   |
    //                                                      |
    //      Co-Founder                                      | Required (or undefined)
    //      ----------                                      |
    //                                                      |
    //      [Nikolai Onken](/media/img/team/onken.png)      | Required (or undefined)
    //                                                      |
    //      Blah blup.                                      | Required (or undefined)
    //
    //      Special Moves
    //      -------------
    //
    //      * Blah
    //      * Blup
    //
    // Returns:
    //      {
    //          title:
    //          subtitle:
    //          imgSrc:
    //          text:
    //      }

    var view = {
        title: block.shift()[1],
        subTitle: block.shift()[1],
        imgSrc: block.shift()[1][1].href,
        text: md.toHTML(['html'].concat(block))
    };

    callb && callb(view);
};

exports.twitterBox = function(block, callb){
    // Summary:
    //      This is a box which displays tweets of a certain user
    //
    // Markdown:
    //      Sample markup:
    //
    //      Twitter: @uxebu                                    | Required
    //      ===============
    //
    // Returns:
    //      {
    //          username:
    //          tweets:
    //      }

    var view = {};

    // 1. Getting twitter username from h1
    var username = block.shift()[1].split(':')[1] || 'uxebu';
    username = username.replace('@', '').trim();
    var options = {
        host: 'api.twitter.com',
        port: 80,
        path: '/1/statuses/user_timeline.json?include_rts=true&screen_name='+username+'&count=10',
        method: 'GET'
    };

    var returnData = '';
    var req = http.request(options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function(chunk){
            returnData += chunk;
        });
        res.on('end', function(){
            callb && callb({
                username: username,
                tweets: JSON.parse(returnData)
            })
        });
    });
    req.end();
}

exports.contactBox = function(block, callb){
    // Summary:
    //      This is a box which displays contact information such as email, twitter
    //      or linkedin
    //
    // Markdown:
    //      Sample markup:
    //
    //      Contact                                            | Required
    //      =======                                            |
    //                                                         |
    //      * [email](mailto:contact@uxebu.com)
    //        contact@uxebu.com
    //
    //      * [github](http://github.com/uxebu)
    //        GitHub
    //
    //      * [linkedin](http://www.linkedin.com/in/uxebu)
    //        LinkedIn
    //
    // Returns:
    //      [{
    //          type:
    //          content:
    //          href:
    //      }]

    block.shift();
    block = block[0].slice(1);
    var contact = [];
    block.forEach(function(item){
        contact.push({
            type: item[1][1][2],
            content: item[1][2],
            href: item[1][1][1].href
        });
    });

    callb && callb({
        contact: contact
    });
}

for (var func in exports){
    var lines = exports[func].toString().split("\n").slice(1);
    var docString = [];
    var line = lines.shift().match(/^\s*\/\/(.*)/);
    while (line){
        docString.push("   "+line[1]);
        line = lines.shift().match(/^\s*\/\/(.*)/);
    }
    exports[func].__docs__ = docString.join("\n");
}
