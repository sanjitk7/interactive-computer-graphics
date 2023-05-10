import numpy as np
import math
from PIL import Image
from vectorUtils import norm, magnitude, normalize

def get_commands_from_input(f_path):
    
     # get all commands from input file
    legal_command_start = ["png", "sphere","sun","color","bulb", "plane","xyz","trif", "expose"]
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
    vertices = []
    image = None
    light_bounces = 4
    default_diffuse = np.array([1,1,1])
    default_shine = np.array([0,0,0])
    default_expose = None
    
    for command in commands:
        
        polygon_object = {
            "type":None,
            "center":None,
            "radius":None
        }
        
        if command[0] == "png":
            width, height, recent_open_image = int(command[1]), int(command[2]), command[3]
            image = Image.new("RGBA", (width, height), (0,0,0,0))
        
        if command[0] == "sphere":
            polygon_object["type"] = command[0]
            polygon_object["center"] = np.array([float(command[1]),float(command[2]),float(command[3])])
            polygon_object["radius"] = float(command[4])
            
            # current color and shine for light color and shine
            polygon_object["diffuse"] = default_diffuse
            polygon_object["shine"] = default_shine
            
            objects.append(polygon_object)
        
        if command[0] == "sun":
            light_source = {}
            light_source["type"] = "sun"
            light_source["position"] = np.array([float(command[1]),float(command[2]),float(command[3])])
            light_source["diffuse"] = default_diffuse
        
            light_sources.append(light_source)
            
        if command[0] == "color":
            default_diffuse = np.array([float(command[1]),float(command[2]),float(command[3])])
        
        if command[0] == "bulb":
            light_source = {}
            light_source["type"] = "bulb"
            light_source["position"] = np.array([float(command[1]),float(command[2]),float(command[3])])
            light_source["diffuse"] = default_diffuse
            
            light_sources.append(light_source)
        
        if command[0] == "plane":
            polygon_object["type"] = command[0]
            polygon_object["AxByCzD"] = np.array([float(command[1]),float(command[2]),float(command[3]), float(command[4])])
            
            # current color and shine for light color and shine
            polygon_object["diffuse"] = default_diffuse
            polygon_object["shine"] = default_shine
            
            objects.append(polygon_object)
        
        if command[0] == "xyz":
            print("vertex added with xyz")
            vertex = np.array([float(command[1]),float(command[2]),float(command[3])])
            vertices.append(vertex)
        
        if command[0] == "trif":
            polygon_object["type"] = "triangle"
            v1, v2 ,v3 = [int(x) for x in command[1:]]
            print("triangle: ",v1,v2,v3)
            
            # if positive (do -1) - offset for 0 index in python lists
            if v1 > 0:
                v1 -=1
            if v2 > 0:
                v2 -=1
            if v3 > 0:
                v3-=1
            
            print("v1v2v3:",v1,v2,v3)
            print("vertices:",vertices)
            polygon_object["vertices"] = [vertices[v1],vertices[v2],vertices[v3]]
            polygon_object["diffuse"] = default_diffuse
            polygon_object["shine"] = default_shine
            
            objects.append(polygon_object)
        if command[0] == "expose":
            default_expose = float(command[1])
            
            
            
    
    return image, objects, light_sources, light_bounces, default_expose, recent_open_image
        


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


# coordinate algebra for normals and planes - https://math.stackexchange.com/questions/2333074/when-does-a-normal-line-intersect-the-plane
def get_plane_normal(plane):
    A, B, C, D = plane["AxByCzD"]
    root_A_sq_B_sq_C_sq = math.sqrt(A**2 + B**2 + C**2)
    normal = np.array([A/root_A_sq_B_sq_C_sq, B/root_A_sq_B_sq_C_sq, C/root_A_sq_B_sq_C_sq])
    plane_normal_intersection = np.array([A*-D/root_A_sq_B_sq_C_sq, B*-D/root_A_sq_B_sq_C_sq, C*-D/root_A_sq_B_sq_C_sq])
    
    return normal, plane_normal_intersection
    
# https://stackoverflow.com/questions/19350792/calculate-normal-of-a-single-triangle-in-3d-space
def get_triangle_normal(triangle):
    v1,v2,v3 = triangle["vertices"]
    e1 = v2 - v1
    e2 = v3 - v1
    normal = normalize(np.cross(e1,e2))
    
    # get normal facing the camera
    if normal[2] >=0:
        return normal
    else:
        return -normal

# get normal of object based on polygon type to calculate illumination
def get_object_normal(object, ray_hit):
    object_type = object["type"] 
    if object_type == "sphere":
        return normalize(ray_hit - object["center"])
    if object_type == "plane":
        plane_normal, _ = get_plane_normal(object)
        return plane_normal
    if object_type == "triangle":
        return get_triangle_normal(object)

# get light direction and distance from origin
def get_light_dir_dist(light, ray_hit, new_light_origin):
    light_type = light["type"]
    if light_type == "sun":
        light_dir = normalize(light["position"])
        light_dist = norm(light["position"] - ray_hit)
        return light_dir, light_dist
    if light_type == "bulb":
        light_dir = normalize(light["position"] - new_light_origin)
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
    
    if t1 > 0 or t2> 0:
        if inside < 0 and t1>0:
            return t1
        elif inside >0 and t2>0:
            return t2
        # return min(t1, t2)
        
    # if t1 > 0 and t2> 0:
    #     return min(t1, t2)

# from ray-plane intersection
def ray_plane_intersection(ro, rd, plane_normal, plane_normal_point):
    if np.dot(rd, plane_normal) == 0:
        return None
    t = np.dot((plane_normal_point - ro), plane_normal)/np.dot(rd, plane_normal)
    if t>0:
        return t
    return None
    

def ray_triangle_intersection(ro, rd, tri_vertices, tri_normal):
    
    # ray-plane intersection
    d_n = np.dot(rd, tri_normal)
    v1,v2,v3 = tri_vertices
    
    if d_n ==0:
        return None
    
    t = np.dot(v1 - ro, tri_normal)/d_n
    
    if t<0:
        return None
    
    # inside or not with barycentric coords
    e1 = v2 - v1
    e2 = v3 - v1
    
    perp_to_edge_2 = np.cross(rd, e2)
    distance_from_vertex = np.dot(e1, perp_to_edge_2)
    
    bary_2 = np.dot(ro-v1,perp_to_edge_2) * 1/distance_from_vertex
    
    perp_to_edge_1 = np.cross(ro-v1,e1)
    bary_1 = np.dot(rd, perp_to_edge_1) * 1/distance_from_vertex
    
    t_inside = np.dot(e2, perp_to_edge_1) * 1/distance_from_vertex
    
    if (bary_2<0 or bary_2>1) or (bary_1 <0 or bary_1+bary_2>1):
        return None

    return t_inside


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
        if object["type"] == "plane":
            # find ray_plane_intersection
            plane_normal, plane_normal_point = get_plane_normal(object)
            all_thing_intersections += [ray_plane_intersection(ro, rd,plane_normal, plane_normal_point)]
        if object["type"] == "triangle":
            normal = get_triangle_normal(object)
            all_thing_intersections += [ray_triangle_intersection(ro, rd, object["vertices"], normal)]
        
        
    # get the object from the distance
    for thing_idx, t_thing in enumerate(all_thing_intersections):
        if t_thing != None and t_thing < t_min:
            closest_hit_object = objects[thing_idx]
            t_min = t_thing
    
    return closest_hit_object, t_min
    
            
def lamberts_law_illumination(object, light_diffuse, light_type, light_direction,light_intersection_dist, surface_normal):
    light_surf_dot = np.dot(surface_normal,light_direction)
    
    # computer fall off for artificial bulb lighting
    fall_off = 1
    if light_type == "bulb":
        # fall_off = math.pow(1/light_intersection_dist, 2)
        fall_off = 1/math.pow(light_intersection_dist, 2)
    
    if light_surf_dot > 0:
        return object["diffuse"] * light_diffuse * light_surf_dot * fall_off
    return 0

def exponentialExposure(l_linear, v):
    return np.array([1-math.exp(-l_linear[0]*v), 1-math.exp(-l_linear[1]*v),1-math.exp(-l_linear[2]*v)])