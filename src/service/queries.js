import {gql} from "@apollo/client";


export const CATALOG_CACHE_QUERY =
gql`
query CatalogCache($brands: [ID]!) {
    products(where: { brand_in: $brands }) {
        id
        name
        tillname
        price
        product_categories {
            id
            name
        }
        extras(sort: "name:asc") {
            id
            name
            price
            consumes {
                defaultingredient {
                    flags {
                        id
                        name
                    }
                }
            }
        }
        consumes {
            id
            name
            configurable
            defaultingredient {
                name
                flags {
                    id
                    name
                }
            }
            alternatives {
                id
                name
                price
                ingredient {
                    name
                    flags {
                        id
                        name
                    }
                }
            }
        }
    }
    productCategories(where:{brand_in: $brands}, sort:"name:asc"){
        id,
        name,
    }
    productGroups(where: { brand_in: $brands }) {
        id,
        name,
        tillname,
        product_categories{
            id
        }
        products {
            id
            name
            tillname
            price
            product_categories {
                id
                name
            }
            extras(sort: "name:asc") {
                id
                name
                price
                consumes {
                    defaultingredient {
                        flags {
                        id
                        name
                        }
                    }
                }
            }
            consumes {
                id
                configurable
                defaultingredient {
                    name
                    flags {
                        id
                        name
                    }
                }
                alternatives {
                    id
                    price
                    ingredient {
                        name
                        flags {
                        id
                        name
                        }
                    }
                }
            }
        }
    }
}      
`;


export const ORDER_QUERY = gql`
    query GetOrder($orderId : ID!)
    {
        order(id: $orderId) {
            id,
            ordernumber,
            type,
            status,
            paymentstatus,
            notes,
            paymentmethod,
            staff_member
            {
                id,
                firstname,
                lastname
            },
            customer
            {
                id,
                firstname,
                lastname,
                mobilephone
            },
            address
            {
                id,
                line1,
                line2,
                city,
                county,
                postalcode
            },
            line_items
            {
                id,
                quantity,
                price,
                product
                {
                    id,
                    tillname,
                    price,
                    product_group{id,name,tillname}
                },
                itemmeta
            },
            refundedamount,
            discount,
            subtotal,
            total,
            created_at,
            estimateddelivery
        }
    }
`;


export const UPDATE_ORDER_PAYMENT_STATUS = gql`
    mutation UpdateOrderPaymentStatus(
        $orderId : ID!,
        $paymentStatus: ENUM_ORDER_PAYMENTSTATUS!,
        $paymentMethod: ENUM_ORDER_PAYMENTMETHOD!,
        $subtotal: Float!,
        $orderTotal: Float!,
        $discountAmount: Float!
    )
    {
        updateOrder(input:{where:{id:$orderId},data:{
            paymentstatus: $paymentStatus,
            paymentmethod: $paymentMethod,
            subtotal: $subtotal,
            total: $orderTotal,
            discount: $discountAmount,
            remainingpayment: 0
        }})
        {
            order{id}
        }
    }
`;

export const UPDATE_ORDER_DELIVERY_TIME = gql`
    mutation UpdateOrderStatus(
        $orderId: ID!,
        $delvierytime : DateTime
    )
    {
        updateOrder(input:{where:{id:$orderId},data:{
            estimateddelivery : $delvierytime
        }})
        {
            order{id}
        }
    }
`;

export const UPDATE_ORDER_STATUS = gql`
    mutation UpdateOrderStatus(
        $orderId: ID!,
        $status: ENUM_ORDER_STATUS!,
        $delvierytime : DateTime
    )
    {
        updateOrder(input:{where:{id:$orderId},data:{
            status: $status
            estimateddelivery : $delvierytime
        }})
        {
            order{id}
        }
    }
`;

export const UPDATE_ORDER_NOTES = gql`
    mutation UpdateOrderNotes(
        $orderId: ID!,
        $notes: String!
    )
    {
        updateOrder(input:{where:{id:$orderId},data:{
            notes: $notes
        }})
        {
            order{id}
        }
    }
`;

export const UPDATE_ORDER_REFUND= gql`
    mutation UpdateOrderRefund(
        $orderId: ID!,
        $amount: Float!,
        $reason: ENUM_ORDER_REFUNDEDREASON!,
        $payment_status : ENUM_ORDER_PAYMENTSTATUS!,
        $status : ENUM_ORDER_STATUS!
    )
    {
        updateOrder(input:{where:{id:$orderId},data:{
            refundedamount: $amount,
            refundedreason : $reason,
            paymentstatus : $payment_status,
            status : $status
        }})
        {
            order{id}
        }
    }
`;

export const ADD_LINE_ITEM = gql`
    mutation AddLineItem(
        $orderId : ID!,
        $productId : ID!,
        $quantity : Int!,
        $itemMeta : JSON,
        $price: Float!
    )
    {
        createOrderLine(input:{data:{
            order: $orderId,
            product: $productId,
            quantity: $quantity,
            itemmeta: $itemMeta,
            price: $price
        }})
        {
            orderLine{id}
        }
    }
`;


export const UPDATE_LINE_ITEM = gql`
    mutation UpdateLineItem(
        $lineItemId: ID!,
        $quantity : Int!,
        $itemMeta : JSON,
        $price: Float!
    )
    {
        updateOrderLine(input:{
            where:{id:$lineItemId},
            data:{
                quantity: $quantity,
                itemmeta: $itemMeta,
                price: $price
            }
        })
        {
            orderLine{id}
        }
    }
`;

export const REMOVE_LINE_ITEM = gql`
    mutation RemoveLineItem($lineItemId: ID!)
    {
        deleteOrderLine(input:{where:{id:$lineItemId}})
        {orderLine{id}}
    }
`;

export const DEVICES_QUERY = gql`
    {
      devices {
        id,
        name,
        ip,
        macaddress,
        site{
            id,
            name
        },
        type
      }
    }
`;