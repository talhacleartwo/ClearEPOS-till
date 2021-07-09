import React, {useContext, useState} from "react";

const OrderContext = React.createContext();
const OrderUpdateContext = React.createContext();

//Custom Hook to allow anyone to read the current order
export function useCurrentOrder()
{
    return useContext(OrderContext);
}

//Custom Hook to allow anyone to update the order
export function useSetCurrentOrder()
{
    return useContext(OrderUpdateContext);
}

export default function OrderContextProvider({children})
{
    const [order, setOrder] = useState(null);

    //Function to collect order ID and download the order
    /*function updateCurrentOrder(orderId)
    {
        /const {loading, error, data} = useQuery(ORDER_QUERY, {variables:{orderId: orderId}});
        setOrder(data);
    }*/

    
    return (
        <OrderContext.Provider value={order}>
            <OrderUpdateContext.Provider value={setOrder}>
                {children}
            </OrderUpdateContext.Provider>
        </OrderContext.Provider>
    );
}