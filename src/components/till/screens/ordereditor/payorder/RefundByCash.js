import {useState} from 'react';
import styles from "../../../../../Setup.module.css";

var refundedReason = "";
export default function RefundByCash(props)
{
    console.log(props.orderData);
    //TEMP
    const discountedAmount = (props.orderData.discount == null) ? 0 : props.orderData.discount;


    const [typedPrefix,updateTypedPrefix] = useState("Enter Refund Amount: ");
    const [typed,updateTyped] = useState("");
    const [Applied,setApplied] = useState(true);
    const [RefundChange , setRefundChange] = useState(true);

    const [discountMethod,setDiscountMethod] = useState("£");
    const [displayRefundAmount,setDisplayRefundAmount] = useState(props.orderData.refundedamount);

    //const [discountMode,setDiscountMode] = useState(false);
    const [discountedTotal,setDiscountedTotal] = useState(props.orderData.total);

    const [showRefundReason,setShowRefundReason] = useState(false);

    function calculateRefundAmount()
    {
        var refundAmount = 0;
        var toRefundFrom = props.orderData.subtotal - discountedAmount;

        if(discountMethod === "%")
        {
            var p = typed;
            refundAmount = (toRefundFrom / 100) * p;
        }
        else
        {
            refundAmount = parseFloat(typed);
        }

        if(refundAmount > toRefundFrom){
            refundAmount = toRefundFrom;
            setShowRefundReason(true);
        }

        setDisplayRefundAmount(refundAmount);
        setApplied(false);
    }

    function keyPressed(event)
    {
        var val = event.target.dataset.val;
        setApplied(true);
        switch(val)
        {
            case "APPLY":
                calculateRefundAmount();
                break
            case "FULLREFUND" :
                setShowRefundReason(true);
                setRefundChange(false);
                updateTyped(props.orderData.total);
                break;
            case "CE" :
                updateTyped("");
                break;
            case "%":
                setDiscountMethod("%");
                break;
            case "£":
                setDiscountMethod("£");
                break;
            case "percent_5" :
                setRefundChange(false);
                updateTyped("5%");
                break;
            case "percent_10" :
                setRefundChange(false);
                updateTyped("10%");
                break;
            case "percent_15" :
                setRefundChange(false);
                updateTyped("15%");
                break;
            case "percent_20" :
                setRefundChange(false);
                updateTyped("20%");
                break;
            default:
                setRefundChange(false);
                var nval = typed + val;
                updateTyped(nval);
                break;
        }


    }

    function processRefund(){
        var data = {};
        var reason = null;
        if(showRefundReason || props.orderData.total == displayRefundAmount){
            if(refundedReason == ""){
                alert('Select Refund Reason');
                return;
            }
            reason = refundedReason;
        }
        var status;
        if(props.orderData.total > displayRefundAmount){
            status = "fulfilled";
        } else if(props.orderData.total == displayRefundAmount){
            status = "cancelled";
        }
        var data = {
            'refundamount' : displayRefundAmount,
            'refundreason' : reason,
            'payment_status' : "refunded",
            'status' : status
        };
        props.updateOrderrefund(data);
    }

    function changedReason(e){
        e = e || window.event;
        refundedReason = e.target.value;
    }

    return (
        <>
            <div className="orderPaymentWrapper">
                <div id="OrderPaymentReadout">

                    <div className="due" style={{marginBottom : 10}}><b>ORDER TOTAL:</b> £{props.orderData.subtotal}</div>
                    <div className="due" style={{marginBottom : 10}}><b>DISCOUNT:</b> £{discountedAmount}</div>
                    {displayRefundAmount ? (<div className="refundAmount" style={{marginBottom : 10}}>Total to Refund: £{displayRefundAmount.toFixed(2)}</div>) : null}
                    {
                        showRefundReason ?
                        (
                            <div style={{marginBottom : 10}}>
                                <label>Refund Reason</label>
                                <select className={styles.formcontrol_select} onChange={() => changedReason(this)}>
                                    <option value={""}>Choose Reason</option>
                                    <option value={"customer_cancelled"}>customer_cancelled</option>
                                    <option value={"customer_complaint"}>customer_complaint</option>
                                    <option value={"store_cancelled"}>store_cancelled</option>
                                </select>
                            </div>
                        )
                        :
                        (
                            null
                        )
                    }
                    <div className="typeBar">{typedPrefix + discountMethod + typed}</div>
                </div>
                <div id="OrderPaymentControls">
                    <div className="keypad">
                        <div className="key"></div>
                        <div className="key"></div>
                        <div className="key"></div>
                        <div className="key special" onClick={keyPressed} data-val={discountMethod === "£" ? "%" : "£"}>{discountMethod === "£" ? "%" : "£"}</div>
                        <div className="key"></div>

                        <div className="key numeric" onClick={keyPressed} data-val="7">7</div>
                        <div className="key numeric" onClick={keyPressed} data-val="8">8</div>
                        <div className="key numeric" onClick={keyPressed} data-val="9">9</div>
                        <div className="key special" onClick={keyPressed} data-val="percent_5">5%</div>
                        <div className="key action" onClick={keyPressed} data-val="APPLY" style={{
                            opacity: RefundChange ? 0.50 : 1,
                            pointerEvents: RefundChange ? "none" : "initial"
                        }}>APPLY</div>
                        <div className="key numeric" onClick={keyPressed} data-val="4">4</div>
                        <div className="key numeric" onClick={keyPressed} data-val="5">5</div>
                        <div className="key numeric" onClick={keyPressed} data-val="6">6</div>
                        <div className="key special" onClick={keyPressed} data-val="percent_10">10%</div>
                        <div className="key action" onClick={keyPressed} data-val="FULLREFUND">FULLREFUND</div>
                        <div className="key numeric" onClick={keyPressed} data-val="1">1</div>
                        <div className="key numeric" onClick={keyPressed} data-val="2">2</div>
                        <div className="key numeric" onClick={keyPressed} data-val="3">3</div>
                        <div className="key special" onClick={keyPressed} data-val="percent_15">15%</div>
                        <div className="key danger" onClick={() => {props.cancel(false)}}>CANCEL</div>
                        <div className="key function" style={{fontSize: "2em",lineHeight: "1.5em"}} onClick={keyPressed} data-val=".">.</div>
                        <div className="key numeric" onClick={keyPressed} data-val="0">0</div>
                        <div className="key function" onClick={keyPressed} data-val="CE">CE</div>
                        <div className="key special" onClick={keyPressed} data-val="percent_20">20%</div>
                        <div className="key success" style={{
                            opacity: Applied ? 0.50 : 1,
                            pointerEvents: Applied ? "none" : "initial"
                        }} onClick={() => {processRefund()}}>DONE</div>
                    </div>
                </div>
            </div>
        </>
    );
}