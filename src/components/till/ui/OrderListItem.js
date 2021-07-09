import {useSetCurrentOrder} from '../../../contexts/OrderContext';
import {DateTimeToHumanTime} from "../ui/DateTimeUtils";

function OrderListItem(props)
{
    //Use Set Current Order
    const setCurrentOrder = useSetCurrentOrder();

    function getOrderName(order)
    {
        var t = order.type
        if(t === "eatin" || t === "walkin")
        {
            return(<>ANON - {order.type.toUpperCase()}</>);
        }
        else if(t === "staff")
        {
            return (<>{order.staff_member.firstname} {order.staff_member.lastname}</> );
        }
        else
        {
            return (<>{order.customer.firstname} {order.customer.lastname}</> );
        }
    }

    var order = props.order;
    return (
        <div className="miniOrder" key={order.id} data-id={order.id} onClick={() => {setCurrentOrder(order.id)}}>
            <div className="brandArea">
                <div className="brandLogoPlaceholder">B</div>
            </div>
            <div className="content">
                <div className="details">
                    {getOrderName(order)} {order.type === "delivery" ? ("(" + order.address.postalcode + ")") : null}
                </div>
                <div className="subDetails">
                    #{order.ordernumber} | {order.type.charAt(0).toUpperCase() + order.type.slice(1)} | Placed: {DateTimeToHumanTime(order.created_at)}
                </div>
            </div>
        </div>
    );
}

export default OrderListItem;