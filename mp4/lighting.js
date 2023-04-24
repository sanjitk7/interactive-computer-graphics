// adding normals for diffuse lighting
function addNormals(geom) {

    // console.log("geom addNormal: ", geom)
    geom.attributes.normal = []
    for(let i=0; i<geom.attributes.position.length; i+=1) {
        geom.attributes.normal.push([0,0,0])
    }
    for(let i=0; i<geom.triangles.length; i+=1) {
        let tri = geom.triangles[i]
        let p0 = geom.attributes.position[tri[0]]
        let p1 = geom.attributes.position[tri[1]]
        let p2 = geom.attributes.position[tri[2]]
        // console.log(p0,p1,p2)
        let e1 = sub(p1,p0)
        let e2 = sub(p2,p0)
        let n = cross(e1,e2)
        geom.attributes.normal[tri[0]] = add(geom.attributes.normal[tri[0]], n)
        geom.attributes.normal[tri[1]] = add(geom.attributes.normal[tri[1]], n)
        geom.attributes.normal[tri[2]] = add(geom.attributes.normal[tri[2]], n)
    }
    for(let i=0; i<geom.attributes.position.length; i+=1) {
        geom.attributes.normal[i] = normalize(geom.attributes.normal[i] )
    }
    
}