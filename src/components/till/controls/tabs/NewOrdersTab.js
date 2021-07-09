//import {useState} from 'react';
//import { useSetCurrentOrder } from '../../../../contexts/OrderContext';

//Utility
//import {DateTimeToHumanTime} from "../../ui/DateTimeUtils";
import {NoDataToDisplay} from '../../ui/DisplayUtility';
import OrderListItem from '../../ui/OrderListItem';

//import { useQuery, gql } from '@apollo/client';




function NewOrdersTab(props)
{
    

    //const [orders,setOrders] = useState(null);

    //Use Set Current Order
    //const setCurrentOrder = useSetCurrentOrder();

    //if (loading) return LoadingData();
    //if (error) return <p>Error :(</p>;

    
    

    /*function getOrderName(order)
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
    }*/


    //console.log(data);
    /*return props.orders.map((order) => (
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
    ));*/

    function getContents()
    {
        if(props.orders.length === 0)
        {
            return NoDataToDisplay("No Orders to Display")
        }

        var toDisplay = props.orders.filter((order) => {
            if(order.status === "new"){return order;}
        });

        if(toDisplay.length === 0)
        {
            return NoDataToDisplay("No Orders to Display")
        }

        return toDisplay.map((o) => {return <OrderListItem key={o.id} order={o}/>});
    }

    return getContents();

}

export default NewOrdersTab;