#! /usr/bin/env python3
# coding: utf-8

# TRIMESH
# import trimesh

# trimesh.util.attach_to_log()
# mesh = trimesh.load('hyperLecture/model.obj')

# if isinstance(mesh, trimesh.Scene):
#     print("Le mesh est une scène avec", len(mesh.geometry), "objets.")
# elif isinstance(mesh, trimesh.Trimesh):
#     print("Le mesh est un Trimesh avec", len(mesh.faces), "faces.")

# print("Faces:", mesh.faces.shape)
# print(mesh.faces[:5])  # Affiche les 5 premières faces
# body_count = mesh.body_count
# print("Nombre de corps:", body_count)

# mesh.split()
# print("Nombre de corps après séparation:", len(mesh.facets))




# VEDO
# from vedo import *
# mesh = load("hyperLecture/model.obj").texture("hyperLecture/texture.png")
# mesh.show()





import pymeshlab
ms = pymeshlab.MeshSet()
ms.load_new_mesh('hyperLecture/model.obj')
ms.print_status()
