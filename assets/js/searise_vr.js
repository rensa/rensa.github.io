/* some javascript for my searise test vr. mostly event handlers (tho isn't all javascript?). james goldie (rensa.co), feb 2017 */

// register event handlers for start button
AFRAME.registerComponent('btn-coogee',
{
    init: function()
    {
        console.log('Coogee button component registered');
        this.el.addEventListener('animationbegin', btn_coogee_disable)
        this.el.addEventListener('animationcomplete', coogee2006_scene_start)
    }
});

/* event handler definitions ------------------------------------------------ */

function btn_coogee_disable()
{
    console.log('Coogee button disabled');
    document.querySelector("#btn-coogee").
        removeEventListener('click', btn_coogee_fadeout);
}

function coogee2006_scene_start()
{
    console.log('Starting scene 1a (Coogee, 2006)');
    var sky = document.querySelector("#coogee2006-sky");
    var text = document.querySelector("#coogee2006-text");
    var start_btn = document.querySelector("#btn-coogee");
    
    // stop rendering start button
    start_btn.setAttribute('visible', 'false');

    // make sky and text visible before fading in
    sky.setAttribute('visible', 'true');
    text.setAttribute('visible', 'true');
    sky.emit("fadein");
    setTimeout(function() { text.emit("fadein"); }, 2000)

    // nb: should be able to specify delay: 4000 in component, but it's
    // not working with startEvents for some reason :/
}