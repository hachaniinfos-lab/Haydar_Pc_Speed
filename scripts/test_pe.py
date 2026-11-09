import struct
import os

def align_up(val, align):
    return (val + align - 1) & ~(align - 1)

print("Alignment helper ready")
