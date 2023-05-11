function createInitialParticles(count){
    console.log("Initializing Particles")
    
    for (i=0;i<window.particleCount;i++){
        new_particle = {}
        radius = Math.random() * (3 - 1) + 1
        position = [7*Math.random()-5,7*Math.random()-5,7*Math.random()-5]
        velocity = mul([Math.random()-0.3,Math.random()-0.3,Math.random()-0.3], radius)
        color = [Math.random(), Math.random(), Math.random(),1]
        otherForces = []

        newParticle = {
            "radius": radius,
            "position":position,
            "velocity": velocity,
            "color": color,
            "otherForces": []
        }
        // console.log("newParticle", newParticle)
        window.particles.push(newParticle)

    }
}