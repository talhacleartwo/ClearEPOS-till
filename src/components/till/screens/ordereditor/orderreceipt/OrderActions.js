import {useSetCurrentOrder} from '../../../../../contexts/OrderContext'

export default function OrderActions()
{
    const setCurrentOrder = useSetCurrentOrder();
    return (
        <div id="OrderActions">
            <div className="subActions">
                
            </div>
            <div className="buttonBar joined">
                <div className="btn btn-lg">Discount</div>
                <div className="btn btn-lg">Print</div>
                <div className="btn btn-lg disabled">Order</div>
                <div className="btn btn-lg btn-danger" onClick={()=>{setCurrentOrder(null);}}>Void</div>
                <div className="btn btn-lg btn-info" onClick={()=>{setCurrentOrder(null);}}>Hold</div>
                <div className="btn btn-lg btn-success">Pay</div>
            </div>
        </div>
    );
}