/* some javascript for my searise test vr. mostly event handlers (tho isn't all javascript?). james goldie (rensa.co), feb 2017 */

// register click event for start button
AFRAME.registerComponent('btn-coogee',
{
    init: function()
    {
        console.log('Coogee button component registered');
        this.el.addEventListener('click', btn_coogee_fadeout);
    }
});

// ani-btn-coogee: when it ends, start coogee scene up
AFRAME.registerComponent('ani-btn-coogee',
{
    init: function()
    {
        console.log('Coogee button animation component registered');
        // end fade out: turn off, start scene fade in
        this.el.addEventListener('animationend', function()
        {
            var sky = document.querySelector("#coogee2006-sky");
            var text = document.querySelector("#coogee2006-text");
            var start_btn = document.querySelector("#btn-coogee");
            
            console.log('Starting scene 1a (Coogee, 2006)');
            start_btn.setAttribute('visible', 'false');

            // make sky and text visible before fading in
            sky.setAttribute('visible', 'true');
            text.setAttribute('visible', 'true');
            text.emit("fadein");
            sky.emit("fadein");
        });
    }
});

// btn_coogee_fadeout: emit event for btn fadeout ani, turn off click listener
function btn_coogee_fadeout()
{
    console.log('Coogee button fading');
    var start_btn = document.querySelector("#btn-coogee");
    
    start_btn.emit("fadeout");
    start_btn.removeEventListener('click', btn_coogee_fadeout);
}