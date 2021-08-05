import CurrentOrderHeader from '../../../ui/CurrentOrderHeader';
import OrderActions from './OrderActions';
import OrderItems from './OrderItems';
import {LoadingData} from '../../../ui/DisplayUtility';

function OrderReceipt(props)
{
    if(props.orderLoading)
    {
        return LoadingData();
    }

    return(
        <div className="orderReceiptWrapper">
            <CurrentOrderHeader orderSettingsToggle={props.openOrderSettings} currentOrder={props.currentOrder}/>
            <div className="clearfix"></div>
            <OrderItems 
                removeExistingOrderItem={props.removeExistingOrderItem} 
                editExistingOrderItem={props.editExistingOrderItem}
                lineItems={props.currentOrder.line_items}
                editingItem={props.editingItem}
            />
            <OrderActions setOrderPaymentOpen={props.setOrderPaymentOpen} currentOrder={props.currentOrder} setOrderRefundOpen={props.setOrderRefundOpen}/>
        </div>
    );
}

export default OrderReceipt;