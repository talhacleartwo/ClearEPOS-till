import {useSetCurrentOrder} from '../../../../../contexts/OrderContext'
import * as _editUtils from '../../.././../../service/itemEditUtils';

export default function OrderActions(props)
{
    const setCurrentOrder = useSetCurrentOrder();

    //const showOrderBtn = props.currentOrder.status !== "paid";
    const showPayBtn = props.currentOrder.paymentstatus == "notpaid";
    const showRefundBtn = props.currentOrder.paymentstatus === "paid";
    const showVoidBtn = props.currentOrder.paymentstatus == "notpaid";

    return (
        <div id="OrderActions">
            <div className="grandTotal">
                <div style={{textAlign:"left"}}>
                    Total:
                    <span>£{_editUtils.calculateOrderTotal(props.currentOrder.line_items).toFixed(2)}</span>
                </div>
            </div>
            <div className="subActions">
                
            </div>
            <div className="buttonBar joined">

                {/*<div className="btn btn-lg">Discount</div>
                <div className="btn btn-lg">Print</div>*/}
                {/*showOrderBtn ? (<div className="btn btn-lg disabled">Order</div>) : null*/}
                {showVoidBtn ? (<div className="btn btn-lg btn-danger" onClick={()=>{setCurrentOrder(null);}}><i className="icon-trash"></i>Void</div>) : null}
                <div className="btn btn-lg btn-info" onClick={()=>{setCurrentOrder(null);}}><i className="icon-confirm"></i>Hold</div>
                {showPayBtn ? (<div className="btn btn-lg btn-success" onClick={()=>{props.setOrderPaymentOpen()}}><i className="icon-tick"></i>Pay</div>) : null}
                {showRefundBtn ? (<div className="btn btn-lg btn-danger" onClick={()=>{props.setOrderRefundOpen()}}>Refund</div>) : null}

            </div>
        </div>
    );
}