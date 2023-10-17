import { CartContextProvider } from "@/components/CartContext";
import { createGlobalStyle } from "styled-components"
import Head from 'next/head'

const GlobalStyles = createGlobalStyle`
  body{
    background-color: black;
    margin: 0;
    padding: 0;
  }

`;

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Shop Internal</title>
      </Head>
      <GlobalStyles />
      <CartContextProvider>
        <Component {...pageProps} />
      </CartContextProvider>
    </>
  )
}
