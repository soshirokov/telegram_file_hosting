import type { AppProps } from 'next/app'

import 'antd/dist/antd.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <style global jsx>{`
        * {
          margin: 0;
          padding: 0;
        }
      `}</style>
    </>
  )
}
