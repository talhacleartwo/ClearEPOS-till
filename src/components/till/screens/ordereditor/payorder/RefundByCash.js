import {useState} from 'react';

export default function RefundByCash(props)
{
    //TEMP
    const discountedAmount = 5;


    const [typedPrefix,updateTypedPrefix] = useState("Enter Refund Amount: ");
    const [typed,updateTyped] = useState("");

    const [discountMethod,setDiscountMethod] = useState("£");
    const [displayRefundAmount,setDisplayRefundAmount] = useState(0);

    //const [discountMode,setDiscountMode] = useState(false);
    const [discountedTotal,setDiscountedTotal] = useState(0);

    function calculateRefundAmount()
    {
        var refundAmount = 0;
        var toRefundFrom = props.orderTotal - discountedAmount;

        if(discountMethod === "%")
        {
            var p = typed;
            refundAmount = (toRefundFrom / 100) * p;
        }
        else
        {
            
            refundAmount = parseFloat(typed);
        }

        if(refundAmount > toRefundFrom){refundAmount = toRefundFrom;}

        setDisplayRefundAmount(refundAmount);
    }

    function keyPressed(event)
    {
        var val = event.target.dataset.val;

        switch(val)
        {
            case "APPLY":
                calculateRefundAmount();
            break
            case "FULLREFUND" :
                updateTyped(props.orderTotal);
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
                updateTyped("5%");
            break;
            case "percent_10" :
                updateTyped("10%");
            break;
            case "percent_15" :
                updateTyped("15%");
            break;
            case "percent_20" :
                updateTyped("20%");
            break;
            default:
                var nval = typed + val;
                updateTyped(nval);
            break;
        }

        
    }


    return (
        <>
            <div className="orderPaymentWrapper">
                <div id="OrderPaymentReadout">
                    <div className="content">
                        <div className="due">ORDER TOTAL: £{props.orderTotal}</div>
                        <div className="due">DISCOUNT: £{discountedAmount.toFixed(2)}</div>
                        {displayRefundAmount ? (<div className="refundAmount">TOTAL TO REFUND: £{displayRefundAmount.toFixed(2)}</div>) : null}
                    </div>
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
                        <div className="key action" onClick={keyPressed} data-val="APPLY">APPLY</div>
                        <div className="key numeric" onClick={keyPressed} data-val="4">4</div>
                        <div className="key numeric" onClick={keyPressed} data-val="5">5</div>
                        <div className="key numeric" onClick={keyPressed} data-val="6">6</div>
                        <div className="key special" onClick={keyPressed} data-val="percent_10">10%</div>
                        <div className="key action" onClick={keyPressed} data-val="FULLREFUND">FULLREFUND</div>
                        <div className="key numeric" onClick={keyPressed} data-val="1">1</div>
                        <div className="key numeric" onClick={keyPressed} data-val="2">2</div>
                        <div className="key numeric" onClick={keyPressed} data-val="3">3</div>
                        <div className="key special" onClick={keyPressed} data-val="percent_15">15%</div>
                        <div className="key danger" onClick={props.cancel}>CANCEL</div>
                        <div className="key function" style={{fontSize: "2em",lineHeight: "1.5em"}} onClick={keyPressed} data-val=".">.</div>
                        <div className="key numeric" onClick={keyPressed} data-val="0">0</div>
                        <div className="key function" onClick={keyPressed} data-val="CE">CE</div>
                        <div className="key special" onClick={keyPressed} data-val="percent_20">20%</div>
                        <div className="key success">DONE</div>
                    </div>
                </div>
            </div>
        </>
    );
}