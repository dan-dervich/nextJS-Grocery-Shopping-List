import { Component } from 'react'
import jwt from 'jsonwebtoken'
import Head from 'next/head'
import { Button, Grid, Spacer, Text } from '@nextui-org/react'


class Home extends Component<any, any>{
  componentDidMount(){
    let cookieValue:any = document.cookie.split("username=").join("")
    jwt.verify(cookieValue,
      process.env.JWT_SECRET as string,
    async (err: any, verifiedJwt: any) => {
        if (err) {
            console.log(err.message);
            // return window.location.replace('/auth/login')
        } else {
          if(verifiedJwt.payload.id){
            window.location.replace('/groceries/' + verifiedJwt.payload.id)
          }
          }
        })
      }
      render(): any{
        return(
          <>
          <Head>
            <title>Web Para anotar compras hecha por: Dan Dervich</title>
          </Head>
          <Grid.Container justify='center' alignItems='center' style={{paddingLeft: 100,paddingRight: 100, minHeight: '100vh', backgroundColor: '#ced2d2'}}>
            <div style={{background: "#f0efe9", width: '100%', minHeight: '80vh', borderRadius: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
              <Text size="3em" css={{color: '#222'}} h1><b style={{fontWeight: 'bolder'}}>Te Olividas La Lista Para El Super Seguido?</b> <br /> <span style={{fontSize: '.8em', color: '#21201c'}}>Aca podes guardar todas tus compras para vos y tu familia con <br /> facilidad sin tener el problema de olvidarse la lista. </span></Text>
              <Spacer y={2} />
              <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                <a href='/auth/login'>
              <Button ghost color="warning">Ingresar</Button>
                </a>
              <Spacer x={2} />
              <a href='/auth/sign-up'>
              <Button color="warning">Crear Cuenta</Button>
              </a>
              </div>
            </div>
          </Grid.Container>
          </>
        )
      }
}

export default Home
