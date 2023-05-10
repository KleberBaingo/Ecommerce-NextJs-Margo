import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../../api/supabase";
import { useRouter, useParams } from "next/router";
import { ReactSortable } from "react-sortablejs";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "../../../components/Spinner";

export default function editProduct() {
  const { push } = useRouter();
  const [product, setProduct] = useState([]);
  const router = useRouter();
  const { id } = router.query;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([]);
  const [product_images, setProduct_images] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    getProduct();
  }, []);

  useEffect(() => {
    getImages();
  }, []);

  useEffect(() => {
    const imageURLs = images.slice(0).map((image) => {
      return CDNURL + image.id + "/" + image.name;
    });
    setProduct_images(imageURLs);
  }, [images]);

  const CDNURL = "https://vzuocrhedmeeumsepzxs.supabase.co/storage/v1/object/public/imagens/";

  //CDNURL + id + images.name

  async function getImages() {
    const { data, error } = await supabase.storage.from("imagens").list(id + "/");

    if (data !== null) {
      setImages(data);
    } else {
      alert("Error loading images");
      console.log(error);
    }
  }

  async function getProduct() {
    try {
      const { data, error } = await supabase.from("produtos").select("*").eq("id", id);

      if (error) throw error;
      if (data != null) {
        setProduct(data[0]);
        setName(data[0].name);
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
      .update({ name, description, price, product_images })
      .eq("id", id); // usa a instância supabase para inserir um novo produto
    if (error) {
      console.error("Erro ao atualizar produto:", error);
      throw error;
    } else {
      console.log("Produto atualizado com sucesso!");
      setTimeout(() => {
        push("/products");
      }, 1500); // 3000 milissegundos = 3 segundos
    }
  }

  async function uploadImages(ev) {
    let files = ev.target?.files[0];
    setIsUploading(true);
    const { data, error } = await supabase.storage
      .from("imagens")
      .upload(id + "/" + files.name, files);

    if (data) {
      getImages();
    } else {
      console.log(error);
    }
    console.log(files.name);
    setIsUploading(false);
  }

  const handleClick = () => {
    toast.success("Produto atualizado com sucesso!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  function updateImagesOrder(images) {
    setImages(images);
  }

  return (
    <Layout>
      <ToastContainer />
      <form onSubmit={updateProduct}>
        <h1>Editar : {product.name}</h1>
        <label>Nome do Produto</label>
        <input
          type="text"
          placeholder="nome do produto"
          value={name}
          onChange={(ev) => setName(ev.target.value)}
        />
        <label>Fotos</label>
        <div className="mb-2 flex flex-wrap gap-2">
          <ReactSortable list={images} className="flex flex-wrap gap-1" setList={updateImagesOrder}>
            {!!images.length && (
              <div>
                {images.slice(0).map((image) => (
                  <div key={image.name} className="inline-block h-24 pr-2">
                    <img src={CDNURL + id + "/" + image.name} alt="" className="rounded-lg" />
                  </div>
                ))}
              </div>
            )}
          </ReactSortable>
          {isUploading && (
            <div className="h-24 p-1 bg-gray-200 flex items-center">
              <Spinner />
            </div>
          )}

          <label className="w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-gray-500 rounded-md bg-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
            <div>Upload</div>
            <input type="file" onChange={uploadImages} className="hidden" />
          </label>
          {!images?.length && <div>Sem fotos nesse produto </div>}
        </div>
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
        <button onClick={handleClick} type="submit" className="btn-primary">
          Salvar
        </button>
      </form>
    </Layout>
  );
}
