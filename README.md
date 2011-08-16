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
Make sure that you write the content as it is required by the containing box.

Template editing
----------------

Website templates are located in ./src

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
