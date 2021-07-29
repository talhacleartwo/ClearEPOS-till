import {useState} from 'react';

import {useQuery, useMutation} from '@apollo/client';
//import {LoadingData} from '../../ui/DisplayUtility';

//Queries
import {REMOVE_LINE_ITEM, UPDATE_LINE_ITEM, ADD_LINE_ITEM, ORDER_QUERY, UPDATE_ORDER_STATUS, UPDATE_ORDER_NOTES, UPDATE_ORDER_PAYMENT_STATUS} from '../../../../service/queries';

import CategorySelector from './addorderitems/CategorySelector';
import ProductSelector from './addorderitems/ProductSelector';
import ProductEditor from './addorderitems/ProductEditor';
import OrderReceipt from './orderreceipt/OrderReceipt';
import GroupProductSelector from './addorderitems/GroupProductSelector';
import OrderSettings from './ordersettings/OrderSettings';
import Payment from './payorder/Payment';
//import PaymentMethod from './payorder/PaymentMethod';









function OrderEditor(props)
{
    const [currentCategory,setCurrentCategory] = useState(null);
    const [currentProduct,setCurrentProduct] = useState(null);
    const [existingItem,setexistingItem] = useState(false);
    const [currentOrderData,updateCurrentOrderData] = useState(null);
    const [orderSettingsOpen,setOrderSettingsOpen] = useState(false);
    const [orderPaymentOpen,setOrderPaymentOpen] = useState(false);

    //Query Order
    const {loading, error} = useQuery(ORDER_QUERY, {
        //notifyOnNetworkStatusChange: true,
        fetchPolicy: 'cache-and-network', 
        variables:{orderId: props.orderId}, 
        onCompleted:(data) => {
            console.log(data.order);
            updateCurrentOrderData(data.order);
        }
    });

    //Mutations
    const [addLineItem] = useMutation(ADD_LINE_ITEM,
        {
            refetchQueries:[
                {
                    query:ORDER_QUERY,
                    variables:{orderId: props.orderId
                }
            }
        ]
    });
    const [updateLineItem] = useMutation(UPDATE_LINE_ITEM,
        {
            refetchQueries:[
                {
                    query:ORDER_QUERY,
                    variables:{orderId: props.orderId
                }
            }
        ]
    });
    const [removeLineItem] = useMutation(REMOVE_LINE_ITEM,
        {
            refetchQueries:[
                {
                    query:ORDER_QUERY,
                    variables:{orderId: props.orderId
                }
            }
        ]
    });
    const [updateOrderStatus] = useMutation(UPDATE_ORDER_STATUS,
        {
            refetchQueries:[
                {
                    query:ORDER_QUERY,
                    variables:{orderId: props.orderId
                }
            }
        ]
    });
    const [UpdateOrderNotes] = useMutation(UPDATE_ORDER_NOTES,
        {
            refetchQueries:[
                {
                    query:ORDER_QUERY,
                    variables:{orderId: props.orderId
                }
            }
        ]
    });
    
    
    const [updateOrderPaymentStatus] = useMutation(UPDATE_ORDER_PAYMENT_STATUS,
        {
            refetchQueries:[
                {
                    query:ORDER_QUERY,
                    variables:{orderId: props.orderId
                }
            }
        ]
    });

    if(error) return("Something went wrong while loading the order.");
    //if(loading || currentOrderData === null) return LoadingData();



    function finishedEditingAdding()
    {
        //Reset current item
        setCurrentProduct(null);

        //Clear Existing Item
        setexistingItem(false);
    }

    function openEditorForExistingItem(item)
    {
        //Set Current Product ID
        setCurrentProduct({id: item.product.id, type: 'product'});

        //Set existing item details
        setexistingItem(item);
    }

    function addNewItemToOrder(itemData)
    {
        //Add new item to state
        addLineItem({ variables: 
            { 
                orderId: currentOrderData.id,
                productId: itemData.productId,
                quantity: 1,
                itemMeta: itemData.itemmeta,
                price: itemData.price
            } 
        });

        //Reset current item
        finishedEditingAdding();

        //Refetch order to show latest line item on receipt
        //refetch();
    }

    function updateOrderItem(itemData)
    {
        updateLineItem({ variables:
            {
                lineItemId: itemData.id,
                quantity: 1,
                itemMeta: itemData.itemmeta,
                price: itemData.price
            }
        })

        //Reset current item
        finishedEditingAdding();

        //Refetch order to show latest line item on receipt
        //refetch();
    }

    function removeExistingItemFromOrder(itemId)
    {
        //Remove Item from the order
        removeLineItem({variables:{lineItemId:itemId}});

        //Reset current item
        finishedEditingAdding();

        //Refetch order to show latest line item on receipt
        //refetch();
    }

    function updateCurrentOrderStatus(status)
    {
        //Update the order status
        updateOrderStatus({variables:{orderId: currentOrderData.id, status:status}});

        //Close Payment Screen
        setOrderPaymentOpen(false);
    }

    function updateCurrentOrderNotes(notes)
    {
        //Update the order Notes
        UpdateOrderNotes({variables:{orderId: currentOrderData.id, notes:notes}});

        //Used to close the settings window
        setOrderSettingsOpen(false);
    }

    function updateCurrentOrderPaymentStatus(paymentStatus, paymentMethod, subtotal, orderTotal, discountAmount)
    {
        //Update the payment status
        updateOrderPaymentStatus({variables:{
            orderId:currentOrderData.id, 
            paymentStatus: paymentStatus,
            paymentMethod: paymentMethod,
            subtotal: subtotal,
            orderTotal: orderTotal,
            discountAmount: discountAmount
        }});

        //Close Payment Screen
        setOrderPaymentOpen(false);
    }

    return(
        <>
            {
                !orderPaymentOpen ? 
                (
                    <section id="AddOrderItems" className="panel sixty">
                        <div className="addOrderItemsWrapper">
                            {
                                currentProduct === null ? 
                                (
                                    <>
                                        <CategorySelector current={currentCategory} update={setCurrentCategory}/>
                                        {
                                            currentCategory !== null ?
                                                <ProductSelector category={currentCategory} update={setCurrentProduct}/> 
                                            : null
                                        }
                                    </>
                                )
                                :
                                (
                                    
                                    currentProduct.type === 'group' ? 
                                        <GroupProductSelector groupId={currentProduct.id} setCurrentProduct={setCurrentProduct}/>
                                    :
                                        <ProductEditor 
                                            productId={currentProduct.id} //Used to fetch & render the product details from catalog cache
                                            addNewItemToOrder={addNewItemToOrder} //Used to add a brand new item to the order
                                            removeItemFromOrder={removeExistingItemFromOrder} //Used to remove an item from the order
                                            updateOrderItem={updateOrderItem} //Used to update an existing order item
                                            itemToEdit={existingItem} //Used to show whether we are editing or adding an item
                                            discardChanges={()=>{setCurrentProduct(null); setexistingItem(false);}}
                                        />
                                )
                            }
                        </div>
                    </section>
                )
                :
                (
                    <section id="OrderPayment" className="panel sixty">
                        <Payment
                            currentOrder={currentOrderData}
                            cancelOrderPayment={()=>{setOrderPaymentOpen(false);}} 
                            changeOrderStatus={updateCurrentOrderStatus}
                            changeOrderPaymentStatus={updateCurrentOrderPaymentStatus}
                            updateordernotes={updateCurrentOrderNotes}
                        />
                    </section>
                )
            }
            
            {
                !orderSettingsOpen ? 
                (
                    <section id="OrderReceipt" className="panel forty">
                        <OrderReceipt 
                            orderLoading={loading || currentOrderData == null} //Used to show loading icon on order reciept
                            openOrderSettings={()=>{setOrderSettingsOpen(true);}} //Used to open the order settings
                            currentOrder={currentOrderData} //Used to display line items
                            removeExistingOrderItem={removeExistingItemFromOrder} //Used to remove an existing item
                            editExistingOrderItem={openEditorForExistingItem} //Used to open the product editor for a product from the order
                            editingItem={existingItem.id ? existingItem.id : null}
                            orderPaymentOpen={orderPaymentOpen} //Used to indicate if order is currently being paid for
                            setOrderPaymentOpen={()=>{setOrderPaymentOpen(true)}} //Used to start the order payment process
                        />
                    </section>
                )
                :
                (
                    <section id="OrderSettings" className="panel forty">
                        <OrderSettings
                            closeOrderSettings={()=>{setOrderSettingsOpen(false);}} //Used to close the settings window
                            existingOrder={currentOrderData}
                            UpdateOrderNotes={updateCurrentOrderNotes}//Passing data about current order
                        />
                    </section>
                )
            }
            
        </>
    );
}

export default OrderEditor;