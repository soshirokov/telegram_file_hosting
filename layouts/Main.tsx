import { useContext } from 'react'

import { Layout, Menu } from 'antd'
import Head from 'next/head'
import Link from 'next/link'

import { User } from 'context/user'

import { logout } from 'utils/firebase'

import styles from './styles.module.scss'

const { Header, Content, Footer } = Layout

type Props = {
  children: JSX.Element | JSX.Element[]
}

export const Main = ({ children }: Props) => {
  const { userUID } = useContext(User)
  const menuItems = [
    {
      label: (
        <Link
          className={styles.Main__MenuLink}
          data-testid="homeLink"
          href={'/'}
        >
          Home
        </Link>
      ),
      key: 'home',
    },
    {
      label: (
        <Link
          className={styles.Main__MenuLink}
          data-testid="profileLink"
          href={'/profile'}
        >
          Profile
        </Link>
      ),
      key: 'profile',
    },
    {
      label: userUID ? (
        <div
          className={styles.Main__MenuLink_logout}
          data-testid="logoutLink"
          onClick={logout}
        >
          Logout
        </div>
      ) : (
        <Link className={styles.Main__MenuLink} href={'/profile'}>
          Sign In
        </Link>
      ),
      key: 'logout',
    },
  ]

  return (
    <>
      <Head>
        <link
          href="/apple-touch-icon.png"
          rel="apple-touch-icon"
          sizes="180x180"
        />
        <link
          href="/favicon-32x32.png"
          rel="icon"
          sizes="32x32"
          type="image/png"
        />
        <link
          href="/favicon-16x16.png"
          rel="icon"
          sizes="16x16"
          type="image/png"
        />
        <link href="/site.webmanifest" rel="manifest" />
        <link color="#5bbad5" href="/safari-pinned-tab.svg" rel="mask-icon" />
        <meta content="#da532c" name="msapplication-TileColor" />
        <meta content="#ffffff" name="theme-color" />
      </Head>
      <Layout className={styles.Main__Layout}>
        <Header className={styles.Main__Header}>
          <div className={styles.Main__Container}>
            <Menu
              className={styles.Main__Menu}
              items={menuItems}
              mode="horizontal"
              theme="dark"
            />
          </div>
        </Header>
        <Content className={styles.Main__Content}>
          <div className={styles.Main__Container}>
            <div className={styles.Main__Wrap}>{children}</div>
          </div>
        </Content>
        <Footer className={styles.Main__Footer}>
          <div className={styles.Main__Container}></div>
        </Footer>
      </Layout>
    </>
  )
}
