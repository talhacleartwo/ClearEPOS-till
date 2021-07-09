export default function GeneralTab(props)
{

    function typeChanged(event)
    {
        //var val = event.target.dataset.value;

        //Save the change to state for updating the order upon save pressed

        //var nOrder = newOrder;
        //nOrder.type = val;
        //updateNewOrder(nOrder);
        //changeShowSection('customer');
    }
    function getTypeOptionClasses(myID)
    {
        return "coOption " + myID + (myID === props.existingOrder.type ? " selected" : "");
    }
    function renderTypeSection()
    {
        return (
            <div className="section delivery_type">
                {/*<h4 className="center">Order Type</h4>*/}
                <div className="coSelector">
                    <div className={getTypeOptionClasses('walkin')} data-value="walkin" onClick={typeChanged}>Walk In</div>
                    <div className={getTypeOptionClasses('eatin')} data-value="eatin" onClick={typeChanged}>Eat In</div>
                    <div className={getTypeOptionClasses('collection')} data-value="collection" onClick={typeChanged}>Collection</div>
                    <div className={getTypeOptionClasses('delivery')} data-value="delivery" onClick={typeChanged}>Delivery</div>
                </div>
            </div>
        );
    }

    return(
        <div className="section general">
            {
                renderTypeSection()
            }
        </div>
    );
}