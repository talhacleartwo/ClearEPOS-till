export default function ExtrasTab(props)
{
    /*function getExtraQty(id)
    {
        var found = props.extraData.find((e)=>{if(e.id === id){return e}else{return null;};});
        return found ? found.quantity : 0; 
    }*/

    function extraSelected(extraObj)
    {
        var data = JSON.parse(JSON.stringify(props.existingItem));

        //Remove the extra if its already been added
        var extraExists = data.itemmeta.extras.find(({ id }) => id === extraObj.id)
        if(extraExists)
        {
            var index = data.itemmeta.extras.indexOf(extraExists);
            data.itemmeta.extras.splice(index,1);
            props.updateExistingItem(data);
            return;
        }

        //Otherwise add the extra
        data.itemmeta.extras.push(extraObj);
        props.updateExistingItem(data);




        /*var data = {...props.productData};

        //Remove the extra if its already been added
        var existsIndex = data.itemmeta.extras.indexOf(extraId)
        if(existsIndex !== -1){data.itemmeta.extras.splice(existsIndex,1);}
        else
        {
            data.itemmeta.extras.push(extraId);
        }
        
        props.updateProductData(data);*/
    }

    function isExtraSelected(extraObj)
    {
        if(props.existingItem.itemmeta.extras.find(({ id }) => id === extraObj.id)){return 'selected';}
        return '';
    }

    return (
        <div className="area productSelector">
            {
                props.productModel.extras.map((extra)=>(
                    <div key={extra.id} className={"extra " + isExtraSelected(extra)} onClick={()=>{extraSelected(extra)}}>
                        <div className="name">{extra.name}</div>
                        <div className="price">£{extra.price.toFixed(2)}</div>
                    </div>
                ))
            }
        </div>
    );

    /*return(
        <div className="section extras">
            <div className="extrasHeader">
                <div>Name</div>
                <div>Price</div>
                <div style={{textAlign:"center"}}>Qty</div>
                <div>Total</div>
            </div>
            {
                props.extras.map((extra)=>(
                    <div className="extraRow" key={extra.id}>
                        <div>{extra.name}</div>
                        <div>£{extra.price.toFixed(2)}</div>
                        <div>
                            <div className="qtyEditor">
                                <div className="minus"><i className="icon-minus"></i></div>
                                <input type="number" value={getExtraQty(extra.id)} readOnly/>
                                <div className="plus"><i className="icon-plus"></i></div>
                            </div>
                        </div>
                        <div>£{(getExtraQty(extra.id) * extra.price).toFixed(2)}</div>
                    </div>
                ))
            }
        </div>
    );*/
}