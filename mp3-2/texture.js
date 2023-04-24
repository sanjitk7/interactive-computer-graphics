// from lecture examples and textures page
function setUpImage(imageObject, slot, glx) {
    let texture = glx.createTexture();
    glx.activeTexture(glx.TEXTURE0 + slot);
    glx.bindTexture(glx.TEXTURE_2D, texture);
    // glx.texParameteri(glx.TEXTURE_2D, glx.TEXTURE_WRAP_S, glx.REPEAT);
    glx.texParameteri(glx.TEXTURE_2D, glx.TEXTURE_WRAP_T, glx.REPEAT);
    glx.texParameteri(glx.TEXTURE_2D, glx.TEXTURE_MIN_FILTER, glx.LINEAR_MIPMAP_LINEAR);
    glx.texParameteri(glx.TEXTURE_2D, glx.TEXTURE_MAG_FILTER, glx.LINEAR);
    glx.texImage2D(
        glx.TEXTURE_2D,
        0,
        glx.RGBA,
        glx.RGBA,
        glx.UNSIGNED_BYTE,
        imageObject, 
    );
    glx.generateMipmap(glx.TEXTURE_2D)
}

// similar to addNormals function - adds texture to our object geom of terrain as an attribute
function addTexture(grid){
    console.log("addTexture")
    grid.attributes.texture = []
    let texCoordinates = new Array(grid.attributes.position.length)
    for(let i=0; i<grid.attributes.position.length; i+=1) 
        texCoordinates[i] = [grid.attributes.position[i][0], grid.attributes.position[i][1]]
        grid.attributes.texture = texCoordinates;
}