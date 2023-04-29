import numpy as np
from numpy import linalg as LA

def normalize(v):
    return v/LA.norm(v)

def norm(v):
    return LA.norm(v)

def reflected(vector, axis):
    return vector - 2 * np.dot(vector, axis) * axis