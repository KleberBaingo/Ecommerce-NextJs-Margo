import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../../api/supabase";
import { useRouter, useParams } from "next/router";

export default function editProduct() {
  const { push } = useRouter();
  const [product, setProduct] = useState([]);
  const router = useRouter();
  const { id } = router.query;
  const [tittle, setTittle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [goToProducts, setGoToProducts] = useState(false);

  function RedirectToProducts() {
    const router = useRouter();

    useEffect(() => {
      router.push("/products");
    }, []);

    return null;
  }

  useEffect(() => {
    getProduct();
  }, []);

  async function getProduct() {
    try {
      const { data, error } = await supabase.from("produtos").select("*").eq("id", id);

      if (error) throw error;
      if (data != null) {
        setProduct(data[0]);
        setTittle(data[0].tittle);
        setPrice(data[0].price);
        setDescription(data[0].description);
      }
    } catch (error) {
      console.log("o erro é ", { error });
    }
  }
  async function updateProduct(ev) {
    ev.preventDefault();

    const { data, error } = await supabase
      .from("produtos")
      .update({ tittle, description, price })
      .eq("id", id); // usa a instância supabase para inserir um novo produto
    if (error) {
      throw error;
      console.error("Erro ao atualizar produto:", error);
    } else {
      console.log("Produto atualizado com sucesso!");
      push("/products");
    }
  }

  return (
    <Layout>
      <form onSubmit={updateProduct}>
        <h1>Editar : {product.tittle}</h1>
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
      {goToProducts && <RedirectToProducts />}
    </Layout>
  );
}
