import numpy as np
import math
from numpy import linalg as LA

def normalize(v):
    return v/LA.norm(v)

def norm(v):
    return LA.norm(v)

def magnitude(v):
    return LA.norm(v)

# def euc_dist(v1,v2):
#     return  v1 ** 2 - v2 ** 2

def make_perpendicular(movable_vector, referenece_vector):
    fixed_perpendicular = normalize(np.cross(movable_vector, referenece_vector))
    movable_vector = normalize(np.cross(referenece_vector, fixed_perpendicular))
    
    return movable_vector