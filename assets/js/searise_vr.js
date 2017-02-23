/* some javascript for my searise test vr. mostly event handlers (tho isn't all javascript?). james goldie (rensa.co), feb 2017 */

// start_coogee2006:
//     - begin scene animations (inc. fading out start btn)
//     - disable start btn click
function start_coogee2006()
{
    console.log('Starting scene 1a (Coogee, 2006)');
    var sky = document.querySelector("#coogee2006-sky");
    var text = document.querySelector("#coogee2006-text");
    var start_btn = document.querySelector("#start-btn");

    // make sky and text visible before fading in
    sky.setAttribute('visible', 'true');
    text.setAttribute('visible', 'true');

    // start fading them in
    text.emit("coogeetour");
    sky.emit("coogeetour");

    // start fading button out and disable clicking it again
    start_btn.emit("coogeetour");
    start_btn.removeEventListener('click', start_coogee2006);
}

// register click event for start button
AFRAME.registerComponent('start-btn',
{
    init: function()
    {
        this.el.addEventListener('click', start_coogee2006);
    }
});

// start-btn-fadeout
AFRAME.registerComponent('start-btn-fadeout',
{
    init: function()
    {
        // stop rendering button once it fades out
        this.el.addEventListener('animationend', function()
        {
            document.querySelector("#start-btn").
                setAttribute('visible', 'false');
        });
    }
});