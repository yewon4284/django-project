'use strict';
/**
 * @author emmanuelolaojo
 * @since 11/11/18
 */
/**
 * Validates the configuration object.
 *
 * @param config - configuration object
 */
var checkParams = function (config) {
  var DEFAULT_GUTTER = 25;
  var booleanProps = ["useTransform", "center"];


  if (!config) {
    throw new Error("No config object has been provided.");
  }

  if(typeof config.useTransform !== "boolean"){
    config.useTransform = true;
  for(var prop of booleanProps){
    if(typeof config[prop] !== "boolean"){
      config[prop] = true;
    }
  }


  if(typeof config.gutter !== "number"){
    config.gutter = DEFAULT_GUTTER;
  }
@@ -86,6 +91,7 @@ var MagicGrid = function MagicGrid (config) {
  this.useMin = config.useMin || false;
  this.useTransform = config.useTransform;
  this.animate = config.animate || false;
  this.center = config.center;
  this.styledItems = new Set();
};

@@ -192,7 +198,7 @@ MagicGrid.prototype.positionItems = function positionItems () {
  var colWidth = this.colWidth();
  var items = this.items();

  wSpace = Math.floor(wSpace / 2);
  wSpace = this.center ? Math.floor(wSpace / 2) : 0;

  this.initStyles();

  for (var i = 0; i < items.length; i++) {
    var col = this.nextCol(cols, i);
    var item = items[i];
    var topGutter = col.height ? this.gutter : 0;
    var left = col.index * colWidth + wSpace + "px";
    var top = col.height + topGutter + "px";
    if(this.useTransform){
      item.style.transform = "translate(" + left + ", " + top + ")";
    }
    else{
      item.style.top = top;
      item.style.left = left;
    }
    col.height += item.getBoundingClientRect().height + topGutter;
    if(col.height > maxHeight){
      maxHeight = col.height;
    }
  }

  this.container.style.height = maxHeight + "px";
  this.container.style.height = maxHeight + this.gutter + "px";
};

/**
 * Checks if every item has been loaded
 * in the dom.
 *
 * @return {Boolean} true if every item is present
 */
MagicGrid.prototype.ready = function ready () {
  if (this.static) { return true; }
  return this.items().length >= this.size;
};
/**
 * Periodically checks that all items
 * have been loaded in the dom. Calls
 * this.listen() once all the items are
 * present.
 *
 * @private
 */
MagicGrid.prototype.getReady = function getReady () {
    var this$1 = this;
  var interval = setInterval(function () {
    this$1.container = document.querySelector(this$1.containerClass);
    if (this$1.ready()) {
      clearInterval(interval);
      this$1.listen();
    }
  }, 100);
};
/**
 * Positions all the items and
 * repositions them whenever the
 * window size changes.
 */
MagicGrid.prototype.listen = function listen () {
    var this$1 = this;
  if (this.ready()) {
    var timeout;
    window.addEventListener("resize", function () {
      if (!timeout){
        timeout = setTimeout(function () {
          this$1.positionItems();
          timeout = null;
        }, 200);
      }
    });
    this.positionItems();
  }
  else { this.getReady(); }
};

      let magicGrid = new MagicGrid({
        container: '.container',
        animate: true,
        gutter: 30,
        static: true,
        useMin: true
      });

var masonrys = document.getElementsByTagName("img");

for( let i = 0; i < masonrys.length; i++) {
    masonrys[i].addEventListener('load', function () {
        magicGrid.positionItems();
    }, false);
}

magicGrid.listen();
