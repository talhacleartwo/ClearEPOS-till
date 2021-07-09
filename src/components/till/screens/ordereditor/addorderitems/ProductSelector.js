//Cache
import {getProductsOrGroupsInCategory} from '../../../../../service/storage';

//Utility
import {NoDataToDisplay} from '../../../ui/DisplayUtility';

/*import {gql, useQuery} from '@apollo/client';

const PRODUCT_PANEL_QUERY = gql`
    query AddProductsPanelQuery($categoryId: ID!)
    {
        products(where: { product_categories_in: $categoryId }) {
            id
            name
            price
        }
        productGroups(where: {product_categories_in: $categoryId})
        {
            id,
            name
        }
    }
`;*/

export default function ProductSelector(props)
{
    /*
    //Old Method With Query
    const {loading, error, data} = useQuery(PRODUCT_PANEL_QUERY, {variables: {categoryId: props.category}}); 
    
    if(loading){
        return LoadingData();
    }
    if(error){
        return 'Error loading data';
    }
    */

    const {products, groups} = getProductsOrGroupsInCategory(props.category);
    //console.log(getProductsInCategory(props.category));

    if(products.length === 0 && groups.length === 0)
    {
        return (
            NoDataToDisplay("No Products or Groups to Display")
        );
    }

    return (
        <div className="area productSelector">
            {
                products.map((product) => (
                    <div key={product.id} className="product" onClick={()=>{props.update({id:product.id,type:"product",price:product.price})}}>
                        <div className="name">{product.tillname}</div>
                        <div className="price">£{product.price}</div>
                    </div>
                ))
            }
            {
                groups.map((group) => (
                    <div key={group.id} className="productGroup" onClick={()=>{props.update({id:group.id,type:"group"})}}>
                        <div className="name">{group.tillname}</div>
                        <div className="price">Select Options</div>
                    </div>
                ))
            }
        </div>
    );
}