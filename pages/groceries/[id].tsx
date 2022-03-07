import { Component } from 'react'
import { Grid, Input, Button, Spacer, Card, Checkbox, Text } from '@nextui-org/react'
import jwt from 'jsonwebtoken'


class Groceries extends Component<any, any>{
  static async getInitialProps(ctx: any){
    const res = await fetch('https://next-js-grocery-shopping-list-backend.vercel.app/r/all-groceries/' + ctx.query.id)
    const data = await res.json()
    return { data }
  }
  constructor (props: any){
    super(props)
    this.state = { user: '' }
  }

  componentDidMount(){
    let cookieValue:any = document.cookie.split("username=").join("")
    jwt.verify(cookieValue,
      process.env.JWT_SECRET as string,
    async (err: any, verifiedJwt: any) => {
        if (err) {
            console.log(err.message);
            // error herer:
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
      // const clearCookies = document.cookie.split(';').forEach(cookie => document.cookie = cookie.replace(/^ +/, '').replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`));
      // console.log(clearCookies)
    const submitHandler = async (e: any)=>{
        e.preventDefault()
        console.log(e.target)
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
      let cuantity: string = e.target[0].value    
      let item: string = e.target[1].value
      const res: any = await fetch('https://next-js-grocery-shopping-list-backend.vercel.app/c/update/' + e.target[2].id, {
        body: JSON.stringify({
          item: item,
          cuantity: cuantity,
          appendedBy: this.state.user
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
      let id = e.target.id
      console.log(id);
      const res: any = await fetch('https://next-js-grocery-shopping-list-backend.vercel.app/d/grocery/' + id)
      const data: any = await res.json()
      if(data.status == true){
        window.location.reload()
      } else{
        window.location.reload()
      }
    }
    return(
            <Grid.Container justify='center' alignItems='center' direction='column' style={{minHeight: '100vh', width: '100%'}}>
        <form onSubmit={submitHandler} style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: "row", flexWrap: 'wrap'}}>
        <Input type='text' labelPlaceholder='Comida/Item necesitado' underlined/>
        <Spacer x={1} y={1}/>
        <Input type='text' labelPlaceholder='Cantidad' underlined/>
        <Spacer x={1} y={1}/>
        <Grid justify='center' alignItems='center'>
        <Spacer x={1} y={1}/>
        <Button type='submit'>Guardar</Button>
        </Grid>
        </form>
        <Spacer y={3}/>
        <Grid xs={12} sm={12}>
        <Card style={{width: '100%'}}>
        <Grid.Container justify="center" alignItems='center' direction='row' style={{width: '100%'}} wrap='wrap' >
          {data.groceries?.map((grocery: any)=>{
            return(
              <>
              <Spacer y={3}/>
              <Grid xs={12} sm={12} justify='center' alignItems='center' style={{flexWrap:'wrap'}}>
                <form id={grocery._id} onSubmit={guardarCambios} style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                <div>
                  <Text h5>{grocery.appendedBy} el {grocery.createdOn}</Text>
                  <Input underlined initialValue={grocery.grocery_item_name}/>
                <Spacer x={1}/>
                  <Input underlined initialValue={grocery.cuantity}/>
                  </div>
                <Spacer x={1}/>
                <div>
                <Checkbox id={grocery._id} checked={grocery.bought} color='gradient' labelColor="primary" line onClick={boughtItem}>
                  Listo
                  </Checkbox>
                <Spacer x={1}/>
                  <Button auto>Guardar Cambios</Button>
                </div>
                </form>
              </Grid>
              </>
                )
              })}
        </Grid.Container>
        </Card>
        </Grid>
    </Grid.Container>
    )
  }
}


export default Groceries
