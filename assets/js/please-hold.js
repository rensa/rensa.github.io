/* custom js to support the please hold web app
   james goldie, august 2016
*/

/* possible localstorage contents:
    - start: Call, Visit, Something else

/* i need event handlers for each button! most of them will just:
    - record the result in local html storage,
    - hide the current question block, and
    - show the next question block.
   the save button will:
    - save the notes, and the previous html storage data, in a csv array, and
    - show a 'return to start' block, and
    - update the history section at the bottom
*/

/* event handler functions for quiz buttons. these switch the question block
   and record the answer to local storage. a few grab a number of minutes from
   the adjacent text input */

function click_ph_start_call()
{
    document.getElementById('ph-start').style.display = 'none'
    document.getElementById('ph-call-startdt').style.display = 'block'
    localStorage.setItem('start', 'Call')
}

function click_ph_call_startdt_now()
{
    document.getElementById('ph-call-startdt').style.display = 'none'
    document.getElementById('ph-call-pickup').style.display = 'block'
    
    // TODO - get the current time and save it to storage
    // localStorage.setItem('startdt', )
}

function click_ph_start_visit()
{
    document.getElementById('ph-start').style.display = 'none'
    document.getElementById('ph-visit-startdt').style.display = 'block'
    localStorage.setItem('start', 'Visit')
}

function click_ph_start_call()
{
    document.getElementById('ph-start').style.display = 'none'
    document.getElementById('ph-sthelse-startdt').style.display = 'block'
    localStorage.setItem('start', 'Something Else')
}

/* attach the event listeners */
document.getElementById('ph-start-call').
    addEventListener('click', click_ph_start_call)
// TODO - attach more event listeners

/* onload: if localstorage check clears, find the right block to start with */

document.getElementById('ph-start').style.display = 'block'