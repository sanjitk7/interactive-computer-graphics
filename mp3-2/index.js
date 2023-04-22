// Using a fixed object rotating to start with

const SomeGray = new Float32Array([0.09, 0.09, 0.09, 1])

var useColorRamp = false
// our initial plane shape
var land_plane =
    {"triangles":
        [[0,1,2]
        ,[2,3,0]
        ]
    ,"attributes":
        {"position":
            [[-4.5,4.5,0.0]
            ,[ 4.5, 4.5,0.0]
            ,[4.5, -4.5, 0.0]
            ,[ -4.5,-4.5, 0.0]
            ],

        
              
        }
    }


// movement directions
window.x = 0.0
window.y = 0.0
window.z = 0.0


/** Draw one frame */
function draw() {
    gl.clearColor(...IlliniBlue) // f(...[1,2,3]) means f(1,2,3)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.useProgram(program)

    gl.bindVertexArray(geom.vao)

    // do diffuse lighting by default and specular if chosen

    let lightdir =  normalize([1,1,-2])
    let halfway = normalize(add(lightdir, [0,0,1]))

    gl.uniform3fv(gl.getUniformLocation(program, 'lightdir'), lightdir) // light dir
    gl.uniform3fv(gl.getUniformLocation(program, 'halfway'), halfway)
    gl.uniform3fv(gl.getUniformLocation(program, 'lightcolor'), [1,1,1]) // white light
    gl.uniform4fv(gl.getUniformLocation(program, 'color'), SomeGray)

    gl.uniform1i(gl.getUniformLocation(program, 'image'), 0)

    gl.uniformMatrix4fv(gl.getUniformLocation(program, 'mv'), false, m4mul(v,m))
    gl.uniformMatrix4fv(gl.getUniformLocation(program, 'p'), false, p)
    gl.drawElements(geom.mode, geom.count, geom.type, 0)

}

/** Compute any time-varying or animated aspects of the scene */
function timeStep(milliseconds) {
    let seconds = milliseconds / 1000;
    
    // window.m = m4mul(m4rotY(seconds/2), m4rotX(-Math.PI/2))
    // window.m = m4mul(m4rotY(seconds/2), m4rotX(seconds))
    // window.v = IdentityMatrix

    // console.log("KEY PRESS:", keysBeingPressed)

    if (keysBeingPressed["w"]){
        console.log("move one step forward!")
        window.z += 0.1
    } else if (keysBeingPressed["s"]){
        console.log("move one step backward!")
        window.z -= 0.1
    } else if (keysBeingPressed["a"]){
        window.x += 0.1
        console.log("move one step to the left!")
    } else if (keysBeingPressed["d"]){
        window.x -= 0.1
        console.log("move one step to the right!")
    }

    window.v = m4view([2,-5,5], [0,0,0], [0,1,0])

    window.v = m4mul(
        m4trans(window.x, window.y, window.z),
        m4view([2,-5,5], [0,0,0], [0,1,0])
    )

    draw()
    requestAnimationFrame(timeStep)
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
    
    // do terrain setup

    slices = 100
    resolution = 50
    window.m = m4rotY(0.4)
    // window.v = m4view([2,-5,5], [0,0,0], [0,1,0])

    land_plane_with_grid = computeTerrainGridTriangles(5, resolution)
    land_plane_with_faults = createRandomFaults(5, slices, land_plane_with_grid)
    // let monkey = await fetch('../playground3/monkey.json').then(res => res.json())

    // add surface normals to our polygon created for diffuse lighting 
    addNormals(land_plane_with_faults)


    // texture
    let img = new Image();
    img.src = "texture.jpeg";
    img.addEventListener("load", (event) => {
        setUpImage(img, 0, gl);
    });


    // add texture coordinates
    addTexture(land_plane_with_faults)
    // console.log()

    window.geom = setupGeomery(land_plane_with_faults)
    // window.geom = setupGeomery(land_plane)
    fillScreen()
    window.addEventListener('resize', fillScreen)
    requestAnimationFrame(timeStep)
}


window.addEventListener('load',setup)