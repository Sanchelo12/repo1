import { supabase } from "../config/supabase.js";
import { validateItem } from "../schema/validate.js";

export const getAll = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("inventory")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const { id } = req.query;
    const { data, error } = await supabase
      .from("inventory")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Item not found" });

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const create = async (req, res) => {
  try {
    const validation = validateItem(req.body);

    if (!validation.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: validation.error.format(),
      });
    }

    const { data, error } = await supabase
      .from("inventory")
      .insert([validation.data])
      .select();

    if (error) throw error;

    return res.status(201).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteById = async (req, res) => {
  try {
    const { id } = req.query;

    // Primero verificamos si existe
    const { error } = await supabase.from("inventory").delete().eq("id", id);

    if (error) throw error;
    return res.status(200).json({ message: `Item ${id} deleted successfully` });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteAll = async (req, res) => {
  try {
    // En Supabase/Postgres, para borrar todo se puede usar un filtro que siempre sea cierto
    // .neq('id', 0) borra todo donde el id no sea 0
    const { error } = await supabase.from("inventory").delete().neq("id", 0);

    if (error) throw error;
    return res.status(200).json({ message: "All items deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
