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
    //      WE BRING YOUR WEB APPS                      | Optional, this has to be a two line text and can include links
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
    var ops = Object.prototype.toString;
    do{
        var el = block.shift();
        if (el[0]=='hr') continue;

        // This transform is a bit tricky, lets walk through all steps:
        // 1. A trailer box can consist of two lines of text or an iframe
        // 2. Lines are determined by the existance of a \n
        // 3. Each line can consist of text or other markdown enriched text (e.g. links)
        el.shift();
        if (ops.call(el[0]) == '[object String]' && el[0].substr(0,1)=="<"){ // iframe, no newlines allowed here
            items.push({iframe:el[0]});
        } else {
            var l = { 0: '', 1: ''}, cnt = 0;
            el.forEach(function(item){
                if (ops.call(item) == '[object String]'){
                    var lines = item.split('\n');
                    l[cnt] += lines[0];
                    // Line can be empty in case that \n is at the end
                    // so we do the typeof check.
                    if (typeof lines[1] !== 'undefined'){
                        cnt = 1;
                        l[cnt] += lines[1];
                    }
                }else{
                    // We only support links atm.!
                    if (item[0] == 'a'){
                        l[cnt] += md.toHTML(['html', item]);
                        // Links can have a \n at their contents end which means that the next element
                        // has to be on line 2. We increment cnt to one to set correct object property accessor
                        var lines = item[2].split('\n');
                        if (lines[1]){
                            cnt = 1;
                        }
                    }else{
                        console.log("Error: Content for trailerBox is invalid! Please only use text and/or links");
                    }
                }
            });
            items.push({twoLineText:true, one:l[0], two:l[1]});
        }
    } while(block.length);
    return view;
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

    return view;
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
    //        Mobile App for disaster/crisi management.             | the second line can contain a link
    //      * Vodafone                                              |
    //        Mobile cross-platform approach through widgets.       |

    var view = {
        title: block.shift()[1] // Remove the first element which is the title.
    };
    var ops = Object.prototype.toString;
    // Now we expect a "ul"
    // We take all the "li"s and pass them separately into the list-array that we iterate over in the tpl.
    view.list = block[0].slice(1).map(function(i){
        i.shift(); // Remove first element which is 'li'
        var l = { 0: '', 1: ''}, cnt = 0;
        i.forEach(function(item){
            if (ops.call(item) == '[object String]'){
                var lines = item.split('\n');
                l[cnt] += lines[0];
                // Line can be empty in case that \n is at the end
                // so we do the typeof check.
                if (typeof lines[1] !== 'undefined'){
                    cnt = 1;
                    l[cnt] += lines[1];
                }
            }else{
                // We only support links atm.!
                if (item[0] == 'a'){
                    l[cnt] += md.toHTML(['html', item]);
                    // Links can have a \n at their contents end which means that the next element
                    // has to be on line 2. We increment cnt to one to set correct object property accessor
                    var lines = item[2].split('\n');
                    if (lines[1]){
                        cnt = 1;
                    }
                }else{
                    console.log("Error: Content for trailerBox is invalid! Please only use text and/or links");
                }
            }
        });
        return {header:l[0], text:l[1]};
    });

    return view;
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
    return view;
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

    return {
        title: block.shift()[1],
        subTitle: block.shift()[1],
        imgSrc: block.shift()[1][1].href,
        text: md.toHTML(['html'].concat(block))
    };
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

    return {
        username: username
    };
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
    //      * [email](mailto:contact@uxebu.com)                | email: CSS class, mailto:...: link
    //        contact@uxebu.com                                | contact@uxebu.com: displayed text
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

    return {
        contact: contact
    };
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
