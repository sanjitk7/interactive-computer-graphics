
// trigger on radio button change
function radioChanged() {
    let chosen = document.querySelector('input[name="example"]:checked').value
    cancelAnimationFrame(window.pending)
    if (chosen == 1){
        setup_logo()
        window.pending = requestAnimationFrame(window['draw'+chosen])    
    } else if(chosen == 2){
        setup_warmup()
        window.pending = requestAnimationFrame(window["draw"+chosen])
    }
    // window.pending = requestAnimationFrame(window['draw'+chosen])
}

// wait for all parts of the webpage to load and trigger graphics creation on radio button selection
window.addEventListener('load',(event)=>{
    document.querySelectorAll('input[name="example"]').forEach(elem => {
        elem.addEventListener('change', radioChanged)
    })
    // setup_logo()
    radioChanged()
})