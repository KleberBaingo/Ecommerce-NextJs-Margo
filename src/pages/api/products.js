import { supabase, supabaseClient, ProductSchema } from "./supabase";

export const create = (model, data) => {
  return ProductSchema.create(data)
    .then((result) => {
      console.log(result);
      return { data: result };
    })
    .catch((error) => {
      console.error(error);
      return { error };
    });
};
