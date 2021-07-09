import {useState} from 'react';
import OrderListItem from '../../ui/OrderListItem';
import {NoDataToDisplay} from '../../ui/DisplayUtility';

function InHouseOrdersTab(props)
{
    const [subTab,setSubtab] = useState("open");

    function getContents()
    {
        var toDisplay = props.orders.filter((order) => {
            if(order.type === "eatin" && subTab === "paid" && order.paymentstatus === "paid"){return order;}
            if(order.type === "eatin" && subTab === "open" && order.paymentstatus !== "paid"){return order;}
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
                <div className={"subTab"+ (subTab === "open" ? " selected" : "")} onClick={()=>{setSubtab("open")}}>Open</div>
                <div className={"subTab" + (subTab === "paid" ? " selected" : "")} onClick={()=>{setSubtab("paid")}}>Paid</div>
            </div>
            <div className="subTabWindow">
                {getContents()}
            </div>
        </>
    );
}

export default InHouseOrdersTab;