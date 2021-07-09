import {useState} from 'react';
import PayByCash from './Payment';
import PayByCard from './PayByCard';
import RefundByCash from './RefundByCash';

export default function PaymentMethod(props)
{
    const [selectedMethod,setSelectedMethod] = useState(false);



    function getDisplay()
    {
        if(selectedMethod === false)
        {
            if(props.currentOrder.status === "paid")
            {
                return(
                    <div className="selectMethod">
                        <header><h3>Select a Refund Method</h3></header>
                        <div className="methods">
                            <div className="paymentMethod" onClick={()=>{setSelectedMethod("refundcash");}}><i className="icon-tick"></i> Cash</div>
                            <div className="paymentMethod"><i className="icon-tick"></i> Card</div>
                        </div>
                        <div className="btn btn-danger CancelPayment" onClick={props.cancelOrderPayment}>Cancel Refund</div>
                    </div>
                );
            }
            else
            {
                return (
                    <div className="selectMethod">
                        <header><h3>Select a Payment Method</h3></header>
                        <div className="methods">
                            <div className="paymentMethod" onClick={()=>{setSelectedMethod("cash");}}><i className="icon-tick"></i> Cash</div>
                            <div className="paymentMethod" onClick={()=>{setSelectedMethod("card");}}><i className="icon-tick"></i> Card</div>
                            <div className="paymentMethod"><i className="icon-tick"></i> Link</div>
                        </div>
                        <div className="btn btn-danger CancelPayment" onClick={props.cancelOrderPayment}>Cancel Payment</div>
                    </div>
                );
            }
        }
        else if(selectedMethod === "cash")
        {
            return (
                <PayByCash totalDue={props.totalDue} cancel={()=>{setSelectedMethod(false);}}/>
            );
        }
        else if(selectedMethod === "card")
        {
            return (
                <PayByCard totalDue={props.totalDue} cancel={()=>{setSelectedMethod(false);}}/>
            );
        }
        else if(selectedMethod === "refundcash")
        {
            return (
                <RefundByCash orderTotal={props.totalDue} cancel={()=>{setSelectedMethod(false);}}/>
            );
        }
        else if(selectedMethod === "refundcard")
        {

        }
    }

    return(
        <section id="OrderPayment" className="panel sixty">
            {getDisplay()}
        </section>
    );
}