import {useState} from 'react';
import OrderListItem from '../../ui/OrderListItem';
import {NoDataToDisplay} from '../../ui/DisplayUtility';

function CompleteOrdersTab(props)
{
    const [subTab,setSubtab] = useState("complete");

    function getContents()
    {
        var toDisplay = props.orders.filter((order) => {
            if(subTab === "complete" && (order.status === "fulfilled" || order.status === "delivered" || order.status === "collected"))
            {return order;}
            if(subTab === "failed" && (order.status === "couldnotdeliver" || order.status === "didnotcollect" || order.status === "cancelled" || order.status === "rejected" ))
            {return order;}
        });

        if(toDisplay.length === 0)
        {
            return NoDataToDisplay("No Orders to Display")
        }

        return toDisplay.map((o) => {return getOrderJSX(o)});
    }

    function getOrderJSX(order)
    {
        return <OrderListItem key={order.id} order={order}/>
    }

    return (
        <>
            <div className="subTabsContainer">
                <div className={"subTab"+ (subTab === "complete" ? " selected" : "")} onClick={()=>{setSubtab("complete")}}>Complete</div>
                <div className={"subTab" + (subTab === "failed" ? " selected" : "")} onClick={()=>{setSubtab("failed")}}>Failed</div>
            </div>
            <div className="subTabWindow">
                {getContents()}
            </div>
        </>
    );
}

export default CompleteOrdersTab;