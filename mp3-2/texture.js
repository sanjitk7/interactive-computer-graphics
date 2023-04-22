function setUpImage(imageObject, slot, glx) {
    let texture = glx.createTexture();
    glx.activeTexture(glx.TEXTURE0 + slot);
    glx.bindTexture(glx.TEXTURE_2D, texture);
    glx.texParameteri(glx.TEXTURE_2D, glx.TEXTURE_WRAP_S, glx.REPEAT);
    glx.texParameteri(glx.TEXTURE_2D, glx.TEXTURE_WRAP_T, glx.REPEAT);
    glx.texParameteri(glx.TEXTURE_2D, glx.TEXTURE_MIN_FILTER, glx.LINEAR_MIPMAP_LINEAR);
    glx.texParameteri(glx.TEXTURE_2D, glx.TEXTURE_MAG_FILTER, glx.LINEAR);
    glx.texImage2D(
        glx.TEXTURE_2D, // destination slot
        0, // no mipmapping
        glx.RGBA, // how to store it in graphics memory
        glx.RGBA, // how it is stored in the image object
        glx.UNSIGNED_BYTE, // size of a singlxe pixel-color in HTML
        imageObject, // source data
    );
    glx.generateMipmap(glx.TEXTURE_2D)
}

function addTexture(grid){
    console.log("addTexture")
    grid.attributes.texture = []
    let tex = new Array(grid.attributes.position.length)
    for(let i=0; i<grid.attributes.position.length; i+=1) 
        tex[i] = [grid.attributes.position[i][0], grid.attributes.position[i][1]]
        grid.attributes.texture = tex;
}