import {PrettyPrintOrderPaymentStatus, PrettyPrintOrderStatus} from '../../../components/till/ui/DisplayUtility';

export default function CurrentOrderHeader(props)
{
    function getOrderName()
    {
        var t = props.currentOrder.type
        if(t === "eatin" || t === "walkin")
        {
            return(<span>ANON </span>);
        }
        else if(t === "staff")
        {
            return (<span>{props.currentOrder.staff_member.firstname} {props.currentOrder.staff_member.lastname}</span> );
        }
        else
        {
            return (<span>{props.currentOrder.customer.firstname} {props.currentOrder.customer.lastname}</span> );
        }
    }


    return(
        <header className="orderHeader">
            <div className="brandLogoPlaceholder f_left">Brand</div>
            <div className="orderDetails f_left">
                <div className="orderNumber">Order #{props.currentOrder.ordernumber}</div>
                <div className="customerName">
                    {getOrderName()} | <span>
                    {PrettyPrintOrderPaymentStatus(props.currentOrder.paymentstatus)}</span> | <span>
                    {PrettyPrintOrderStatus(props.currentOrder.status)}</span>
                </div>
            </div>
            <div className="f_right">
                <div onClick={props.orderSettingsToggle} className="btn btn-icon btn-info"><i className="icon-settings"></i></div>
            </div>
        </header>
    );
}