import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../api/supabase";
import { useRouter } from "next/router";

export default function NewProduct() {
  const [name, setname] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const { push } = useRouter();

  async function createProduct(ev) {
    ev.preventDefault();

    const { data, error } = await supabase.from("produtos").insert({ name, description, price }); // usa a instância supabase para inserir um novo produto

    if (error) {
      throw error;
      console.error("Erro ao criar produto:", error);
    } else {
      console.log("Produto criado com sucesso!");
      push("/products");
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
          value={name}
          onChange={(ev) => setname(ev.target.value)}
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
