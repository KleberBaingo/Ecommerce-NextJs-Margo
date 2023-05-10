import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "./api/supabase";
import React, { Component } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export default function Categories() {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name, setName] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const MySwal = withReactContent(Swal);

  useEffect(() => {
    getCategories();
  }, []);

  async function getCategories() {
    const { data, error } = await supabase.from("categorias").select("*");

    if (data != null) {
      setCategories(data.sort((a, b) => a.id.localeCompare(b.id)));
    } else {
      alert(error.message);
    }
  }

  async function saveCategory(ev) {
    ev.preventDefault();

    if (editedCategory) {
      const { data, error } = await supabase
        .from("categorias")
        .update({ name, parentCategory })
        .eq("id", editedCategory.id);
      window.location.reload();
    } else {
      const { data, error } = await supabase.from("categorias").insert({ name, parentCategory });
      setName("");
      if (error) {
        console.error("Erro ao criar categoria:", error);
        throw error;
      } else {
        console.log("Categoria criado com sucesso!");
        window.location.reload();
      }
    }
  }

  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parentCategory);
  }

  async function deleteCategory(ev) {
    MySwal.fire({
      title: "Você tem certeza?",
      text: `Você quer deletar ${ev.name}?`,
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonColor: "red",
      confirmButtonText: "Sim, Deletar!",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        console.log(ev.id);
        const { data, error } = await supabase.from("categorias").delete().eq("id", ev.id); // usa a instância supabase para inserir um novo produto
        window.location.reload();

        if (error) {
          // throw error;
          console.error("Erro ao deletar categoria:", error);
        } else {
          console.log("categoria deletada com sucesso!");
        }
      }
    });
  }

  return (
    <Layout>
      <h1>Categorias</h1>
      <label>
        {editedCategory ? `Editar categoria : ${editedCategory.name}` : "Criar nova categoria"}
      </label>
      <form onSubmit={saveCategory} className="flex gap-1">
        <input
          className="mb-0"
          type="text"
          placeholder={"Nome da Categoria"}
          onChange={(ev) => setName(ev.target.value)}
          value={name}
        />
        <select
          className="mb-0"
          onChange={(ev) => setParentCategory(ev.target.value)}
          value={parentCategory}
        >
          <option>sem categoria pai</option>
          {categories.length > 0 &&
            categories.map((category) => <option value={category.id}> {category.name}</option>)}
        </select>
        <button type="submit" className="btn-primary py-1">
          Salvar
        </button>
      </form>
      <table className="basic mt-4">
        <thead>
          <tr>
            <td> Nome categoria</td>
            <td> Categoria pai</td>
            <td>Funções</td>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => {
            // encontra a categoria pai correspondente ao id da categoria atual
            const parentCategory = categories.find((cat) => cat.id === category.parentCategory);

            return (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td>{parentCategory ? parentCategory.name : ""}</td>
                <td className="">
                  <button
                    onClick={() => editCategory(category)}
                    className="btn-primary btn-category"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-4 h-4"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      />
                    </svg>
                    Editar
                  </button>

                  <button
                    onClick={() => deleteCategory(category)}
                    className="btn-primary btn-category"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                    Deletar
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Layout>
  );
}
