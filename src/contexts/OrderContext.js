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

    //Function to update the order
    /*function updateCurrentOrder(user)
    {
        setOrder(user);
    }*/

    return (
        <OrderContext.Provider value={order}>
            <OrderUpdateContext.Provider value={setOrder}>
                {children}
            </OrderUpdateContext.Provider>
        </OrderContext.Provider>
    );
}