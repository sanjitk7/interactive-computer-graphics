
// trigger on radio button change
function radioChanged() {
    document.querySelector("canvas").style.backgroundColor = "white"
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

function resizeCanvas(){
    let c = document.getElementById("myCanvas")
    // c.width  = c.parentElement.clientWidth;
    // c.height  = c.parentElement.clientHeight;
    c.height = window.innerHeight
    c.width = window.innerWidth
    if (c.width<c.height){
        c.height = c.width
    } else {
        c.width = c.height
    }
}

// wait for all parts of the webpage to load and trigger graphics creation on radio button selection
window.addEventListener('load',(event)=>{
    resizeCanvas()
    document.querySelectorAll('input[name="example"]').forEach(elem => {
        elem.addEventListener('change', radioChanged)
    })
    // setup_logo()
    radioChanged()
})

