import numpy as np
import math
from PIL import Image
from vectorUtils import norm, magnitude, normalize

def get_commands_from_input(f_path):
    
     # get all commands from input file
    legal_command_start = ["png", "sphere","sun","color"]
    commands = []
    with open(f_path) as f:
        for line in f:
            # print("Line: ",line)
            if line.strip()=="":
                print("Ignored Empty String!")
                continue
            if line.strip().split()[0].strip() in legal_command_start:
                commands.append(line.strip().split())
            else:
                print("Ignored Illegal: ",line)
        # print(commands)
        return commands

# STAGE 1: RUN THROUGH ALL OBJECTS AND INITIALIZE THEM
def initScene(commands):
    objects = []
    light_sources = []
    image = None
    light_bounces = 4
    default_diffuse = np.array([1,1,1])
    default_shine = np.array([0,0,0])
    
    for command in commands:
        
        polygon_object = {
            "type":None,
            "center":None,
            "radius":None
        }
        
        # polygon_object = {}
        light_source = {}
        
        if command[0] == "png":
            width, height, recent_open_image = int(command[1]), int(command[2]), command[3]
            image = Image.new("RGBA", (width, height), (0,0,0,0))
        
        if command[0] == "sphere":
            polygon_object["type"] = command[0]
            polygon_object["center"] = np.array([float(command[1]),float(command[2]),float(command[3])])
            polygon_object["radius"] = float(command[4])
            polygon_object["diffuse"] = default_diffuse
            polygon_object["shine"] = default_shine
            
            objects.append(polygon_object)
        
        if command[0] == "sun":
            light_source["type"] = "sun"
            light_source["position"] = np.array([float(command[1]),float(command[2]),float(command[3])])
            light_source["diffuse"] = default_diffuse
        
            light_sources.append(light_source)
            
        if command[0] == "color":
            default_diffuse = np.array([float(command[1]),float(command[2]),float(command[3])])
    
    return image, objects, light_sources, light_bounces, recent_open_image
        



# Gamma Correction:  LDisplay converted to LStorage
def linear_to_sRGB(linear_colors):
    linear_colors = list(linear_colors)
    sRGB = []
    for color in linear_colors:
        if color <= 0.0031308:
            sRGB.append(color*12.92)
        else:
            sRGB.append((color**(1/2.4)*1.055) - 0.055)
    return np.array(sRGB)

# Gamma Correction: LStorage converted to LDisplay
def sRGB_to_linear(rGBcolors):
    rGBcolors = list(rGBcolors)
    linear_colors = []
    for color in rGBcolors:
        # color_scaled = color/255
        if color <= 0.04045:
            linear_colors.append(color/12.92)
        else:
            linear_colors.append(((color + 0.055)/1.055)**2.4)
    # print("sRGB to linear color: ",linear_colors)
    return np.array(linear_colors)


# get normal of object based on polygon type to calculate illumination
def get_object_normal(object, ray_hit):
    object_type = object["type"] 
    if object_type == "sphere":
        return normalize(ray_hit - object["center"])

# get light direction and distance from origin
def get_light_dir_dist(light, ray_hit):
    light_type = light["type"]
    if light_type == "sun":
        light_dir = normalize(light["position"])
        light_dist = norm(light["position"] - ray_hit)
        return light_dir, light_dist

# from ray-sphere intersection
def ray_sphere_intersection(ro, rd, sphere_center, sphere_radius):
    # print("rsph in: ",ro, rd, sphere_center, sphere_radius)
    inside = math.pow(magnitude(sphere_center - ro),2) - math.pow(sphere_radius, 2)
    tc = np.dot(sphere_center - ro, rd) / norm(rd)
    
    if inside > 0 and tc < 0:
        return None

    d_square = math.pow(magnitude(ro + tc*rd - sphere_center),2)
    
    if (d_square <0):
        print("d_sq negative?", d_square)
    
    if (inside > 0) and (math.pow(sphere_radius,2) < d_square):
        return None
    
    try:
        t_offset = math.sqrt(sphere_radius**2 - d_square)/ norm(rd)
    except:
        print("exception:",inside,sphere_radius,d_square)
    
    # sphere has 2 intersection points
    t1 = tc + t_offset
    t2 = tc - t_offset
    if t1 > 0 and t2> 0:
        return min(t1, t2)


# find the first object that a ray intersects in the scene -> t, object
def ray_thing_intersection(objects, ro, rv):
    all_thing_intersections = []
    closest_hit_object = None
    t_min = np.inf
    rd = normalize(rv)
    
    # find object intersections
    for object in objects:
        if object["type"] == "sphere":
            all_thing_intersections += [ray_sphere_intersection(ro, rd, object["center"], object["radius"])]
    
    # get the object from the distance
    for thing_idx, t_thing in enumerate(all_thing_intersections):
        if t_thing != None and t_thing < t_min:
            closest_hit_object = objects[thing_idx]
            t_min = t_thing
    
    return closest_hit_object, t_min
    
            
def lamberts_law_illumination(object, light_diffuse, light_direction, surface_normal):
    light_surf_dot = np.dot(light_direction, surface_normal)
    if light_surf_dot > 0:
        return object["diffuse"] * light_diffuse * light_surf_dot
    return 0