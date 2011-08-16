uxebu.com
=========

This is the node/markdown based HTML generator for uxebu.com  
Content is maintained through Markdown files which map to HMTL templates.

Building HTML
-------------

1. node build.js

    - Enable verbose mode

```javascript
node build.js -v
```


    - Enable debugging

```javascript
node build.js -d
```

    - Kick of the post processor:

```javascript
node build.js -p ./path/processor.js
```

2. Deployable content lies in ./release

Content editing
---------------

All content lies in the ./content directory.  
Make sure that you write the content as it is required by the containing box.

Template editing
----------------

Website templates are located in ./src
