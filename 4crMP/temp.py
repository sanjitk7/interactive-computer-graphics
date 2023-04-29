 # if shadow_occur != True:
                #     ray_interaction_objects = ray_interaction_objects[::-1]
                #     fin_col = np.zeros(3)

                #     for ii in ray_interaction_objects:
                #         # ii = in_obj[jj]
                #         fin_col = ((np.array([1, 1, 1]) - np.array(ii[0])) * np.array(ii[1])) + (
                #                     np.array(ii[0]) * fin_col)

                #     if not ((fin_col == np.zeros(3)).all() and ray_interaction_occur == False):
                #         times +=1
                        
                #         # col = np.append(fin_col, [1])
                #         col = current_color + np.array(fin_col)
                #         col = np.array(np.clip(col, 0, 1))
                #         # if v != -1:
                #         #     col = expose(col, v)
                #         col = tuple(lin2srgb(col) * 255)
                #         # print("col:",col)
                #         col = np.append(col, [255]).astype(int)
                #         print("opcol",col)
                #         image.putpixel((j, i), tuple(col))