import * as _editUtils from '../../.././../../service/itemEditUtils';

export default function OrderItems(props)
{


    function getItemOptionsDisplay(options)
    {
        if(options.length === 0){return null;}

        var els = [];
        for(var option of options)
        {
            if(option.isDefault !== true)
            {
                if(option.upgradedTo)
                {
                    els.push(<div key={option.consumeId} className="productOption"><i className="icon-next"></i>{option.upgradedTo.name} (£{option.upgradedTo.price.toFixed(2)})</div>);
                }
                else if(option.removed)
                {
                    els.push(<div key={option.consumeId} className="productOption none"><i className="icon-minus"></i>{option.consumeName}</div>);
                }
                
            }
        }
        return els;
    }



    //var currentOrder = useCurrentOrder();
    console.log("Order Items:", props.lineItems);
    return (
        <div id="OrderItems">
            <div className="receiptHeader">
                <div>Item</div>
                <div>Total</div>
            </div>
            <div className="receiptBody">
                {props.lineItems.length === 0 ? <div className="noItemsYet"><div>No Items to Display</div></div> : null}
                {
                    props.lineItems.map((item) => (
                        <div key={item.id} className={"item " + (props.editingItem === item.id ? "editing" : "")} data-id={item.id} onClick={()=>{props.editExistingOrderItem(item)}}>
                            <div>
                                <div className="productName">
                                    {item.product.product_group === null ? item.product.tillname : (item.product.product_group.tillname + " - " + item.product.tillname)}
                                </div>
                                {
                                    getItemOptionsDisplay(item.itemmeta.options)
                                   
                                }
                                {
                                    item.itemmeta.extras.length > 0 ? (
                                        item.itemmeta.extras.map((extra)=>(
                                            <div key={extra.id} className="productExtra"><i className="icon-plus"></i>{extra.name} (£{extra.price.toFixed(2)})</div>
                                        ))
                                    ) : null
                                }
                            </div>
                            <div>£{_editUtils.calculateItemTotal(item)}</div>
                        </div>
                    ))
                }
            </div>
            <div className="receiptFooter">
                
            </div>
        </div>
    );
}