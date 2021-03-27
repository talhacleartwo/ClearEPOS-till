import {useState} from 'react';
import {gql, useQuery} from '@apollo/client';
import {LoadingData} from '../../../ui/DisplayUtility';

const PRODUCT_QUERY = gql`
    query ProductData($entityId: ID!){
        product(id:$entityId)
        {
            id,
            name,
            price,
            extras
            {
                id,
                tillname,
                price
            }
        }
    }
`;

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
function ProductEditor(props)
{
    const queryToUse = props.entity.type == "product" ? PRODUCT_QUERY : GROUP_QUERY;
    const {loading, error, data} = useQuery(queryToUse,{variables:{entityId: props.entity.id}});
    const [productData,updateProductData] = useState();

    if(loading){return(LoadingData());}
    if(error){return "Error loading data.."}
    
    return(
        <div id="ProductEditor">
            {
                props.entity.type === "product" ?
                (
                    <>
                        <div className="editorHeading">{props.addingNew ? "Add " : "Edit "} Item '{data.product.tillname}'</div>
                        {console.log(data)}
                    </>
                )
                :
                (
                    <>
                        <header style={{textAlign:"center"}}>
                            <h3>Select an Option</h3>
                            <h4>{data.productGroup.name}</h4>
                        </header>
                        <div className="area productSelector">
                            {
                                data.productGroup.products.map((prod) => (
                                    <div key={prod.id} className="product">
                                        <div className="name">{prod.tillname}</div>
                                        <div className="price">£{prod.price}</div>
                                    </div>
                                ))
                            }
                        </div>
                    </>
                )
            }
        </div>
        
    );
    

}

export default ProductEditor;