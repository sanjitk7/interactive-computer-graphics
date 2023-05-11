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

def reflected(vector, axis):
    return vector - 2 * np.dot(vector, axis) * axis
