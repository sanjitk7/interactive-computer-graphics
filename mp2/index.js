
const initMatrix = new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1])

// trigger on radio button change - calls a different graphic by initialising a different set of shader programs
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
    else if(chosen == 3){
        setup_cpu()
        window.pending = requestAnimationFrame(window["draw"+chosen])
    } else if (chosen == 4){
        setup_gpu()
        window.pending = requestAnimationFrame(window["draw"+chosen])
    }
    window.pending = requestAnimationFrame(window['draw'+chosen])
}

// resize the canvas for better visibility of the animation
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

