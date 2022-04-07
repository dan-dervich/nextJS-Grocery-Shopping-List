import {Text, Card} from '@nextui-org/react'


function IndexCard(props: any){
    return(
        <Card shadow>
        <Card.Header>
            {/* Anotador de compras */}
            <Text style={{textAlign: 'center'}} h1>{props.headerText}</Text>
        </Card.Header>
        <Card.Body style={{padding: 20}}>
            {/* /groceries.svg */}
            <img src={props.imageURL} alt="image describing what this does."/>
            {/* Esta parte de la web es para anotar compras y luego poder acederlas desde donde sea. */}
<Text style={{textAlign: 'center'}} weight="thin" h5>{props.descriptiveText}</Text>
        </Card.Body>
      </Card>
    )
}

export default IndexCard