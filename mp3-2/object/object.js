var OBJLoad = false


/** Compile, link, set up geometry */
async function setup_object(event) {
    console.log("Object Setup")



    // HANDLE OBJECT FILE IF IT EXISTS ELSE DO NOTHING
    
    // object loading and parse text to geom structure
    // let textTriangle = await fetch("objectFiles/triangle.obj").then((res) => res.text()).catch((e)=>console.log("object load failed!"));
    // let textCube = await fetch("objectFiles/cube.obj").then((res) => res.text()).catch((e)=>console.log("object load failed!"));
    // let textCow = await fetch("objectFiles/cow.obj").then((res) => res.text()).catch((e)=>console.log("object load failed!"));
    // let textMonkey = await fetch("objectFiles/suzanne.obj").then((res) => res.text()).catch((e)=>console.log("object load failed!"));
    // let textTeapot = await fetch("objectFiles/teapot.obj").then((res) => res.text()).catch((e)=>console.log("object load failed!"));
    
    let textExampleObject = await fetch("example.obj").then((res) => res.text()).catch((e)=>console.log("object load failed!"));
    let textureObjectImageName = "example"

    // custom file definition check
    customObjectFileName = window.location.hash.substr(1)

    if (customObjectFileName !== "") {
        // console.log("Loading custom file ",customObjectFileName, "instead of example.obj")
        textExampleObject = await fetch("objectFiles/"+customObjectFileName).then((res) => res.text()).catch((e)=>console.log("object load failed!"));
        textureObjectImageName = customObjectFileName.slice(0,-4)
    }



    // set variables that decide which shader to use
    if (textExampleObject.includes("vt")){
        console.log("YES TEXTURE in selected object")
        use_texture_obj = true
    } else {
        console.log("NO TEXTURE in selected object")
    }
    if (checkObjHasColor(textExampleObject)){
        console.log("YES COLOR in selected object")
        use_color_obj = true
    } else {
        console.log("NO COLOR in selected object")
    }

    
    // select shader
    window.glObj = document.querySelector('canvas').getContext('webgl2',
        // optional configuration object: see https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext
        {antialias: false, depth:true, preserveDrawingBuffer:true}
    )

    // color is an extra attribute since in the original terrain MP3 i set a single manually def color in the shaders (but normals were handled)
    // here i define normals for objects if they arent defined in the OBJ - so no separate shader for them (all shaders handle normals)
    
    
    // for suzanne.obj
    if (use_texture_obj){
        console.log("texture shader")
        let vs = await fetch('shaders/mp3-obj-vs-3.glsl').then(res => res.text())
        let fs = await fetch('shaders/mp3-obj-fs-3.glsl').then(res => res.text())
        window.programObj = compileAndLinkGLSL(glObj, vs,fs)
        
        // console.log("using texture image from 00 ",textureObjectImageName)
        // texture set up
        let imgObj = new Image()
        imgObj.src = textureObjectImageName + ".jpg"
        imgObj.addEventListener("load",(event)=>{
            setUpImage(imgObj, 0, glObj);
        })

    } else if (!use_color_obj) { // for triangle.obj and teapot.obj
        console.log("no color tex shader")
        let vs = await fetch('shaders/mp3-obj-vs-1.glsl').then(res => res.text())
        let fs = await fetch('shaders/mp3-obj-fs-1.glsl').then(res => res.text())
        window.programObj = compileAndLinkGLSL(glObj, vs,fs)
    } else if (use_color_obj){ // for cow.obj
        console.log("color shader")
        let vs = await fetch('shaders/mp3-obj-vs-2.glsl').then(res => res.text())
        let fs = await fetch('shaders/mp3-obj-fs-2.glsl').then(res => res.text())
        window.programObj = compileAndLinkGLSL(glObj, vs,fs)
    }

    
    glObj.enable(glObj.DEPTH_TEST)
    glObj.enable(glObj.BLEND)
    glObj.blendFunc(glObj.SRC_ALPHA, glObj.ONE_MINUS_SRC_ALPHA)
    


    console.log("using texture image from ",textureObjectImageName)
    // // texture for example 
    // let imgObj = new Image()
    // imgObj.src = textureObjectImageName + ".jpg"
    // imgObj.addEventListener("load",(event)=>{
    //     setUpImage(imgObj, 0, glObj);
    // })


    window.objGeom = await objectToGeom(textExampleObject)
    



    window.geomObj = setupGeomeryObj(objGeom)
    OBJLoad = true
    // console.log("window.geomObj",window.geomObj)
    
    fillScreen()
    window.addEventListener('resize', fillScreen)
    requestAnimationFrame(timeStep)
}


window.addEventListener('load',setup_object)