/* some javascript for my searise test vr. mostly event handlers (tho isn't all javascript?). james goldie (rensa.co), feb 2017 */

AFRAME.registerComponent('coogee-text', {
  
  // emit text events when the scene is initialised
  init: function () {
    console.log('Initialising text element')
    this.el.emit('start-tour');
  }
});