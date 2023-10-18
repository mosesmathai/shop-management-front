'use client'

import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import Center from "@/components/Center";
import Header from "@/components/Header";
import styled from "styled-components";
import Table from "@/components/Table";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "@/components/CartContext";
import axios from "axios";
import Spinner from '@/components/Spinner';
import Link from 'next/link'


export const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1.3fr .7fr;
    padding: 3px 0 20px 0;
    gap: 40px;
  }
  gap: 20px;
  margin-top: 5px;
  padding: 0 0 20px 0;
`;

export const Box = styled.div`
  background: white;
  border-radius: 5px;
  padding: 15px;
  color: black;
`;

export const PaymentBtn = styled.button`
  background-color: green;
  &:hover {
    background-color: #50C878;
  }
  font-weight: bold;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  svg {
    height: 15px;
  }
  white-space: nowrap;
  display: block;
  width: 100%;
  margin: 10px 0 0 0;
`;

const ProductInfoCell = styled.td`
  padding: 6px 0;
`;

const ProductImageBox = styled.div`
  width: 70px;
  height: 70px;
  background-color: #f0f0f0;
  border-radius: 10%;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    max-width: 65px;
    max-height: 65px;
    border-radius: 10px;
  }
`;

const CartTitleWrapper = styled.h2`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 0 10px 0;
  color: black;
`;

const PriceWrapper = styled.td`
  font-weight: bold;
  
`;

const TotalWrapper = styled.td`
  text-align: left;
  text-transform: uppercase;
  color: #4B0082;
  font-weight: bold;
  font-family: san-serif;
`;

export const NormalBtn = styled.button`
  background-color: #aaa;
  border: none;
  cursor: pointer;
  border-radius: 15%;
  padding: 3px 8px;
`;

const QuantityLabel = styled.span`
  padding: 0 5px;
`;


export const Bg = styled.div`
  padding: 0 0 20px 0;
`;

export const StyledPHolder = styled.p`
  font-size: small;
  margin: 4px 0 4px 0;
  font-family: Sans-serif;
  color: black;
`;

export const StyledSelect = styled.select`
  border-radius: 5px;
  margin-bottom: 7px;
  background-color: #ccc;
`;

export const StyledLabel = styled.label`
  font-family: Verdana;
  color: black;
  font-size: small;
  font-weight: bold;
  display: block;
`;

export const StyledTitle = styled.h1`
  color: #4B0082;
`;

export const StyledWarning = styled.div`
  color: red;
`
const StyledButtonLink = styled(Link)`
  text-decoration: none;
  background-color: white;
  color: black;
  border-radius: 6px;
  padding: 5px 10px;
  border: 2px solid black;
  font-weight: bold;
  &:hover {
    background-color: #ccc;
  }
`;

export default function CartPage() {
  const {cartProducts,addProduct,removeProduct,clearCart} = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [isSuccess,setIsSuccess] = useState(false);
  const [buttonText, setButtonText] = useState('Enter Payment');
  const [paymentMode, setPaymentMode] = useState('');
  
  const form = useRef();


  function handleEmailNotification() {
    emailjs.sendForm('service_wfb1qby', 'template_kjjwzxr', form.current, 'G1vccmuK_P_2nr7Hv')
      .then((result) => {
          console.log(result.text);
      }, (error) => {
          console.log(error.text);
      });
  }

  const payHandler = (event) => {
    event.preventDefault()
    setButtonText('Processing')
    submitOrder();
    handleEmailNotification();
    clearCart();
    setIsSuccess(true);
  }

  function moreOfThisProduct(id) {
    addProduct(id);
  }

  function lessOfThisProduct(id) {
    removeProduct(id);
  }


  async function submitOrder() {
    const data = {
      cartProducts,paymentMode
    };   
    await axios.post('/api/checkout', data);
  }

  let total = 0;
  // https://payment.intasend.com/checkout/2a625a23-5ecb-417c-b4dc-4965dc32366c/0L359EY/status/

  for (const productId of cartProducts) {
    const price = products.find(p => p._id === productId)?.price || 0;
    total += price
  }

  useEffect(() => {
    if (cartProducts.length > 0) {
      setLoadingProducts(true);
      axios.post('/api/cart', {ids:cartProducts}).then(response => {
        setProducts(response.data);
        setLoadingProducts(false);
      })
    } else {
      setProducts([]);
    }
  }, [cartProducts]);

  if (isSuccess) {
    return (
      <Bg>
        <Header />
        <Center>
          <ColumnsWrapper>
            <Box>
              <h1>Your request has been processed</h1>
              <p>Keep up the good work!</p>
              <StyledButtonLink href="/">Return to Home Page</StyledButtonLink>
            </Box>
          </ColumnsWrapper>
        </Center>
      </Bg>
    );
  }
  return (
    <Bg>
      <Header />
      <Center>
        <ColumnsWrapper>
          <Box>
            <CartTitleWrapper>
              <>Order Information</>
            </CartTitleWrapper>
            {!cartProducts?.length && (
              <div>Your cart is empty</div>
            )}
            {loadingProducts && (
              <Spinner fullWidth />
            )}
            {!loadingProducts && (
              <div>
                {products?.length > 0 && (
                  <Table>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(product => (
                        <tr key={product._id}>
                          <ProductInfoCell>
                            <ProductImageBox>
                              <img src={product.images[0]} alt="product image" />
                            </ProductImageBox>
                            {product.title}
                          </ProductInfoCell>
                          <td>
                            <NormalBtn onClick={() => lessOfThisProduct(product._id)}>-</NormalBtn>
                            <QuantityLabel>
                              {cartProducts.filter(id => id === product._id).length}
                            </QuantityLabel>
                            <NormalBtn onClick={() => moreOfThisProduct(product._id)}>+</NormalBtn>
                          </td> 
                          <PriceWrapper>Ksh {cartProducts.filter(id => id === product._id).length * product.price}</PriceWrapper>
                        </tr>
                      ))}
                      <tr>
                        
                      </tr> 
                      <tr>
                        <td></td>
                        <TotalWrapper>Total Bill</TotalWrapper>
                        <PriceWrapper>Ksh {total}</PriceWrapper>
                      </tr>                
                    </tbody>
                  </Table>
                )}
              </div>
            )} 
          </Box>
          {!!cartProducts?.length && (
            <Box>
              <CartTitleWrapper>
                <>Payment Section</>            
              </CartTitleWrapper>
              <form ref={form} onSubmit={payHandler}>
                <StyledLabel htmlFor="paymentMode">Mode of Payment &#42;</StyledLabel>
                <StyledSelect id='paymentMode' value={paymentMode} onChange={ev => setPaymentMode(ev.target.value)}>
                  <option value="">Select</option>
                  <option value="Mpesa">Mpesa</option>
                  <option value="Cash">Cash</option>
                </StyledSelect> 
                <PaymentBtn
                  type="submit"  
                >
                  {buttonText}
                </PaymentBtn>
        
                <input 
                  type="hidden" 
                  value={cartProducts.join(',')} 
                  name="products"
                />
              </form>
             
            </Box>
          )}
        </ColumnsWrapper>
      </Center>
    </Bg>
  )
}
