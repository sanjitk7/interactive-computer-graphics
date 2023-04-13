// Using a fixed object rotating to start with

const SomeGray = new Float32Array([0.09, 0.09, 0.09, 1])

// our initial plane shape
var land_plane =
    {"triangles":
        [[0,1,2]
        ,[2,3,0]
        ]
        // [[3,2,1],
        //  [2,3,0],
        //  [1,2,0],
        //  [0,3,1]
        // ]
    ,"attributes":
        {"position":
            [[-4.5,4.5,0.0]
            ,[ 4.5, 4.5,0.0]
            ,[4.5, -4.5, 0.0]
            ,[ -4.5,-4.5, 0.0]
            ],
            
            // [[-0.5,-0.5,-0.5]
            // ,[ 0.5, 0.5,-0.5]
            // ,[-0.5, 0.5, 0.5]
            // ,[ 0.5,-0.5, 0.5]
            // ]

            // "color" : [
            //     [0.0,1.0,0.0],
            //     [0.0,1.0,0.0],
            //     [0.0,1.0,0.0],
            //     [0.0,1.0,0.0]
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

    gl.uniform3fv(gl.getUniformLocation(program, 'lightdir'), normalize([2,2,-3]))
    gl.uniform4fv(gl.getUniformLocation(program, 'color'), SomeGray)
    gl.uniformMatrix4fv(gl.getUniformLocation(program, 'mv'), false, m4mul(v,m))
    gl.uniformMatrix4fv(gl.getUniformLocation(program, 'p'), false, p)
    gl.drawElements(geom.mode, geom.count, geom.type, 0)

}

/** Compute any time-varying or animated aspects of the scene */
function timeStep(milliseconds) {
    let seconds = milliseconds / 1000;
    
    // window.m = m4mul(m4rotY(seconds), m4rotX(-Math.PI/2))
    window.m = IdentityMatrix

    /*
    eye is moving around the plane
    camera is at origin
    normal has to be z to be looking at the plane from above
    */
    // window.v = m4view([1,1,3], [0,0,0], [0,1,0])
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
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    window.geom = setupGeomery(land_plane)
    fillScreen()
    window.addEventListener('resize', fillScreen)
    requestAnimationFrame(timeStep)
}


// call back that is called with the options object from the html file's form (buttons) - contains parameters to be used while creation and rendering of scene
async function setupScene(scene, options){
    console.log("setupScene called with: scene = ", scene, " ,options = ",options)
    
    // let monkey = await fetch('../playground3/monkey.json').then(res => res.json())

    // add surface normals to our polygon created
    addNormals(land_plane)
    window.geom = setupGeomery(land_plane)
    console.log(land_plane)
}

window.addEventListener('load',setup)