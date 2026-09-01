import { Avatar, Button, Card, Grid, Input, Spacer, Text } from '@nextui-org/react'
import jwt from 'jsonwebtoken'
import { Component } from 'react'
import NavBar from '../../components/NavBar'

class Users extends Component<any, any>{
    static async getInitialProps(ctx: any){
        const res: any = await fetch('https://next-js-grocery-shopping-list-backend.vercel.app/r/users/' + ctx.query.id)
        const users: any = await res.json()
        return { id: ctx.query.id, users}
    }

    constructor(props: any){
        super(props)
        this.state = {userState: ""}
    }
    render(): any{
        console.log(this.props);
        const logOut: any = (e?: any)=>{
            if(e) e.preventDefault()
            document.cookie.split(';').forEach(cookie => document.cookie = cookie.replace(/^ +/, '').replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`));
            return window.location.replace('/')
        }
        let addUser: any = async (e: any)=>{
            e.preventDefault()
            let user = e.target[0].value
            if(this.props.users.users.length > 0){
                for(let i = 0; i < this.props.users.users.length; i++){
                    if(user == this.props.users.users[i]){
                        this.setState({userState: "userTaken"})
                    } else{
                        const res: any = await fetch("https://next-js-grocery-shopping-list-backend.vercel.app/c/create-new-family-user/" + this.props.id, {
                            body: JSON.stringify({
                                user: user
                            }),
                            method: "POST",
                            headers: {
                                'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                              }
                        })
                        const data: any = await res.json()
                        console.log(data);

                        if(data.status == true){
                            const payload: Object = {
                                username: user,
                                id: this.props.id,
                            }
                            const token:string = await jwt.sign({
                                payload
                            },
                                process.env.JWT_SECRET as string, {
                                algorithm: 'HS256'
                            },
                            )
                            var now: Date = new Date();
                            // 1 Year
                            now.setTime(now.getTime() + 8760 * 3600 * 1000);
                            // set cookie
                            document.cookie = 'username=' + token + '; path=/;expires=' + now.toUTCString() + ";"
                            window.location.replace('/groceries/' + this.props.id)
                        } else{
                        this.setState({userState: "userTaken"})
                        }
                    }
                }
            } else{
                //? fetch/login?
                const res: any = await fetch("https://next-js-grocery-shopping-list-backend.vercel.app/c/create-new-family-user/" + this.props.id, {
                            body: JSON.stringify({
                                user: user
                            }),
                            method: "POST",
                            headers: {
                                'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                              }
                        })
                        const data: any = await res.json()
                        console.log(data);
                        if(data.status == true){
                            const payload: Object = {
                                username: user,
                                id: this.props.id
                            }
                            const token:string = await jwt.sign({
                                payload
                            },
                                process.env.JWT_SECRET as string, {
                                algorithm: 'HS256'
                            },
                            )
                            var now: Date = new Date();
                            // 3 hours
                            now.setTime(now.getTime() + 8760 * 3600 * 1000);
                            // set cookie
                            document.cookie = 'username=' + token + '; path=/;expires=' + now.toUTCString() + ";"
                            window.location.replace('/groceries/' + this.props.id)
            }
        }
        }
        let chooseAvatar: any = async (e: any)=>{
            let userName: string = e.target.parentNode.id
            const payload: Object = {
                username: userName,
                id: this.props.id
            }
            const token:string = await jwt.sign({
                payload
            },
                process.env.JWT_SECRET as string, {
                algorithm: 'HS256'
            },
            )
            var now: Date = new Date();
            // 3 hours
            now.setTime(now.getTime() + 8760 * 3600 * 1000);
            // set cookie
            document.cookie = 'username=' + token + '; path=/;expires=' + now.toUTCString() + ";"
            window.location.replace('/groceries/' + this.props.id)
        }
        let i = 0;
        return(
            <>
            <NavBar title="Quien Sos?" onLogout={logOut} />
            <Grid.Container justify='center' alignItems='flex-start' direction='row' css={{alignContent: 'flex-start !important'}} style={{minHeight: 'calc(100vh - 57px)', width: '100%', backgroundColor: '#f7f7f5', padding: '24px 16px'}}>
                <Grid xs={12} sm={10} md={8} lg={6} justify="center" alignItems='center'>
                    {this.props?.users?.users?.length > 0 ? (
                        <Grid.Container justify='center' alignItems='center' gap={1}>
                            {this.props.users.users.map((user: string)=>{
                                type NormalColors = 'default' | 'primary' | 'secondary' | 'success'| 'warning'| 'error'| 'gradient';
                                let colors: NormalColors[] = [
                                    'default',
                                    'primary',
                                    'secondary',
                                    'success',
                                    'warning',
                                    'error',
                                    'gradient'
                                ]
                                i++
                                return(
                                    <Grid key={user} style={{display: 'flex', justifyContent: 'center'}}>
                                        <Avatar onClick={chooseAvatar} id={user} css={{color: 'white', margin: 10, cursor: 'pointer'}} size='xl' color={colors[i % colors.length]} pointer squared text={user}/>
                                    </Grid>
                                )
                            })}
                        </Grid.Container>
                    ) : (
                        <Text style={{textAlign: 'center', color: '#8a8a8a', width: '100%'}} h5>Todavia no hay usuarios en esta familia, crea el primero abajo</Text>
                    )}
                </Grid>
                <Spacer y={2}/>
                <Grid xs={12} sm={8} md={6} lg={4}>
                    <Card shadow>
                        <Card.Body style={{padding: 30}}>
                            <form onSubmit={addUser}>
                                <Grid.Container direction='column' justify='center' alignItems='center'>
                                    {this.state.userState == 'userTaken' ? <><Text color='error' h5 style={{margin: 0}}>Usuario Tomado</Text><Spacer y={0.75}/></> : <><Text h4 style={{margin: 0}}>Usuario Nuevo:</Text><Spacer y={0.75}/></>}
                                    <Input type="text" labelPlaceholder="Nombre" underlined fullWidth required/>
                                    <Spacer y={1.2} />
                                    <Button color="primary" type='submit' css={{width: '100%'}}>Guardar Usuario</Button>
                                </Grid.Container>
                            </form>
                        </Card.Body>
                    </Card>
                </Grid>
            </Grid.Container>
            </>
        )
       }
}

export default Users
