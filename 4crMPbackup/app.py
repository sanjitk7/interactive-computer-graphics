# https://cs418.cs.illinois.edu/website/hw-raytracer.html

from sys import argv
from PIL import Image
from pprint import pprint
import numpy as np
import math

# utilFunctions
from utilFunctions import get_commands_from_input, initScene, srgb2lin, lin2srgb, ray_thing_intersection, get_object_normal,get_light_dir_dist, lamberts_law_illumination
from vectorUtils import normalize, norm, reflected


# global vars
# current_color = [0,0,0]
times = 0

implemented = "implemented.txt"

# f_path = "mpray_sphere.txt"


if __name__=="__main__":
    print("\nMAIN")
    
    global image
    global objects
    global light_bounces
    
    if len(argv)<2:
        pprint("Provide Input file!")
        quit()
    else:
        f_path = argv[1]
        
    commands = get_commands_from_input(f_path)
    
    # stage 1 - run through objects and initialize data structure to store them
    image, objects, lights, light_bounces, output_file_name = initScene(commands)
    
    # stage 2 - shoot, bounce and intersect rays for each pixel (from camera)
    width, height = image.size
    
    # default light source if light source isnt specified
    default_lights = [{
        "type": "sun",
        "position": np.array([1,0,0]),
        "diffuse": np.array([0,0,0])
    }]
    
    if len(lights) == 0:
        lights = default_lights

    # default vectors
    eye = np.array([0,0,0])
    up = np.array([0,1,0])
    forward = np.array([0,0,-1])
    right = np.array([1,0,0])
    
    # handle each light - ray emission
    for light_idx, light in enumerate(lights):
        # shoot ray at each pixel
        for i in range(height):
            for j in range(width):
                # print("RAY EMISSION FOR PIXEL :",j,i)
                
                origin = eye
                
                sx = (2*j - width)/max(width,height)
                sy = (height - 2*i)/max(width,height)
                
                # print("sx,sy",(sx,sy))
                
                # generate rays
                ray_direction = normalize(forward+ sx*right + sy*up)
                # reflection = np.array([1,1,1]) # temp
                
                # color = np.array(image.getpixel((j, i))).astype(float)[:-1] / 255
                # print("jiji",j,i)
                current_color = (np.array(image.getpixel((j,i)))[:-1])/255
                current_color = srgb2lin(current_color)
                
                # ray collision
                shadow_occur = False
                ray_interaction_occur = True
                ray_interaction_objects = []
                lambert_illumination = np.array([0,0,0])
                
                
                # do ray collision for a default of 4 times
                for bounce_idx in range(light_bounces):
                    
                    first_object, t = ray_thing_intersection(objects, origin, ray_direction)
                    
                    # skip further bounce iteration if light doesn't hit anything in the first place
                    if (first_object==None and bounce_idx==0):
                        ray_interaction_occur = False
                    
                    if (first_object==None):
                        break
                    
                    # new ray create
                    ray_hit = origin + t * ray_direction
                    object_surface_normal = get_object_normal(first_object, ray_hit)
                    
                    # offset the new ray by a very small point to avoid self shadowing and move the reset the ray emission point for next iteration
                    origin_offset = ray_hit + (1e-5*object_surface_normal)
                    origin = origin_offset
                    
                    light_intersection, light_intersection_dist = get_light_dir_dist(light,ray_hit)
                    
                    # find the next interaction on ray bounce
                    next_object, next_object_t = ray_thing_intersection(objects, origin_offset, light_intersection)
                    
                    # if bounced ray hits object first before cam - shadow => no further bounces
                    if ((next_object_t < light_intersection_dist) and bounce_idx==0):
                        shadow_occur = True
                        image.putpixel((j,i), tuple(np.append(np.array(image.getpixel((j, i)))[:-1], [255])))
                        break
                
                    # illumination
                    lambert_illumination = lamberts_law_illumination(first_object, light["diffuse"], light_intersection, object_surface_normal)
                   
                    ray_interaction_objects += [[np.array(first_object["shine"]),lambert_illumination,first_object["diffuse"]]]
                    
                    # print("ray_interaction_objects",ray_interaction_objects)
                    
                    # ray_direction = reflected(ray_direction, object_surface_normal)
                    # ray_direction = ray_direction - 2* (np.dot(ray_direction, object_surface_normal) * object_surface_normal )
                    
                    # print("ray_direction",ray_direction)
                
                # if no shadow on this pixel iteration -> render the correct illuminated color -> if not shadow black
                
                empty_array = np.zeros(3)
                ray_interaction_objects += [empty_array,empty_array]
                
                
                if shadow_occur == False:
                    ray_interaction_objects_reversed = ray_interaction_objects[::-1]
                    
                    final_color = empty_array
                    for shadow_object in ray_interaction_objects_reversed:
                        final_color = (np.array([1,1,1]) - np.array(shadow_object[0])) * np.array(shadow_object[1]) + np.array(shadow_object[0]) * final_color
                        
                    if not ((final_color == np.zeros(3)).all() and ray_interaction_occur==False):
                        # times +=1
                        output_color = current_color + np.array(final_color)
                        output_color = np.array(np.clip(output_color,0,1))
                        
                        output_color = tuple(lin2srgb(output_color)*255)
                        # print("opcol",output_color)
                        image.putpixel((j,i), tuple(np.append(output_color, [255]).astype(int)))
                        
                
                
                
                
    print("times",times)
    print("\ncommands: ",commands)
    print("objects: ",objects)
    image.save(output_file_name)
    # print("load_data", load_data(f_path))
    