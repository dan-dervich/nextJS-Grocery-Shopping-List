import { Component } from 'react'
import jwt from 'jsonwebtoken'
import Head from 'next/head'
import { Button, Card, Grid, Spacer, Text } from '@nextui-org/react'
import styles from '../styles/Home.module.css'
import IndexCard from '../components/indexCard'
import Link from 'next/link'

class Home extends Component<any, any>{
  constructor(props: any) {
    super(props)
    this.state = { bgColor: '#bcb8a6' }
  }
  componentDidMount() {
    let cookieValue: any = document.cookie.split("username=").join("")
    jwt.verify(cookieValue,
      process.env.JWT_SECRET as string,
      async (err: any, verifiedJwt: any) => {
        if (err) {
          console.log(err.message);
        } else {
          if (verifiedJwt.payload.id) {
            window.location.replace('/groceries/' + verifiedJwt.payload.id)
          }
        }
      })
    if (window.innerWidth < 1000) {
      let ScrollHandler = () => {
        if (window.scrollY > 700) {
          this.setState({ bgColor: '#fff' })
        } else {
          this.setState({ bgColor: '#bcb8a6' })
        }
      }
      document.addEventListener('scroll', ScrollHandler)
    } else {
      this.setState({ bgColor: '#bcb8a6' })
    }
  }
  render(): any {
    return (
      <>
        <Head>
          <title>Una web para anotar todas tus necesidades para el supermercado</title>
          <meta name="description" content="Una web para anotar todas tus necesidades para el supermercado sin preocupaciones de olvidarse la lista o que alguien se halla olvidado de subir algo ya que todo se actualiza instantaneamente." />
          {/* <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin /> */}
          <link href="https://fonts.googleapis.com/css2?family=Rubik+Moonrocks&family=Send+Flowers&display=swap" rel="stylesheet" />
        </Head>
        <div style={{ backgroundColor: this.state.bgColor, transition: '.5s all ease' }}>
          <Grid.Container justify='center' alignItems='center' direction='column' style={{ minHeight: '100vh', backgroundColor: 'transparent' }}>
            <Text style={{ fontFamily: 'Rubik Moonrocks, cursive', textAlign: 'center' }} size="3em" color="white" h1>EL TIEMPO ES ORO PORQUE</Text>
            <Text style={{ fontFamily: 'Rubik Moonrocks, cursive', textAlign: 'center' }} size="3em" color="white" h1>REGALARLO?</Text>
            <Spacer y={1.5} />
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
              <Link href="/auth/login" passHref>
                <Button css={{ background: '#baab5e', fontSize: '20px' }} auto>Ingresar</Button>
              </Link>
              <Spacer x={1.5} />
              <Link href="/auth/sign-up" passHref>
                <Button css={{ borderColor: '#baab5e', color: '#fff', fontSize: '20px' }} auto bordered>Crear Cuenta</Button>
              </Link>
            </div>
            {/* <a href='#down' id={styles.arrow}>
              <svg width="22" height="22" viewBox="0 0 24 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.9393 26.0607C11.5251 26.6464 12.4749 26.6464 13.0607 26.0607L22.6066 16.5147C23.1924 15.9289 23.1924 14.9792 22.6066 14.3934C22.0208 13.8076 21.0711 13.8076 20.4853 14.3934L12 22.8787L3.51472 14.3934C2.92893 13.8076 1.97919 13.8076 1.3934 14.3934C0.807611 14.9792 0.807611 15.9289 1.3934 16.5147L10.9393 26.0607ZM10.5 0L10.5 25H13.5L13.5 0L10.5 0Z" fill="black" />
              </svg>
            </a> */}
          </Grid.Container>
        </div>
      </>
    )
  }
}

export default Home
