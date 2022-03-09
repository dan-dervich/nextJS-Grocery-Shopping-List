import { Avatar, Button, Grid, Input, Spacer, Text } from '@nextui-org/react'
import jwt from 'jsonwebtoken'
import { Component } from 'react'

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
            <Grid.Container justify='center' alignItems='center' direction='row' style={{minHeight: '100vh'}}>
                <Grid xl={12} justify="center" alignItems='center' direction='row'>
                {this.props?.users?.users?.map((user: string)=>{
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
                        <>
                            <Avatar onClick={chooseAvatar} id={user} key={Math.floor(Math.random()*(this.props.users.length-0+1))+0} css={{color: 'white', margin: 10}} size='xl' color={colors[i]} pointer squared text={user}/>
                        </>
                        )
                })}
                    </Grid>
                <Grid lg={12} xl={12} md={12} sm={12} xs={12} justify="center" alignItems='center' >
                    <form onSubmit={addUser}>
                        {this.state.userState == 'userTaken' ? <Text color='error' h5>Usuario Tomado</Text> : <Text h4>Usuario Nuevo:</Text>}
                    <Spacer y={1.2} />
                        <Input type="text" labelPlaceholder="Nombre" underlined />
                        <Spacer y={1.2} />
                        <Button color="primary" type='submit'>Guardar Usuario</Button>
                    </form>
                </Grid>
            </Grid.Container>
        )
       }
}

export default Users