import {useState} from 'react';
//import {gql, useQuery} from '@apollo/client';

//Services
//import {LoadingData} from '../../../ui/DisplayUtility';
import {getCatalogProduct} from '../../../../../service/storage';

//UI
import Tabs from '../../../controls/Tabs';
import ExtrasTab from './tabs/ExtrasTab';
import OptionsTab from './tabs/OptionsTab';
import AllergensTab from './tabs/AllergensTab';

/*const PRODUCT_QUERY = gql`
    query ProductData($entityId: ID!){
        product(id:$entityId)
        {
            id,
            name,
            price,
            extras(sort:"name:asc")
            {
                id,
                name,
                price,
                consumes
                {
                    defaultingredient
                    {
                        flags
                        {
                            id,
                            name
                        }
                    }
                }
            },
            consumes
            {
                id,
                configurable,
                defaultingredient
                {
                    name,
                    flags
                    {
                        id,
                        name
                    }
                }
                alternatives
                {
                    id,
                    price,
                    ingredient
                    {
                        name,
                        flags
                        {
                            id,
                            name
                        }
                    }
                    
                }

            }
        }
    }
`;*/


function getDefaultProductOptions(product)
{
    var newOpts = [];
    //if(!data){return newOpts;}
    //var product = data.product
    for(var oconsume of product.consumes)
    {
        newOpts.push({
            consumeId : oconsume.id,
            isDefault: true,
        });
    }
    return newOpts;
}


function ProductEditor(props)
{
    //State to store the item we are editing
    const [existingItem,setExistingItem] = useState(props.itemToEdit);
    /*
    //Old Method with query
    const {loading, error, data} = useQuery(PRODUCT_QUERY,{variables:{entityId: props.productModel.id}, onCompleted:(data)=>{
        
        if(!props.existingItem)
        {
            updateProductData({
                productId: props.productModel.id,
                itemmeta: {
                    options: getDefaultProductOptions(data),
                    extras: [],
                },
                price: props.productModel.price
            });
        }
        
    }});
    const [productData,updateProductData] = useState(
        props.existingItem ? props.existingItem : null
    );

    if(loading || !productData){return(LoadingData());}
    if(error){return "Error loading data.."}
    */

    //Updates the item we are currently editing (whether is a new item or not)
    function updateExistingItem(updatedItem)
    {
        setExistingItem(updatedItem);
    }

    //Fetch Data about this product from the catalog cache if we're not editing a line item
    const productModel = getCatalogProduct(props.productId);

    //If we dont have an existing item, we need an empty lineitem object to start working with
    if(!existingItem)
    {
        setExistingItem({
            productId: productModel.id,
            itemmeta: {
                options: getDefaultProductOptions(productModel),
                extras: [],
            },
            price: productModel.price
        });
    }

    //console.log(data);
    console.log("Product Model:", productModel);

    function performProductAddOrUpdate()
    {
        if(!existingItem.id)
        {
            //Add the new item to the order
            props.addNewItemToOrder(existingItem);
        }
        else
        {
            //Update the product data?? (productData should be updated whenever a control is pressed in the editor.. so it should awaywas be uptodate)

            //Return the updated item
            props.updateOrderItem(existingItem)
        }

    }


    function performProductRemove()
    {
        props.removeItemFromOrder(existingItem.id);
    }


    function cancel()
    {
        props.discardChanges();
    }


    function productHasOptions(productConsumes)
    {
        for(var consume of productConsumes)
        {
            if(consume.alternatives.length > 0 || consume.configurable) {return true}
        }
    } 


    function getStartTab(product)
    {
        if(productHasOptions(product.consumes)){return 'options';}
        return 'extras';
    }

    function getTabHeaders(product)
    {
        var headers = [];
        if(productHasOptions(product.consumes)){headers.push({key:"options", title:"Options", icon:"customise"});}
        
        if(product.extras.length > 0){headers.push({key:"extras", title:"Extras", icon:"extras"});}
        //headers.push({key:"configure", title:"Configure",icon:"customise"});
        headers.push({key:"allergens", title:"Allergens",icon:"warning"});
        
        return headers;
    }

    function getTabBodies(product)
    {
        var bodies = [];
        if(productHasOptions(product.consumes)){
            bodies.push(
                <OptionsTab 
                    key="options" 
                    updateExistingItem={updateExistingItem} 
                    productModel={productModel}
                    existingItem={existingItem}
                />
            );
        }
        if(product.extras.length > 0)
        {
            bodies.push(
                <ExtrasTab 
                    key="extras" 
                    updateExistingItem={updateExistingItem}
                    productModel={productModel}
                    existingItem={existingItem}
                />
            );
        }
        bodies.push(
            <AllergensTab 
                key="allergens"
                productModel={productModel}
                existingItem={existingItem}
            />
        );
        return bodies;
    }

    return(
        <div id="ProductEditor">
            {
                <>
                    <header className="withNav editorHeading">
                        {
                            /*props.productModel.fromGroup?.id ? 
                                <div className="navbtn prev" onClick={()=>{props.setCurrentProduct({type: "group", id: props.productModel.fromGroup})}}>
                                    <i className="icon-prev"></i>
                                </div> 
                            : 
                                <div className="navbtn prev" onClick={cancel}>
                                    <i className="icon-prev"></i>
                                </div>*/
                        }
                        <h3>{!existingItem.id ? "Add " : "Edit "} Item '{productModel.name}'</h3>
                    </header>
                    <div className="editorTabsWrapper">
                        <Tabs startTab={getStartTab(productModel)} 
                            tabHeaders={getTabHeaders(productModel)} 
                            tabBodys={getTabBodies(productModel)}
                        />
                        
                    </div>
                    <div className="productActions">
                        <div className="f_left">
                            <div className="btn btn-info" onClick={cancel}><i className="icon-cancel"></i>Cancel Edit</div>
                        </div>
                        {
                            existingItem.id ? (<div className="btn btn-danger" onClick={performProductRemove}><i className="icon-trash"></i>Remove Item</div>) : null
                        }
                        <div className="f_right">
                            <div className="btn btn-success" onClick={performProductAddOrUpdate}><i className="icon-confirm"></i>{!existingItem.id ? "Add to Order" : "Update Item"}</div>
                        </div>
                    </div>
                </>
            }
        </div>
        
    );
    

}

export default ProductEditor;