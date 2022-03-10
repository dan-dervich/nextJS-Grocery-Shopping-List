import { Button, Card, Grid, Input, Link, Loading, Modal, Spacer, Text } from '@nextui-org/react'
import { Component } from 'react'


class SignUp extends Component<any, any>{
    constructor(props: any){
        super(props)
        this.state = {inputStatus: true, formStatus: "noError", errorMessage: "", submiting: false}
    }
    componentDidMount(){
        let remove = document.cookie.split(';').forEach(cookie => document.cookie = cookie.replace(/^ +/, '').replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`));
        console.log(remove)
    }
    render(): any{
        const submitHandler: any = async (e: any)=>{
            this.setState({submiting: true})
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
                    // No se envio ninguna contraseña a nuestros servidores porfavor intentelo denuevo en un rato
                    this.setState({formStatus: false, errorMessage: "noPasswordSentToBackend"})
                } else if(data.status == "noEmailSentToBackend"){
                    //! error
                    // No se envio ningun email a nuestros servidores porfavor intentelo denuevo en un rato
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
        const feedbackHandler = async (e: any)=>{
            e.preventDefault()
            const email = e.target[0].value
            if(this.state.errorMessage == 'errorSavingUser'){
                // error saving user in the db maybe check if username is already in use?
                const res: any = await fetch('https://next-js-grocery-shopping-list-backend.vercel.app/feedback', {
                    body: JSON.stringify({
                        email: email,
                        feedback: 'error saving user please check logs and maybe to some testing to see if the server is still alive?'
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
                            feedback: 'error saving user please check logs and maybe to some testing to see if the server is still alive?'
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
            } else if(this.state.errorMessage == 'noPasswordSentToBackend'){
                // no password sent to backend maybe check the e.target or if user inserted a blank input
                const res: any = await fetch('https://next-js-grocery-shopping-list-backend.vercel.app/feedback', {
                    body: JSON.stringify({
                        email: email,
                        feedback: 'error with password check input e.target and check if maybe blank inputs are allowed. also do some testing on the server cause it might be down?'
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
                            feedback: 'error with password check input e.target and check if maybe blank inputs are allowed. also do some testing on the server cause it might be down?'
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
            } else if(this.state.errorMessage == 'noEmailSentToBackend'){
                // no email sent to backend maybe check the e.target or if user inserted a blank input
                const res: any = await fetch('https://next-js-grocery-shopping-list-backend.vercel.app/feedback', {
                    body: JSON.stringify({
                        email: email,
                        feedback: 'error with email being sent to backend maybe check the e.target.value and stuff and if the server is still up and running?'
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
                            feedback: 'error with email being sent to backend maybe check the e.target.value and stuff and if the server is still up and running?'
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
                        {this.state.errorMessage == 'errorSavingUser' ? <>
                        <Text style={{textAlign: 'center'}} h3>Hubo un error creando tu usuario hay una posibilidad que ese email ya este en uso o que nuestros servidores esten fallando porfavor intentelo denuevo en un rato. Si el error continua pruebe recuperar su contraseña o ponga su email abajo y le enviara el error a nuestros programadores.</Text>
                        </> : ''}
                        {this.state.errorMessage == 'noPasswordSentToBackend' ? <>
                        <Text style={{textAlign: 'center'}} h3>No se envio ninguna contraseña a nuestros servidores porfavor intentelo denuevo en un rato. Si el error continua porfavor ponga su email abajo y le enviara el error a nuestros programadores.</Text>
                        </> : ''}
                        {this.state.errorMessage == 'noEmailSentToBackend' ? <>
                        <Text style={{textAlign: 'center'}} h3>No se envio ningun email a nuestros servidores porfavor intentelo denuevo en un rato. Si el error continua porfavor ponga su email abajo y le enviara el error a nuestros programadores.</Text>
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
            {this.state.inputStatus ? this.state.submiting == true ? <Button auto clickable={false} color="primary" css={{ px: '$13' }}>
      <Loading color="white" size="sm" />
    </Button> : <Button color="primary" type='submit'>Login</Button> : <Button color="primary" type='submit' clickable={false} disabled >Crear</Button>}
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