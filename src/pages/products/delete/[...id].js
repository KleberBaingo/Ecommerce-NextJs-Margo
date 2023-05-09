import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../../api/supabase";
import { useRouter, useParams } from "next/router";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function deleteProduct() {
  const { push } = useRouter();
  const [product, setProduct] = useState([]);
  const router = useRouter();
  const { id } = router.query;
  const [name, setname] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  function goBack() {
    router.push("/products");
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
        setname(data[0].name);
        setPrice(data[0].price);
        setDescription(data[0].description);
      }
    } catch (error) {
      console.log("o erro é ", { error });
    }
  }
  async function deleteProduct(ev) {
    const { data, error } = await supabase.from("produtos").delete().eq("id", id); // usa a instância supabase para inserir um novo produto
    if (error) {
      // throw error;
      console.error("Erro ao atualizar produto:", error);
    } else {
      console.log("Produto atualizado com sucesso!");
      setTimeout(() => {
        push("/products");
      }, 1500); // 3000 milissegundos = 3 segundos
    }
  }

  const handleClick = () => {
    toast.success("Produto Deletado com sucesso!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <Layout>
      <h1>Tem certeza que quer deletar : {product.name} ?</h1>

      <table className="mt-3 basic">
        <thead>
          <tr className="text-center">
            <td className="w-1/4">Produto</td>
            <td>{product.name}</td>
          </tr>
        </thead>
        <tr className="text-center">
          <td>Descrição</td>
          <td> {product.description}</td>
        </tr>
        <tr className="text-center">
          <td>Preço</td>
          <td>{product.price}</td>
        </tr>
      </table>
      <div className="p-2 flex justify-center gap-5">
        <button
          onClick={() => {
            deleteProduct();
            handleClick();
          }}
          type="submit"
          className="btn-red"
        >
          Confirmar e deletar
        </button>
        <button onClick={goBack} type="submit" className="btn-default">
          Recusar e voltar
        </button>
        <ToastContainer />
      </div>
    </Layout>
  );
}
