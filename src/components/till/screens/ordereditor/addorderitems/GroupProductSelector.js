import {gql, useQuery} from '@apollo/client';
import {LoadingData} from '../../../ui/DisplayUtility';

const GROUP_QUERY = gql`
query GroupData($entityId: ID!){
    productGroup(id:$entityId)
    {
        id,
        name,
        products
        {
            id,
            tillname,
            price
        }

    }
}
`;

export default function GroupProductSelector(props)
{
    const {loading, error, data} = useQuery(GROUP_QUERY,{variables:{entityId: props.groupId}});

    if(loading){return(LoadingData());}
    if(error){return "Error loading data.."}
    
    return(
        <>
            <header className="withNav">
                <div className="navbtn prev" onClick={()=>{props.setCurrentProduct(null)}}><i className="icon-prev"></i></div>
                <h3>Select an Option</h3>
            </header>
            <h4 style={{textAlign:"center"}}>{data.productGroup.name}</h4>
            <div className="area productSelector">
                {
                    data.productGroup.products.map((prod) => (
                        <div key={prod.id} className="product" onClick={()=>{props.setCurrentProduct({type:"product", fromGroup: data.productGroup.id, id: prod.id, price:prod.price})}}>
                            <div className="name">{prod.tillname}</div>
                            <div className="price">£{prod.price}</div>
                        </div>
                    ))
                }
            </div>
        </>
    );
}