import { Button, Card, Grid, Input, Link, Modal, Spacer, Text } from '@nextui-org/react'
import { Component } from 'react'


class SignUp extends Component<any, any>{
    constructor(props: any){
        super(props)
        this.state = {inputStatus: true, formStatus: "noError", errorMessage: ""}
    }
    render(): any{
        const submitHandler: any = async (e: any)=>{
            e.preventDefault()
            
            const email: string = e.target[0].value
            const password: string = e.target[2].value
            const confirmedPassword: string = e.target[4].value
            
            if(password !== confirmedPassword) this.setState({inputStatus: false})
            else{
                const res: any = await fetch('https://next-js-grocery-shopping-list-backend.vercel.app/c/new-user', {
                    body: JSON.stringify({
                        email: email,
                        password: password
                    }),
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                      },
                })
                interface res {
                    status: string,
                    id: any
                }
                const data: res = await res.json()
                if(data.status == "errorSavingGrocery"){
                    //! error
                    this.setState({formStatus: false, errorMessage: "errorSavingUser"})
                } else if(data.status == "savedCorrectly"){
                    //* success
                    window.location.replace('/users/' + data.id)
                } else if(data.status == "noPasswordSentToBackend"){
                    //! error
                    this.setState({formStatus: false, errorMessage: "noPasswordSentToBackend"})
                } else if(data.status == "noEmailSentToBackend"){
                    //! error
                    this.setState({formStatus: false, errorMessage: "noEmailSentToBackend"})
                }
            }
        }
        const inputHandler = (e: any)=>{
            const pwd = document.getElementById('password1') as HTMLInputElement
            if(e.target.value == pwd?.value){
                // match
                this.setState({inputStatus: true})
            } else{
                // error
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
            <Grid.Container justify='center' alignItems='center' style={{minHeight: '100vh', backgroundColor: "#e8e8e8"}}>
                <Grid xs={11} sm={5} md={4} lg={3} xl={2}>
            <Card shadow>
                <Card.Header style={{color: 'transparent', borderBottom: '1px solid lightgrey'}}>
            <Grid.Container justify='center' alignItems='center'>
                    <Text h1>Crear Cuenta</Text>
                    </Grid.Container>
                </Card.Header>
                <Card.Body style={{padding: 40, borderBottom: '1px solid lightgrey'}}>
                    <form onSubmit={submitHandler}>
            <Grid.Container alignItems='center' direction='column' style={{minHeight: '30vh', width: '100%'}}>
            <Input clearable shadow type="email" label='Email' placeholder='example@example.com'size='md' required bordered fullWidth />
            <Spacer y={1.5} />
            <Input.Password shadow type="password" label='Contraseña' placeholder='contraseña' size='md' id="password1" required clearable fullWidth bordered />
            <Spacer y={1.5} />
            {this.state.inputStatus ? ' ' : <><Text color='error' style={{width: '100%'}} h4>Las Contraseñas no coinciden</Text> <Spacer y={1.5} /> </>}
            <Input.Password shadow type="password" label='Confirmar Contraseña' placeholder='contraseña' size='md' required onInput={inputHandler} clearable fullWidth bordered />
            <Spacer y={1.5} />
            {this.state.inputStatus ? <Button color="primary" type='submit' >Crear</Button> : <Button color="primary" type='submit' disabled >Crear</Button>}
            <Spacer y={.5} />
            <Link href='/auth/forgotPWD' underline >Olvidaste tu contraseña?</Link>
            </Grid.Container>
                    </form>
                </Card.Body>
                <Card.Footer>
            <Grid.Container justify='center' alignItems='center' direction='column'>
                <Text size="1.2em" style={{color: "#5e5e5e"}}>Ya tienes una cuenta?</Text>
                <Link href="/auth/login/" underline>Ingresa</Link>
                    </Grid.Container>
                </Card.Footer>
            </Card>
                </Grid>
            </Grid.Container>
            </>
        )
    }
}
export default SignUp