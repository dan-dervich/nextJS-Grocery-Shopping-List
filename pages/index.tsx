import { Component } from 'react'
import jwt from 'jsonwebtoken'
import Head from 'next/head'
import { Button, Card, Grid, Spacer, Text } from '@nextui-org/react'

class Home extends Component<any, any>{
  constructor(props: any){
    super(props)
    this.state = {width: '0'}
  }
  componentDidMount(){
    let cookieValue:any = document.cookie.split("username=").join("")
    jwt.verify(cookieValue,
      process.env.JWT_SECRET as string,
    async (err: any, verifiedJwt: any) => {
        if (err) {
            console.log(err.message);
        } else {
          if(verifiedJwt.payload.id){
            window.location.replace('/groceries/' + verifiedJwt.payload.id)
          }
          }
        })
        if(window.innerWidth < 1000){
        this.setState({width: window.innerWidth})
        } else{
          this.setState({width: '55%'})
        }
      }
      render(): any{
        return(
          <>
          <Head>
            <title>Web Para anotar compras hecha por: Dan Dervich</title>
          </Head>
          <Grid.Container justify='center' alignItems='center' direction='row' style={{minHeight: '100vh', backgroundColor: '#d9e8fc'}}>
          <Grid xl={6} lg={6} style={{padding: 20, textAlign: 'center'}}>
              <Text css={{color: '#222'}} h1><b style={{fontWeight: 'bolder'}}>¿Que hace falta comprar del supermercado? <br /> ¿Soles olvidarte la lista en casa? <br /> </b><span style={{fontSize: '.8em', color: '#21201c'}}>Aqui podes guardar todo lo que hace falta para vos y tu familia con facilidad. Todos los miembros de tu familia pueden agregar los productos deseados y que se vean instantaneamente  </span></Text>
            </Grid>
              <Grid xl={6} lg={6} md={10} sm={12} xs={12} justify="center" alignItems='center'>
              <Card shadow style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', width: this.state.width, textAlign: 'center'}}>
                <Text style={{textAlign: 'center'}} h2>Nunca mas te preocupes por no tener a mano la lista del supermercado</Text>
                <Spacer y={1} />
                <img src='/groceries.svg' width="60%" alt="svg de compras para el supermercado" />
                <Spacer y={1} />
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap',}}>
                <a style={{margin: 20}} href='/auth/login'>
              <Button ghost css={{"&:hover":{background: '#2b3e6a', color: 'white'}, color: '#222', borderColor: '#2b3e6a'}} auto>Ingresar</Button>
                </a>
              <a style={{margin: 20}} href='/auth/sign-up'>
              <Button auto css={{background: '#2b3e6a'}}>Crear Cuenta</Button>
              </a>
                </div>
            </Card>
              </Grid>
          </Grid.Container>
          </>
        )
      }
}

export default Home
