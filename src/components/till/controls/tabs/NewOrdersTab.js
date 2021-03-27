import { useSetCurrentOrder } from '../../../../contexts/OrderContext';

//Utils
import {DateTimeToHumanTime} from "../../ui/DateTimeUtils";

import { useQuery, gql } from '@apollo/client';

const OPEN_ORDERS = gql`
    query {orders(sort: "created_at:desc") {
        id,
        customer{
            firstname,
            lastname
        }
        address{
            id,
            postalcode
        }
        created_at
    }}
`;


function NewOrdersTab()
{
    const { loading, error, data } = useQuery(OPEN_ORDERS);

    //Use Set Current Order
    const setCurrentOrder = useSetCurrentOrder();

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    
    //console.log(data);
    return data.orders.map((order) => (
        <div className="miniOrder" key={order.id} data-id={order.id} onClick={() => {setCurrentOrder(order.id)}}>
            <div className="brandArea">
                <div className="brandLogoPlaceholder">B</div>
            </div>
            <div className="content">
                <div className="details">
                    {order.customer.firstname} {order.customer.lastname} ({order.address.postalcode})
                </div>
                <div className="subDetails">
                    Placed: {DateTimeToHumanTime(order.created_at)}
                </div>
            </div>
        </div>
    ));
    //return <div>Open Orders</div>
}

export default NewOrdersTab;