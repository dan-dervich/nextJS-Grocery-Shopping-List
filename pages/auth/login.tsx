import { Button, Card, Grid, Input, Link, Loading, Modal, Spacer, Text } from '@nextui-org/react'
import { Component } from 'react'

class Login extends Component<any, any>{
    constructor(props: any){
        super(props)
        this.state = {formStatus: "noError",errorMessage: '', inputStatus: "noError", submiting: false}
    }
    componentDidMount(){
        let remove = document.cookie.split(';').forEach(cookie => document.cookie = cookie.replace(/^ +/, '').replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`));
        console.log(remove)
    }
    render(): any{
        const submitHandler: any = async (e:any)=>{
            this.setState({submiting: true})
            e.preventDefault()
            const email: string = e.target[0].value
            const password: string = e.target[2].value

            const res: any = await fetch('https://next-js-grocery-shopping-list-backend.vercel.app/auth/login',  {
                body: JSON.stringify({
                    email: email,
                    password: password
                }), 
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                  },
            })
            const data: any = await res.json()
            console.log(data)
            if(data.status == "everythingIsOk"){
                //* success
                window.location.replace('/users/' + data.id)
            } else if(data.status == "noUserWithThatEmailOrPassword"){
                this.setState({inputStatus: "noUserWithThatEmailOrPassword"})
            } else if(data.status == "wrongPassword"){
                this.setState({inputStatus: "wrongPassword"})
            } else if(data.status == "errorWithInput"){
                this.setState({formStatus: false, errorMessage: "errorWithInput"})
            }
        }
        const feedbackHandler = async (e: any)=>{
            e.preventDefault()
            const email = e.target[0].value
            if(this.state.errorMessage == 'errorWithInput'){
                // error saving user in the db maybe check if username is already in use?
                const res: any = await fetch('https://next-js-grocery-shopping-list-backend.vercel.app/feedback', {
                    body: JSON.stringify({
                        email: email,
                        feedback: 'with input on login page please check logs and maybe to some testing to see if the server is still alive?'
                    }), 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
                })
                const {status} = res.json()
                if(status == true){
                    window.location.reload()
                } else{
                    const res1: any = await fetch('https://next-js-grocery-shopping-list-backend.vercel.app/feedback', {
                        body: JSON.stringify({
                            email: email,
                        feedback: 'with input on login page please check logs and maybe to some testing to see if the server is still alive?'
                        }), 
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        }
                    })
                    const {status} = res1.json()
                    console.log(status);
                    
                }
            }
        }
        return(
            <>
            <Modal open={this.state.formStatus !== "noError"}>
                <Modal.Body>
                    <Grid.Container justify="center" direction='column' alignItems="center">
                        {this.state.errorMessage == 'errorWithInput' ? <>
                        <Text style={{textAlign: 'center'}} h3>Hubo un error creando tu usuario porfavor intentelo denuevo en un rato. Si el error continua pruebe recuperar su contraseña o ponga su email abajo y le enviara el error a nuestros programadores.</Text>
                        </> : ''}
                        <form style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}} onSubmit={feedbackHandler}>
                            <Spacer y={1.5} />
                        <Input shadow bordered labelPlaceholder='Su Email' type="email" />
                            <Spacer y={1.5} />
                        <Button  type='submit'>Enviar Feedback</Button>
                        </form>
                    </Grid.Container>
                </Modal.Body>
            </Modal>
            <Grid.Container justify='center' alignItems='center' style={{minHeight: '100vh', backgroundColor: "#e8e8e8"}}>
                <Grid xs={11} sm={5} md={4} lg={3} xl={2}>
            <Card shadow>
                <Card.Header style={{color: 'transparent', borderBottom: '1px solid lightgrey'}}>
            <Grid.Container justify='center' alignItems='center'>
                    <Text h1>Login</Text>
                    </Grid.Container>
                </Card.Header>
                <Card.Body style={{padding: 40, borderBottom: '1px solid lightgrey'}}>
                    <form onSubmit={submitHandler}>
            <Grid.Container alignItems='center' direction='column' style={{minHeight: '30vh', width: '100%'}}>
            {this.state.inputStatus == "noUserWithThatEmailOrPassword" ? <><Text color='error' h4>No existe un usuario con ese email</Text><Spacer y={1}/></> : ""}
            <Input clearable shadow type="email" label='Email' placeholder='example@example.com'size='md' required fullWidth bordered />
            <Spacer y={1.5} />
            {this.state.inputStatus == "wrongPassword" ? <><Text color='error' h4>Contraseña Incorrecta</Text><Spacer y={1}/></> : ""}
            <Input.Password shadow type="password" label='Contraseña' placeholder='contraseña' size='md' required fullWidth clearable bordered />
            <Spacer y={1.5} />
            {this.state.submiting == true ? <Button auto clickable={false} color="primary" css={{ px: '$13' }}>
      <Loading color="white" size="sm" />
    </Button> : <Button color="primary" type='submit'>Login</Button>}
            <Spacer y={.5} />
                    <Link href='/auth/forgotPWD' underline >Olvidaste tu contraseña?</Link>
            </Grid.Container>
                    </form>
                </Card.Body>
                <Card.Footer>
            <Grid.Container justify='center' alignItems='center' direction='column'>
                <Text size="1.2em" style={{color: "#5e5e5e"}}>No tienes una cuenta?</Text>
                <Link href="/auth/sign-up/" underline>Crear Una Cuenta</Link>
                    </Grid.Container>
                </Card.Footer>
            </Card>
                </Grid>
            </Grid.Container>
            </>
        )
    }
}
export default Login