import OrderListItem from '../../ui/OrderListItem';
import {NoDataToDisplay} from '../../ui/DisplayUtility';

function ProcessingOrdersTab(props)
{
    function getContents()
    {
        if(props.orders.length === 0)
        {
            return NoDataToDisplay("No Orders to Display")
        }
        
        var toDisplay = props.orders.filter((order) => {
            if(order.status === "inkitchen" || order.status === "outfordelivery" || order.status === "awaitingcollection"){return order;}
        });

        if(toDisplay.length === 0)
        {
            return NoDataToDisplay("No Orders to Display")
        }

        return toDisplay.map((o) => {return <OrderListItem key={o.id} order={o}/>});
    }

    return getContents();
}

export default ProcessingOrdersTab;