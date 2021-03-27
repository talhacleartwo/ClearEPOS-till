import CurrentOrderHeader from '../../../ui/CurrentOrderHeader';
import OrderActions from './OrderActions';
import OrderItems from './OrderItems';

function OrderReceipt()
{
    return(
        <div className="orderReceiptWrapper">
            <CurrentOrderHeader/>
            <div className="clearfix"></div>
            <OrderItems/>
            <OrderActions/>
        </div>
    );
}

export default OrderReceipt;