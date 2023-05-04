import Layout from "@/components/Layout";
import { useState } from "react";
import { supabaseClient, supabase } from "../api/supabase";
import Product from "../api/supabase";

export default function NewProduct() {
  const [tittle, setTittle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  async function createProduct(ev) {
    ev.preventDefault();

    try {
      const { data, error } = await Product.insert([{ tittle, description, price }]); // usa a instância Product para inserir um novo produto

      if (error) {
        throw error;
      }

      console.log("Produto criado com sucesso:", data);
    } catch (error) {
      console.error("Erro ao criar produto:", error);
    }
  }

  return (
    <Layout>
      <form onSubmit={createProduct}>
        <h1>Novo Produto</h1>
        <label>Nome do Produto</label>
        <input
          type="text"
          placeholder="nome do produto"
          value={tittle}
          onChange={(ev) => setTittle(ev.target.value)}
        />
        <label>Descrição</label>
        <textarea
          placeholder="descrição"
          value={description}
          onChange={(ev) => setDescription(ev.target.value)}
        ></textarea>
        <label>Preço</label>
        <input
          type="number"
          placeholder="preço"
          value={price}
          onChange={(ev) => setPrice(ev.target.value)}
        />
        <button type="submit" className="btn-primary">
          Salvar
        </button>
      </form>
    </Layout>
  );
}
