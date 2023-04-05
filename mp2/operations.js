
// This file contains functions provided in the course material while describing the operations

const m4trans = (dx,dy,dz) => new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, dx,dy,dz,1])
const m4rotX = (ang) => { // around x axis
    let c = Math.cos(ang), s = Math.sin(ang);
    return new Float32Array([1,0,0,0, 0,c,s,0, 0,-s,c,0, 0,0,0,1]);
  }
const m4rotY = (ang) => { // around y axis
let c = Math.cos(ang), s = Math.sin(ang);
return new Float32Array([c,0,-s,0, 0,1,0,0, s,0,c,0, 0,0,0,1]);
}
const m4rotZ = (ang) => { // around z axis
let c = Math.cos(ang), s = Math.sin(ang);
return new Float32Array([c,s,0,0, -s,c,0,0, 0,0,1,0, 0,0,0,1]);
}
const m4fixAxes = (f, up) => { // f to -z, up to near +y
f = normalize(f)
let r = normalize(cross(f,up))
let u = cross(r,f)
return new Float32Array([
    r[0],u[0],-f[0],0,
    r[1],u[1],-f[1],0,
    r[2],u[2],-f[2],0,
    0,0,0,1
])
}

const m4scale = (sx,sy,sz) => new Float32Array([sx,0,0,0, 0,sy,0,0, 0,0,sz,0, 0,0,0,1])
const m4view = (eye, center, up) => m4mul(m4fixAxes(sub(center,eye), up), m4trans(-eye[0],-eye[1],-eye[2]))
const m4perspNegZ = (near, far, fovy, width, height) => {
    let sy = 1/Math.tan(fovy/2);
    let sx = sy*height/width;
    return new Float32Array([sx,0,0,0, 0,sy,0,0, 0,0,-(far+near)/(far-near),-1, 0,0,(2*far*near)/(near-far),0]);
  }


// math example
const m4row = (m,r) => new m.constructor(4).map((e,i)=>m[r+4*i])
const m4rowdot = (m,r,v) => m[r]*v[0] + m[r+4]*v[1] + m[r+8]*v[2] + m[r+12]*v[3]
const m4col = (m,c) => m.slice(c*4,(c+1)*4)
const m4transpose = (m) => m.map((e,i) => m[((i&3)<<2)+(i>>2)])
const m4mul = (...args) => args.reduce((m1,m2) => {
  if(m2.length == 4) return m2.map((e,i)=>m4rowdot(m1,i,m2)) // m*v
  if(m1.length == 4) return m1.map((e,i)=>m4rowdot(m2,i,m1)) // v*m
  let ans = new m1.constructor(16)
  for(let c=0; c<4; c+=1) for(let r=0; r<4; r+=1)
    ans[r+c*4] = m4rowdot(m1,r,m4col(m2,c))
  return ans // m*m
})