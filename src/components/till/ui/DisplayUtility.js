export function NoDataToDisplay(message, classes = [])
{
    function getClasses(clss)
    {
        return "nothingToDisplay " + clss.forEach((c)=>{return c;});
    }
    return(
        <div className={getClasses(classes)}>
            <div>{message}</div>
        </div>
    );
}

export function LoadingData(message = "Loading..", spinner = true)
{
    return (
        <div className="loadingData">
            <div>
                {spinner ? <div className="Spinner"></div> : null}
                <div className="Message">{message}</div>
            </div>
        </div>
    );
}

export function PrettyPrintOrderStatus(status)
{
    var pretty = "";
    switch(status)
    {
        case "new":
            pretty = "New";
        break;
        case "inkitchen":
            pretty ="In Kitchen";
        break;
        case "awaitingcollection":
            pretty ="Awaiting Collection";
        break;
        case "outfordelivery":
            pretty ="Out For Delivery";
        break;
        case "delivered":
            pretty ="Delivered";
        break;
        case "collected":
            pretty ="Collected";
        break;
        case "fulfilled":
            pretty ="Fulfilled";
        break;
        case "cancelled":
            pretty ="Cancelled";
        break;
        case "rejected":
            pretty ="Rejected";
        break;
        case "couldnotdeliver":
            pretty ="Couldn't Deliver";
        break;
        default:
            pretty ="Didn't Collect";
        break;

        
    }
    return pretty;
}

export function PrettyPrintOrderPaymentStatus(status)
{
    var pretty = "";
    switch(status)
    {
        case "paid":
            pretty = "Paid";
        break;
        case "notpaid":
            pretty = "Not Paid";
        break;
        default:
            pretty = "Refunded";
        break;
    }
    return pretty;
}

export function PrettyPrintOrderType(type)
{
    var pretty ="";
    switch(type)
    {
        case "collection":
            pretty = "Collection";
        break;
        case "delivery":
            pretty = "Delivery";
        break;
        case "eatin":
            pretty = "Eat In";
        break;
        case "walkin":
            pretty = "Walk In";
        break;
        default:
            pretty= "Staff Order";
        break;
    }
    return pretty;
}
