import { Component } from 'react'
import { withRouter } from 'next/router'
import { Button, Card, Grid, Input, Link, Modal, Spacer, Text } from '@nextui-org/react'

export default withRouter(class ForgotPWD extends Component<any, any>{
    // check user existance:
    static async getInitialProps(ctx: any){
        // fetch logic
        const res = await fetch('https://next-js-grocery-shopping-list-backend.vercel.app/auth/check-user/' + ctx.query.id)
        const data = await res.json()
        return {data}
    }    
    constructor(props: any){
        super(props)
        this.state = {inputStatus: true, formStatus: "noError", errorMessage: ""}
    }
    componentDidMount(){
        if(this.props.data.status ==  "error"){
            this.props.router.push({
                pathname: '/auth/login',
            });
        }
    }
    render(): any{
        const inputHandler = async (e: any)=>{
            const pwd = document.getElementById('password1') as HTMLInputElement
            if(e.target.value == pwd?.value){
                // match
                this.setState({inputStatus: true})
            } else{
                // error
                this?.setState({inputStatus: false})
            }
        }
        const submitHandler: any = async (e: any)=>{
            e.preventDefault()
            const password: string = e.target[0].value
            const password1: string = e.target[2].value
            if(password == password1){
                const res: any = await fetch('https://next-js-grocery-shopping-list-backend.vercel.app/auth/forgotPWD/' + this.props.router.query.id, {
                    body: JSON.stringify({
                        password: password
                    }),
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                      },
                })
                const data: any = await res.json()
                console.log(data)
                if(data.status == true){
                        this.props.router.push('/auth/login')
                } else{
                    this.setState({formStatus: "error", errorMessage: e.data.errorMessage})
                }
            } else{
                this?.setState({inputStatus: false})
            }
        }
        return(
            <>
            <Modal open={this.state.formStatus !== "noError"}>
            <Modal.Body>
                <Grid.Container justify="center" direction='column' alignItems="center">
                                    <Text style={{textAlign: 'center'}} h3>Hubo un Error porfavor contactar al dueño de este proyecto si sigue este error o intentar denuevo en un rato: </Text>

                <Link underline style={{textAlign: 'center'}} href="mailto:dandervich@hotmail.com">dandervich@hotmail.com</Link>
                <p style={{textAlign: 'center'}}>por favor decirle en el email este mensaje: &quot;{this.state.errorMessage}&quot;</p>
                </Grid.Container>
            </Modal.Body>
        </Modal>
            <Grid.Container justify='center' alignItems='center' direction='column' style={{backgroundColor: "#e8e8e8", minHeight: '100vh'}}>
                <Grid xs={11} sm={5} md={4} lg={3} xl={2}>
                <Card shadow>
                    <Card.Header>
                        <Text style={{textAlign: 'center', width: '100%'}} h2>Cambiar Contraseña</Text>
                    </Card.Header>
                    <Card.Body style={{padding: 30}}>
                        <form onSubmit={submitHandler}>
            <Grid.Container justify='center' alignItems='center' direction='column'>
                        <Input.Password clearable bordered labelPlaceholder='Contraseña' id="password1" required />
                        <Spacer y={1} />
            {this.state.inputStatus ? ' ' : <><Text color='error' style={{width: '100%'}} h4>Las Contraseñas no coinciden</Text> <Spacer y={1.5} /> </>}
            <Spacer y={.5} />
                        <Input.Password clearable bordered labelPlaceholder='Contraseña' onInput={inputHandler} required />
                        <Spacer y={2} />
            {this.state.inputStatus ? <Button color="primary" type='submit' >Crear</Button> : <Button color="primary" type='submit' disabled >Crear</Button>}
            </Grid.Container>
                        </form>
                    </Card.Body>
                </Card>
                </Grid>
            </Grid.Container>
            </>
        )
    }
})