import {useState} from 'react';
import * as _itemEditUtils from '../../../../../service/itemEditUtils'

import styles from '../../../../../Setup.module.css'

const SPLIT_LIMIT = 4;

var selecteddeliverytime=false ;
var previousValueDeliveryTime;

export default function Payment(props)
{
    
    // var estimateddelivery='2021-08-09T8:21:0';
    if(props.currentOrder.estimateddelivery){

        var estimateddelivery = new Date(props.currentOrder.estimateddelivery);
        var year = estimateddelivery.getFullYear();
        var month = estimateddelivery.getMonth()+1;
        var dt = estimateddelivery.getDate();

        if (dt < 10) {
            dt = '0' + dt;
        }
        if (month < 10) {
            month = '0' + month;
        }
        var hours = estimateddelivery.getHours();
        var minutes = estimateddelivery.getMinutes();
        var seconds = estimateddelivery.getSeconds();
        if (hours < 10) {
            hours = '0' + hours;
        }
        if (seconds < 10) {
            seconds = '0' + seconds;
        }
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        estimateddelivery = year+'-'+month+'-'+dt+'T'+hours+':'+minutes+':'+seconds;
        console.log(year+'-'+month+'-'+dt+'T'+hours+':'+minutes+':'+seconds);

    }
// console.log("Payment ORder Details: ", props.currentOrder);

    previousValueDeliveryTime = props.currentOrder.estimateddelivery == null ? null : props.currentOrder.estimateddelivery;
     if(selecteddeliverytime==false )
    {
     selecteddeliverytime=previousValueDeliveryTime;
    }
    const ORDER_TOTAL = _itemEditUtils.calculateOrderTotal(props.currentOrder.line_items);
    const DELIVERY_ORDER = props.currentOrder.type === "delivery";

    const [typedPrefix,updateTypedPrefix] = useState("");
    const [typed,updateTyped] = useState("");
    const [changeDue,setChangeDue] = useState(false);

    const [DeliveryTime,setDeliveryTime] = useState("");

    const [paymentMethod,setpaymentMethod] = useState("Cash");

    const [discountMode,setDiscountMode] = useState(false);
    const [discountMethod,setDiscountMethod] = useState("£");
    const [displayDiscountAmount,setDisplayDiscountAmount] = useState(0);

    const [splitMode,setSplitMode] = useState(false);
    const [splitWays,setSplitWays] = useState(null);
    //const [splitResult,setSplitResult] = useState([]);

    //Payment Settings
    const [sendPaymentLink,setSendPaymentLink] = useState(true);
    const [printReceipt,setPrintReceipt] = useState(true);


    //Use Effect to update split after discount changed
    /*useEffect(() => {
        //Check if we need to re-calculate split
        if(splitWays !== null && splitResult !== [])
        {
            calculateSplit(splitWays);
        }
    }, [displayDiscountAmount,calculateSplit,splitResult,splitWays]);*/


    //Flags to show / hide keys
    const showChangeBtn = paymentMethod === "Cash" && discountMode !== true && splitMode !== true && !DELIVERY_ORDER;
    const showExactBtn = paymentMethod === "Cash" && discountMode !== true && splitMode !== true && !DELIVERY_ORDER;
    const showNotesBtns = ((paymentMethod === "Cash" && discountMode !== true && splitMode !== true) || (discountMode === true && discountMethod === "£")) && !DELIVERY_ORDER;
    const showPercentBtns = (discountMode === true && discountMethod === "%") && !DELIVERY_ORDER;

    function orderBtnHandler()
    {
        // alert(selecteddeliverytime);
        //Update Order status to 'inkitchen'
        if(selecteddeliverytime == null){
            selecteddeliverytime = null
        } else {
            var date = new Date(selecteddeliverytime);
           date.setMinutes( date.getMinutes() + props.siteData.deliverytime );
           date = date.toISOString();
        }
        props.changeOrderStatus({status : 'new' , deliverytime:date})
    }

    function payBtnHandler()
    {   
        //Set order payment status to paid
        var discountAmnt = parseFloat(displayDiscountAmount);
        var subtotal = ORDER_TOTAL;
        var orderTotal = parseFloat(ORDER_TOTAL - discountAmnt);
        var paymentStatus = "paid";

        //Update Order Payment Status
        props.changeOrderPaymentStatus(
            paymentStatus,
            paymentMethod.toLowerCase(),
            subtotal,
            orderTotal,
            discountAmnt
        );
    }

    const calculateSplitFn = (p, d, n) =>
    {
        const fill = (n, x) =>(Array (n) .fill (x));
        const concat = (xs, ys) =>(xs .concat (ys));
        const quotrem = (n, d) =>([ Math .floor (n / d), Math .floor (n % d)]);
        const e = Math .pow (10, p);
        const [ q, r ] = quotrem (n * e, d);

        return concat( fill (r, (q + 1) / e), fill (d - r, q / e))
    }

    function calculateDiscount()
    {
        var discountAmount = 0;
        var toDiscountrom = ORDER_TOTAL;

        if(discountMethod === "%")
        {
            var p = typed;
            discountAmount = (toDiscountrom / 100) * p;
        }
        else
        {
            
            discountAmount = parseFloat(typed);
        }

        if(discountAmount > toDiscountrom){discountAmount = toDiscountrom;}

        setDisplayDiscountAmount(discountAmount);
        setDiscountMode(false);
        setDiscountMethod("£");
        updateTyped("");
        updateTypedPrefix("");

        
    }


    function calculateSplit(ways)
    {
        var toSplit = ORDER_TOTAL - displayDiscountAmount;

        var each = calculateSplitFn(2,parseInt(ways),toSplit);

        return each;
        //setSplitResult(each);
    }

    
    /*function getNextPaymentMethod()
    {
        var n = "";
        switch(paymentMethod)
        {
            case "Cash" :
                n = "Card";
            break;
            case "Card":
                n = "Link";
            break;
            default: //Link
                n = "Cash";
            break;
        }
        return n;
    }*/


    function keyPressed(event)
    {
        var val = event.target.dataset.val;

        switch(val)
        {
            case "DISCOUNT" :
                if(splitMode === true)
                {
                    setSplitMode(false);
                    updateTyped("");
                    updateTypedPrefix("");
                    setSplitWays(null);
                }

                if(discountMode === true){
                    setDiscountMode(false);
                    updateTyped("");
                    updateTypedPrefix("");
                }
                else
                {
                    setDiscountMode(true);
                    updateTyped("");
                    updateTypedPrefix("Enter Discount Amount: ");
                }
            break;
            case "£" :
                if(discountMode === true)
                {
                    setDiscountMethod("%");
                }
            break;
            case "%" :
                if(discountMode === true)
                {
                    setDiscountMethod("£");
                }
            break;
            case "APPLY":
                if(discountMode === true)
                {
                    calculateDiscount();
                }
                else if(splitMode === true && typed !== "" && !isNaN(typed) && typed <= SPLIT_LIMIT)
                {
                    setSplitWays(typed);
                    calculateSplit(typed);

                    //Now deactive split mode
                    setSplitMode(false);
                    updateTyped("");
                    updateTypedPrefix("");
                }
            break;
            case "pm_Cash" :
                setpaymentMethod("Cash");
            break;
            case "pm_Card" :
                setpaymentMethod("Card");
            break;
            case "pm_Link" :
                setpaymentMethod("Link");
            break;
            case "SPLIT" :
                if(discountMode === true)
                {
                    setDiscountMode(false);
                    setDiscountMethod("£");
                    updateTyped("");
                }

                if(splitMode === true)
                {
                    setSplitMode(false);
                   // setSplitWays(null);
                    updateTypedPrefix("");
                    updateTyped("");
                }
                else
                {
                    setSplitMode(true);
                    updateTypedPrefix("Split the total how many ways: ");
                }

                
            break;
            case "CHANGE":
                setChangeDue( (parseFloat(typed) - ORDER_TOTAL).toFixed(2) );
                updateTyped("");
            break
            case "EXACT" :
                setChangeDue("£0.00");
            break;
            case "CE" :
                if(discountMode){/* setDiscountedTotal(0);*/ }
                updateTyped((discountMode ? "-" : ""));
            break;
            case "note_5" :
                updateTyped("5.00");
            break;
            case "note_10" :
                updateTyped("10.00");
            break;
            case "note_20" :
                updateTyped("20.00");
            break;
            case "note_50" :
                updateTyped("50.00");
            break;
            case "percent_5" :
                updateTyped("5");
            break;
            case "percent_10" :
                updateTyped("10");
            break;
            case "percent_15" :
                updateTyped("15");
            break;
            case "percent_20" :
                updateTyped("20");
            break;
            default:
                var nval = typed + val;
                updateTyped(nval);
            break;
        }

        
    }

    function estimatedDeliveryTime(event){
        selecteddeliverytime = event.target.value;
    }

    function changeddeliverytime(event){
        selecteddeliverytime =  event.target.value == 'asap' ? null : selecteddeliverytime;
        
        event.target.value == 'time' ? setDeliveryTime(true) : setDeliveryTime(false);
    }

    function updatedeliverystatus (){
        // props.updateOrderDeliveryTime(selecteddeliverytime);
    }

    return (
        <>
            <div className="orderPaymentWrapper">
                <div id="OrderPaymentReadout">
                    <div className="content">
                        <div className="orderTotaling">
                            <div className="due">{displayDiscountAmount > 0  ? "SUBTOTAL" : "TOTAL DUE"}: £{ORDER_TOTAL.toFixed(2)}</div>
                            {
                                displayDiscountAmount > 0 ? 
                                (
                                    <>
                                        <div className="discount">DISCOUNT: £{displayDiscountAmount.toFixed(2)}</div>
                                        <div className="newtotal">TOTAL: £{( ORDER_TOTAL - displayDiscountAmount).toFixed(2)}</div>
                                    </>
                                ) 
                                : 
                                null
                            }
                            {
                                splitWays !== null ?
                                (
                                    calculateSplit(splitWays).map((split, index) => (<div key={index} className="split">Payment {index +1}: £{split}</div>))
                                ) 
                                : null
                            }
                            {changeDue ? (<div className="change">CHANGE: {changeDue}</div>) : null}
                        </div>
                        <div className="submitSettings">
                            <div className="setting">
                                <label>Send Payment Link?</label>
                                <label className="switchSlider">
                                    <input type="checkbox" onChange={()=>{setSendPaymentLink(!sendPaymentLink);}} checked={sendPaymentLink}/>
                                    <span className="slider"></span>
                                    <span className="opt">Yes</span>
                                    <span className="opt">No</span>
                                </label>
                            </div>
                            <div className="setting">
                                <label>Print Receipt Now?</label>
                                <label className="switchSlider">
                                    <input type="checkbox" onChange={()=>{setPrintReceipt(!printReceipt);}} checked={printReceipt}/>
                                    <span className="slider"></span>
                                    <span className="opt">Yes</span>
                                    <span className="opt">No</span>
                                </label>
                            </div>
                            {
                                props.currentOrder.type == 'delivery' &&
                                <div>
                                    Delivery Time:
                                    <select onChange={changeddeliverytime} className={styles.formcontrol_select} style={{marginBottom : 10}}>
                                        <option value="asap" selected={props.currentOrder.estimateddelivery === null}>ASAP</option>
                                        <option value="time" selected={props.currentOrder.estimateddelivery !== null}>Requested Time</option>npm
                                    </select>

                                    {
                                        (DeliveryTime || selecteddeliverytime != null) ?
                                         (
                                                <>
                                                    <label>Select Devliery Time</label>
                                                    {
                                                        props.currentOrder.estimateddelivery !== null ?
                                                            (
                                                                <input type="datetime-local" defaultValue={estimateddelivery} onChange={estimatedDeliveryTime} />
                                                            )
                                                            :
                                                            (
                                                                <input type="datetime-local" onChange={estimatedDeliveryTime} />
                                                            )
                                                    }
                                                </>
                                            )
                                            :
                                            null
                                    }

                                </div>
                            }
                        </div>
                    </div>
                    <div className="typeBar">
                        {
                            discountMode === true ?
                            (
                                typedPrefix + discountMethod + typed
                            )
                            :
                            (
                                typedPrefix + typed
                            )
                        }
                        
                    </div>
                </div>
                <div id="OrderPaymentControls">
                    <div className="keypad">
                        <div className={"key " + (discountMode === true ? "action" : "")} onClick={keyPressed} data-val="DISCOUNT">DISCNT</div>
                        <div className={"key " + (splitMode === true ? "action" : "")} onClick={keyPressed} data-val="SPLIT">SPLIT</div>
                        {
                            props.currentOrder.status === "new" ? 
                            (
                                <div className="key success" onClick={orderBtnHandler}>ORDER</div>
                            )
                            : 
                            (<div className="key"></div>)
                        }
                        {
                            discountMode === true ? 
                            (
                                <div className="key special"  onClick={keyPressed} data-val={discountMethod === "£" ? "£" : "%"}>
                                    {discountMethod === "£" ? "%" : "£"}
                                </div>
                            )
                            :
                            paymentMethod === "Cash" && splitMode !== true && !DELIVERY_ORDER ? 
                            (
                                <div className="key function" onClick={keyPressed} data-val="pm_Card">Pay Card</div>
                            ) 
                            : 
                            paymentMethod === "Card" && !DELIVERY_ORDER ? 
                            (
                                <div className={"key function"} onClick={keyPressed} data-val="pm_Cash">Pay Cash</div>
                            )
                            :
                            (<div className="key"></div>) 
                        }
                        {
                            discountMode === true || splitMode === true ? 
                            (
                                <div className="key success" onClick={keyPressed} data-val="APPLY">APPLY</div>
                            )
                            :
                            (<div className={"key " + (sendPaymentLink === true ? "action" : "")} onClick={()=>{setSendPaymentLink(!sendPaymentLink)}}>PAY LINK?</div>)
                        }
                        

                        <div className="key numeric" onClick={keyPressed} data-val="7">7</div>
                        <div className="key numeric" onClick={keyPressed} data-val="8">8</div>
                        <div className="key numeric" onClick={keyPressed} data-val="9">9</div>
                        {
                            showNotesBtns ? 
                            (
                                <div className="key special" onClick={keyPressed} data-val="note_5">£5</div>
                            ) 
                            : 
                            showPercentBtns ? 
                            (
                                <div className="key special" onClick={keyPressed} data-val="percent_5">5%</div>
                            ) 
                            : 
                            (
                                <div className="key"></div>
                            )
                        }
                        {
                            showExactBtn ? 
                            (
                                <div className="key action" onClick={keyPressed} data-val="EXACT">EXACT</div>
                            ) 
                            :
                            (
                                <div className="key"></div>
                            )
                        }
                        
                        <div className="key numeric" onClick={keyPressed} data-val="4">4</div>
                        <div className="key numeric" onClick={keyPressed} data-val="5">5</div>
                        <div className="key numeric" onClick={keyPressed} data-val="6">6</div>
                        {
                            showNotesBtns ? 
                            (
                                <div className="key special" onClick={keyPressed} data-val="note_10">£10</div>
                            ) 
                            : 
                            showPercentBtns ? 
                            (
                                <div className="key special" onClick={keyPressed} data-val="percent_10">10%</div>
                            ) 
                            : 
                            (
                                <div className="key"></div>
                            )
                        }
                        {
                            showChangeBtn ? 
                            (
                                <div className="key action" onClick={keyPressed} data-val="CHANGE">CHANGE</div>
                            ) 
                            : 
                            (
                                <div className="key"></div>
                            )
                        }
                        <div className="key numeric" onClick={keyPressed} data-val="1">1</div>
                        <div className="key numeric" onClick={keyPressed} data-val="2">2</div>
                        <div className="key numeric" onClick={keyPressed} data-val="3">3</div>
                        {
                            showNotesBtns ? 
                            (
                                <div className="key special" onClick={keyPressed} data-val="note_20">£20</div>
                            ) 
                            : 
                            showPercentBtns ? 
                            (
                                <div className="key special" onClick={keyPressed} data-val="percent_15">15%</div>
                            ) 
                            : 
                            (
                                <div className="key"></div>
                            )
                        }
                        <div className="key danger" onClick={props.cancelOrderPayment}>CANCEL</div>
                        <div className="key function" onClick={keyPressed} data-val=".">.</div>
                        <div className="key numeric" onClick={keyPressed} data-val="0">0</div>
                        <div className="key function" onClick={keyPressed} data-val="CE">CE</div>
                        {
                            showNotesBtns ? 
                            (
                                <div className="key special" onClick={keyPressed} data-val="note_50">£50</div>
                            ) 
                            : 
                            showPercentBtns ? 
                            (
                                <div className="key special" onClick={keyPressed} data-val="percent_20">20%</div>
                            ) 
                            : 
                            (
                                <div className="key"></div>
                            )
                        }
                        
                        <div className="key success" onClick={payBtnHandler}>{!DELIVERY_ORDER ? "PAID" : "SUBMIT"}</div>
                    </div>
                </div>
            </div>
        </>
    );
}