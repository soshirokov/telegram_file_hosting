import { Layout, Menu } from 'antd'
import Link from 'next/link'

import styles from './styles.module.scss'

const { Header, Content, Footer } = Layout

type Props = {
  children: JSX.Element | JSX.Element[]
}

export const Main = ({ children }: Props) => {
  const menuItems = [
    {
      label: (
        <Link className={styles.Main__MenuLink} href={'/'}>
          Home
        </Link>
      ),
      key: 'home',
    },
    {
      label: (
        <Link className={styles.Main__MenuLink} href={'/profile'}>
          Profile
        </Link>
      ),
      key: 'profile',
    },
  ]

  return (
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
  )
}
