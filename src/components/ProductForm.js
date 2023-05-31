import { useEffect, useState } from 'react'
import { supabase } from '../pages/api/supabase'
import { useRouter } from 'next/router'
import Spinner from '@/components/Spinner'
import { ReactSortable } from 'react-sortablejs'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function ProductForm({
  id: id,
  name: existingName,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
  category: assignedCategory,
  properties: assignedProperties,
}) {
  const [name, setName] = useState(existingName || '')
  const [description, setDescription] = useState(existingDescription || '')
  const [category, setCategory] = useState(assignedCategory || '')
  const [productProperties, setProductProperties] = useState(assignedProperties || {})
  const [price, setPrice] = useState(existingPrice || '')
  const [images, setImages] = useState(existingImages || [])
  const [product, setProduct] = useState([])
  const [product_images, setProduct_images] = useState([])
  const [goToProducts, setGoToProducts] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [categories, setCategories] = useState([])
  const router = useRouter()
  const isNewProductPage = router.pathname === '/products/new'

  const { push } = useRouter()

  const CDNURL = 'https://vzuocrhedmeeumsepzxs.supabase.co/storage/v1/object/public/imagens/' //CDNURL + id + images.name

  useEffect(() => {
    if (!isNewProductPage) {
      getCategories()
      getProduct()
      getImages()
    } else {
      getCategories()
    }
  }, [])

  useEffect(() => {
    const imageURLs = images.slice(0).map((image) => {
      return CDNURL + image.id + '/' + image.name
    })
    setProduct_images(imageURLs)
  }, [images])

  async function saveProduct(ev) {
    ev.preventDefault()

    let data, error

    if (id) {
      ;({ data, error } = await supabase
        .from('produtos')
        .update({ name, description, price, product_images, category, productProperties })
        .eq('id', id))
    } else {
      ;({ data, error } = await supabase
        .from('produtos')
        .insert({ name, description, price, product_images, category, productProperties }))
    }

    if (error) {
      console.error('Erro ao salvar produto:', error)
      throw error
    } else {
      console.log('Produto salvo com sucesso!')
    }

    setTimeout(() => {
      push('/products')
    }, 1500) // 3000 milissegundos = 3 segundos
  }

  async function uploadImages(ev) {
    let files = ev.target?.files[0]
    setIsUploading(true)
    const { data, error } = await supabase.storage
      .from('imagens')
      .upload(id + '/' + files.name, files)

    if (data) {
      getImages()
    } else {
      console.log(error)
    }
    setIsUploading(false)
  }

  function updateImagesOrder(images) {
    setImages(images)
  }

  async function getCategories() {
    const { data, error } = await supabase.from('categorias').select('*')

    if (data != null) {
      setCategories(data.sort((a, b) => a.id.localeCompare(b.id)))
    } else {
      alert(error.message)
    }
  }

  async function getProduct() {
    try {
      const { data, error } = await supabase.from('produtos').select('*').eq('id', id)

      if (error) throw error
      if (data != null) {
        setProduct(data[0])
        setName(data[0].name)
        setPrice(data[0].price)
        setDescription(data[0].description)
        setCategory(data[0].category)
        setProductProperties(data[0].productProperties)
      }
    } catch (error) {
      console.log('o erro é ', { error })
    }
  }

  async function getImages() {
    const { data, error } = await supabase.storage.from('imagens').list(id + '/')

    if (data !== null) {
      setImages(data)
    } else {
      alert('Error loading images')
      console.log(error)
    }
  }

  const handleClick = () => {
    toast.success('Produto atualizado com sucesso!', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })
  }

  function setProductProp(propName, value) {
    setProductProperties((prev) => {
      const newProductProps = { ...prev }
      newProductProps[propName] = value
      return newProductProps
    })
  }

  const propertiesToFill = []

  if (categories.length > 0 && category) {
    let catInfo = categories.find(({ id }) => id === category)

    // Busca as propriedades da categoria atual
    propertiesToFill.push(...catInfo.properties)

    while (catInfo.parentCategory) {
      // Encontra a categoria pai correspondente ao parentCategory da categoria atual
      const parentCat = categories.find(({ id }) => id === catInfo.parentCategory)

      // Busca as propriedades da categoria pai
      propertiesToFill.push(...parentCat.properties)

      // Atualiza catInfo com a categoria pai para continuar o loop
      catInfo = parentCat
    }
  }

  return (
    <form onSubmit={saveProduct}>
      <label>Nome do Produto</label>
      <input
        type="text"
        placeholder="nome do produto"
        value={name}
        onChange={(ev) => setName(ev.target.value)}
      />
      <label>Categoria</label>
      <select value={category} onChange={(ev) => setCategory(ev.target.value)}>
        <option value="">Sem categoria</option>
        {categories.length > 0 &&
          categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
      </select>
      {propertiesToFill.length > 0 &&
        propertiesToFill.map((p) => (
          <div key={p.name} className="flex gap-1">
            <label>{p.name[0].toUpperCase() + p.name.substring(1)}</label>
            <div>
              <select
                value={productProperties[p.name]}
                onChange={(ev) => setProductProp(p.name, ev.target.value)}
              >
                {p.values.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}

      {!isNewProductPage && (
        <div>
          <label>Fotos</label>
          <div className="mb-2 flex flex-wrap gap-2">
            <ReactSortable
              list={images}
              className="flex flex-wrap gap-1"
              setList={updateImagesOrder}
            >
              {!!images.length && (
                <div>
                  {images.slice(0).map((image) => (
                    <div key={image.name} className="inline-block h-24 pr-2">
                      <img src={CDNURL + id + '/' + image.name} alt="" className="rounded-lg" />
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
        </div>
      )}

      <label>Descrição</label>
      <textarea
        placeholder="descrição"
        value={description}
        onChange={(ev) => setDescription(ev.target.value)}
      />
      <label>Preço(em R$)</label>
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
  )
}
