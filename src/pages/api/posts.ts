import { supabase } from "./supabase";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { data, error } = await supabase.from("posts").select("*");
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === "POST") {
    const { title, content } = req.body;
    const { data, error } = await supabase.from("posts").insert({ title, content });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data[0]);
  }
}
