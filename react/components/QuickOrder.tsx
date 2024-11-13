import React, { useEffect, useState } from 'react'
import { useLazyQuery, useMutation } from 'react-apollo'
import { useCssHandles } from 'vtex.css-handles'
import './styles.css'

import UPDATE_CART from '../graphql/updateCart.graphql'
import GET_PRODUCT from '../graphql/getProductBySku.graphql'

const QuickOrder = () => {
  const CSS_HANDLES = [
    'quick-order--container',
    'quick-order--title',
    'quick-order--form',
    'quick-order--input',
    'quick-order--btn',
    'quick-order--notfound',
  ]

  const handles = useCssHandles(CSS_HANDLES)

  const [getProductData, { data: product }] = useLazyQuery(GET_PRODUCT)
  const [addToCart] = useMutation(UPDATE_CART)
  const [inputText, setInputText] = useState('')
  const [search, setSearch] = useState('')
  const [notFoundProduct, setNotFoundProduct] = useState('')

  const handleChange = (event: any) => {
    setInputText(event.target.value)
  }

  const searchProduct = (event: any) => {
    event.preventDefault()
    if (!inputText) {
      setNotFoundProduct('No ha ingresado nada')
    } else {
      setSearch(inputText)
      getProductBySku()
    }
  }

  const updateAddToCart = (productId: string) => {
    const skuId = parseInt(productId)

    addToCart({
      variables: {
        salesChannel: '1',
        items: [
          {
            id: skuId,
            quantity: 1,
            seller: '1',
          },
        ],
      },
    }).then(() => {
      window.location.href = '/checkout'
    })
  }

  const getProductBySku = () => {
    getProductData({
      variables: {
        sku: inputText,
      },
    })
  }

  useEffect(() => {
    console.log('---Mi data es:', product)
    if (product) {
      updateAddToCart(product?.product?.productId)
    } else {
      setNotFoundProduct('No existe el SKU ingresado')
    }
  }, [search, product])

  return (
    <>
      <div className={`${handles['quick-order--container']}`}>
        <div className={`${handles['quick-order--title']}`}>Compra rápida</div>
        <form
          onSubmit={searchProduct}
          className={`${handles['quick-order--form']}`}
        >
          <div>
            <input
              id="sku"
              type="text"
              placeholder="Ingrese su SKU"
              onChange={handleChange}
              className={`${handles['quick-order--input']}`}
            />
          </div>
          <input
            type="submit"
            value="AÑADIR AL CARRITO"
            className={`${handles['quick-order--btn']}`}
          />
        </form>
        {notFoundProduct && (
          <h1 className={`${handles['quick-order--notfound']}`}>
            {notFoundProduct}
          </h1>
        )}
      </div>
    </>
  )
}

export default QuickOrder
