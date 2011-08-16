uxebu.com
=========

This is the node/markdown based HTML generator for uxebu.com  
Content is maintained through Markdown files which map to HMTL templates.

How to build a new site
-----------------------

**building**

```javascript
node build.js
```

**verbose mode**

```javascript
node build.js -v
```


**debugging mode**

```javascript
node build.js -d
```

**kicking of the post processor**

```javascript
node build.js -p ./path/processor.js
```

All deployable content lies in ./release

Content editing
---------------

All content lies in the ./content directory.
Within your Markdown document, blocks which get passed to different content handlers have to be seperated by h1 headers:

```markdown
This is block one
=================

Some text of block one

This is block two
=================

Some text of block two.
```

Make sure that you write the content as it is required by the containing box.

Template editing
----------------

Website templates are located in ./src and can use the Mustache template syntax.
To achieve mapping of markdown blocks to template blocks you have to let the build tool know that a certain Mustache block should map to a Markdown block:

```html
{{#block0}}
{{!simpleBox}}
<div class="col-6 last">
    <h2 class="h3 line business mbx">{{title}}</h2>
    {{{content}}}
    <div class="ft">
        <p><a href="{{link}}" class="alternative">{{{linkContent}}}</a></p>
    </div>
</div>
{{/block0}}
```

The block number maps directly to the position of the block in the Markdown definition (this might be confusing and prune to errors but so far we have not found a better solution)
In the example above for instance we want to use the simpleBox renderer which returns an object with a title, content, link and linkContent properties.
The corresponding Markdown content in this case looks like following:

```markdown
Address & Phone
===============

uxebu was founded in 2008 and based in Munich, Amsterdam and Palo Alto

**uxebu Consulting Ltd. & Co. KG**  
Richard-Strauss-Str. 21  
81677 München  
Germany

**Phone: [+49 89 122 219 626](tel:+4989122219626)**  
Fax: +49 89 122 219 626 - 8  
E-Mail: [contact @ uxebu.com](mailto:%63%6F%6E%74%61%63%74%40%75%78%65%62%75%2E%63%6F%6D)

[Impressum / Legal](/legal.html)
```

Mapping of Markdown and HTML templates
--------------------------------------

Per default each Markdown file in the content directory must map to a HTML template with the same base name (e.g. home.md -> home.html)
If this constrain is making life too hard you can optionally define mapping of one HTML template to several Markdown files in a directory.
To do so, adjust the mapping property of the exports object in appConfig.js

```javascript
var mapping = exports.mapping = {
    'team': '/team'
};
```

This would now result in the team.html file in the src directory to be the template for all Markdown files within the team directory in the content directory.
