import { Button, Card, Grid, Input, Link, Spacer, Text } from "@nextui-org/react";
import { Component } from "react";

class ForgotPWD extends Component<any, any>{
    constructor(props: any){
        super(props)
        this.state = {email: "notSent"}
    }
    render(): any{
        const submitHandler = async (e: any)=>{
            e.preventDefault()
            const email: string = e.target[0].value
            const res: any = await fetch('https://next-js-grocery-shopping-list-backend.vercel.app/auth/forgotPWD', {
                body: JSON.stringify({
                    email: email
                }),
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                  },
            })
            const {status} = await res.json()
            console.log(status);
            if(status == true){
                this.setState({email: "sent"})
            } else{
                this.setState({email: "error"})
            }
        }
        return(
            <>
            {/* sent */}
            {this.state.email == "sent" ? <Grid.Container style={{minHeight: '100vh', backgroundColor: "#e8e8e8"}}>
                <Text css={{
      textGradient: '45deg, $blue500 -20%, $pink500 50%'
    }} h1>Email enviado porfavor apretar el link para restablecer su contraseña</Text>
            </Grid.Container> : ''}
            {/* error */}
            {this.state.email == "error" ? <Grid.Container justify="center" alignItems="center" style={{minHeight: '100vh'}}>
            <Text css={{color: "#f21361"}} h1>Hubo un error porfavor intentelo denuevo mas tarde</Text>
            </Grid.Container> : ''}
            {/* regular */}
            {this.state.email == "notSent"? 
            <Grid.Container justify="center" alignItems="center"  style={{minHeight: '100vh', backgroundColor: "#e8e8e8"}}>
                <Grid xs={11} sm={5} md={4} lg={3} xl={2}>
                <Card shadow>
                    <Card.Header>
                        <Text style={{width: '100%', textAlign: 'center'}} h2>Olvidaste Tu Contraseña?</Text>
                    </Card.Header>
                    <Card.Body style={{paddingTop: 40}}>
                    <form onSubmit={submitHandler}>
            <Grid.Container direction="column" justify="center" alignItems="center">
                        <Input bordered type="email" labelPlaceholder="Email" required />
                        <Spacer y={1.5}/>
                        <Button color="primary" type="submit">Restaurar Contraseña</Button>
                        </Grid.Container>
                    </form>
                    </Card.Body>
                    <Card.Footer>
                        <Grid.Container justify="center" alignItems="center">
                        <Link href="/auth/login" underline>Ingresar a su cuenta</Link>
                        <Link href="/auth/sign-up" underline>Registrar una cuenta nueva</Link>
                        </Grid.Container>
                    </Card.Footer>
                </Card>
                </Grid>
            </Grid.Container>
            : ""}
                </>
                )
    }
}

export default ForgotPWD