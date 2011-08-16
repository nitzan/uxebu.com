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

2. Deployable content lies in ./release

Content editing
---------------

All content lies in the ./content directory.  
Make sure that you write the content as it is required by the containing box.

Template editing
----------------

Website templates are located in ./src
