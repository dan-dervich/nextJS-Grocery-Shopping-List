import { Component } from 'react'
import { Grid, Input, Button, Spacer, Card, Checkbox, Text, Modal } from '@nextui-org/react'
import jwt from 'jsonwebtoken'
import NavBar from '../../components/NavBar'

class Groceries extends Component<any, any>{
  static async getInitialProps(ctx: any){
    const res = await fetch('https://next-js-grocery-shopping-list-backend.vercel.app/r/all-groceries/' + ctx.query.id)
    const data = await res.json()
    return { data, id: ctx.query.id}
  }
  constructor (props: any){
    super(props)
    this.state = { user: '', addOpen: false }
  }

  componentDidMount(){
    let cookieValue:any = document.cookie.split("username=").join("")
    jwt.verify(cookieValue,
      process.env.JWT_SECRET as string,
    async (err: any, verifiedJwt: any) => {
        if (err) {
            console.log(err.message);
            // error herer:
            document.cookie.split(';').forEach(cookie => document.cookie = cookie.replace(/^ +/, '').replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`));
            return window.location.replace('/auth/login')
        } else {
            if(verifiedJwt.payload.username.length > 0){
              this.setState({user: verifiedJwt.payload.username})
            }
          }
        })
      }
  render(): any{
    let data = this.props.data
    const logOut: any = (e?: any)=>{
      if(e) e.preventDefault()
      document.cookie.split(';').forEach(cookie => document.cookie = cookie.replace(/^ +/, '').replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`));
      return window.location.replace('/')
    }
    const submitHandler = async (e: any)=>{
        e.preventDefault()
        const comida: string = e.target[0].value
        const cantidad: string = e.target[1].value

        const res: any = await fetch('https://next-js-grocery-shopping-list-backend.vercel.app/c/grocery/' + this.props.data.id, {
            body: JSON.stringify({
                comida: comida,
                cuantity: cantidad,
                appendedBy: this.state.user,
                grocery_item_name: comida,
            }),
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
              },
        })
        const data: any = await res.json()
        if(data.status == true){
          window.location.reload()
        }
    }
    const guardarCambios = async (e: any)=>{
      // save changes
      e.preventDefault()
      let item: string = e.target[0].value
      let cuantity: string = e.target[1].value
      let groceryId:string = e.target[3].id
      const res: any = await fetch('https://next-js-grocery-shopping-list-backend.vercel.app/c/update/' + e.target.id, {
        body: JSON.stringify({
          item: item,
          cuantity: cuantity,
          appendedBy: this.state.user,
          id: groceryId
        }),
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
      })
      const data: any = await res.json()
      if(data.status == true){
        window.location.reload()
      } else{
        window.location.reload()
      }
    }
    const boughtItem = async (e: any)=>{
      // delete item
      if(!window.confirm('Quitar este producto de la lista?')) return
      let id = e.target.id
      const res: any = await fetch('https://next-js-grocery-shopping-list-backend.vercel.app/d/grocery/' + id)
      const data: any = await res.json()
      if(data.status == true){
        window.location.reload()
      } else{
        window.location.reload()
      }
    }
    return(
      <>
        <NavBar title="Mi Lista" onLogout={logOut} />
        <Modal closeButton open={this.state.addOpen} onClose={()=>this.setState({addOpen: false})} aria-labelledby="add-item-title">
          <Modal.Header>
            <Text id="add-item-title" h3 style={{margin: 0}}>Agregar Producto</Text>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={submitHandler} style={{display: 'flex', flexDirection: 'column', paddingTop: 20}}>
              <Input type='text' labelPlaceholder='Comida/Item necesitado' underlined fullWidth required/>
              <Spacer y={1.5}/>
              <Input type='text' labelPlaceholder='Cantidad' underlined fullWidth required/>
              <Spacer y={1.5}/>
              <Button type='submit' color='primary'>Guardar</Button>
            </form>
          </Modal.Body>
        </Modal>
        <Grid.Container justify='center' alignItems='flex-start' style={{minHeight: '100vh', width: '100%', backgroundColor: '#f7f7f5'}}>
          <Grid xs={12} sm={10} md={8} lg={6} style={{padding: '20px 16px 100px'}}>
            {(!data.groceries || data.groceries.length === 0) ? (
              <Grid.Container justify='center' alignItems='center' direction='column' style={{minHeight: '50vh', textAlign: 'center'}}>
                <Text h4 style={{color: '#8a8a8a'}}>Tu lista esta vacia</Text>
                <Spacer y={0.5}/>
                <Text style={{color: '#a8a8a8'}}>Apreta el boton + para agregar tu primer producto</Text>
              </Grid.Container>
            ) : (
              <Grid.Container gap={1.5} justify='center' alignItems='flex-start'>
                {data.groceries?.map((grocery: any)=>{
                  return(
                    <Grid xs={12} key={grocery.id} css={{height: 'auto'}}>
                      <Card shadow style={{width: '100%', padding: 4, height: 'auto'}}>
                        <Card.Body style={{padding: 16}}>
                          <form id={this.props.id} onSubmit={guardarCambios} style={{display: 'flex', flexDirection: 'column'}}>
                            <Text size={13} style={{color: '#9a9a9a', margin: 0, display: 'block'}}>{grocery.appendedBy} el {grocery.createdOn}</Text>
                            <div style={{display: 'flex', gap: 12, flexWrap: 'wrap', paddingTop: 34}}>
                              <div style={{flex: '1 1 160px'}}>
                                <Input underlined labelPlaceholder='Compra' initialValue={grocery.grocery_item_name} fullWidth/>
                              </div>
                              <div style={{flex: '0 1 90px'}}>
                                <Input underlined labelPlaceholder='Cantidad' initialValue={grocery.cuantity} fullWidth/>
                              </div>
                            </div>
                            <Spacer y={1}/>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12}}>
                              <Checkbox id={grocery.id} checked={grocery.bought} color='gradient' labelColor="primary" line onClick={boughtItem}>
                                Listo
                              </Checkbox>
                              <Button id={grocery.id} auto size="sm">Guardar Cambios</Button>
                            </div>
                          </form>
                        </Card.Body>
                      </Card>
                    </Grid>
                  )
                })}
              </Grid.Container>
            )}
          </Grid>
        </Grid.Container>
        <button
          aria-label="Agregar producto"
          onClick={()=>this.setState({addOpen: true})}
          style={{
            position: 'fixed',
            right: 'max(20px, env(safe-area-inset-right) + 12px)',
            bottom: 'max(20px, env(safe-area-inset-bottom) + 12px)',
            width: 60,
            height: 60,
            borderRadius: '50%',
            border: 'none',
            backgroundColor: '#baab5e',
            color: '#fff',
            fontSize: 32,
            lineHeight: '60px',
            textAlign: 'center',
            boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
            cursor: 'pointer',
            zIndex: 90,
          }}
        >
          +
        </button>
      </>
    )
  }
}


export default Groceries
