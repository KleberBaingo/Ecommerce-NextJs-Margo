import Layout from '@/components/Layout'
import { useRouter, useParams } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '../../api/supabase'
import ProductForm from '@/components/ProductForm'
import { ToastContainer } from 'react-toastify'

export default function editProductPage() {
  const [productInfo, setProductInfo] = useState(null)
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    if (!id) {
      return
    }

    const fetchProduct = async () => {
      const { data, error } = await supabase.from('produtos').select().eq('id', id).single()

      if (error) {
        console.error('Erro ao buscar produto:', error)
      } else {
        setProductInfo(data)
      }
    }
    fetchProduct()
  }, [id])
  return (
    <Layout>
      <ToastContainer />
      <h1>Editar Produto</h1>
      {productInfo && <ProductForm id={productInfo.id} {...productInfo} />}
    </Layout>
  )
}
