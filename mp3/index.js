// Using a fixed object rotating to start with

const FullBlack = new Float32Array([0.09, 0.09, 0.09, 1])

// our initial plane shape
var land_plane =
    {"triangles":
        [0,1,2
        ,2,3,0
        ]
    ,"attributes":
        {"position":
            [[-3.0,4.5,0.0]
            ,[ 3.0, 4.5,0.0]
            ,[3.0, -4.5, 0.0]
            ,[ -3.0,-4.5, 0.0]
            ]
            // [
            //     [-0.5, 0.5, 0.0],
            //     [0.5, 0.5, 0.0],
            //     [0.5, -0.5, 0.0],
            //     [-0.5, -0.5, 0.0],
            // ]
              
        }
    }

// drawing and setting up a basic shape


/** Draw one frame */
function draw() {
    gl.clearColor(...IlliniBlue) // f(...[1,2,3]) means f(1,2,3)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.useProgram(program)

    gl.bindVertexArray(geom.vao)

    gl.uniform4fv(gl.getUniformLocation(program, 'color'), FullBlack)
    gl.uniformMatrix4fv(gl.getUniformLocation(program, 'mv'), false, m4mul(v,m))
    gl.uniformMatrix4fv(gl.getUniformLocation(program, 'p'), false, p)
    gl.drawElements(geom.mode, geom.count, geom.type, 0)

}

/** Compute any time-varying or animated aspects of the scene */
function timeStep(milliseconds) {
    let seconds = milliseconds / 1000;
    
    window.m = IdentityMatrix

    /*
    eye is moving around the plane
    camera is at origin
    normal has to be z to be looking at the plane from above
    */
    window.v = m4view([Math.cos(seconds),Math.sin(seconds),3], [0,0,0], [0,0,1])

    draw()
    requestAnimationFrame(timeStep)
}

/** Resizes the canvas to completely fill the screen */
function fillScreen() {
    let canvas = document.querySelector('canvas')
    document.body.style.margin = '0'
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight
    canvas.style.width = ''
    canvas.style.height = ''
    if (window.gl) {
        gl.viewport(0,0, canvas.width, canvas.height)
        window.p = m4perspNegZ(0.1, 10, 2.2, canvas.width, canvas.height)
    }
}

/** Compile, link, set up geometry */
async function setup(event) {
    window.gl = document.querySelector('canvas').getContext('webgl2',
        // optional configuration object: see https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext
        {antialias: false, depth:true, preserveDrawingBuffer:true}
    )
    let vs = await fetch('shaders/mp3-vs.glsl').then(res => res.text())
    let fs = await fetch('shaders/mp3-fs.glsl').then(res => res.text())
    window.program = compileAndLinkGLSL(vs,fs)
    gl.enable(gl.DEPTH_TEST)
    window.geom = setupGeomery(land_plane)
    fillScreen()
    window.addEventListener('resize', fillScreen)
    requestAnimationFrame(timeStep)
}

window.addEventListener('load',setup)