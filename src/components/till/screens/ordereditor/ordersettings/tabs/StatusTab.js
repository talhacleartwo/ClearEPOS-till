import styles from '../../../../../../Setup.module.css';

var status = "";

export default function StatusTab(props)
{
    console.log(props);
    status = props.orderStatus;

    function changedstatus (event){
        event = event ||  window.event;
        status = event.target.value;
    }
    function updateStatus (){
        props.updateCurrentOrderStatus({status : status , deliverytime : props.orderDeliveryTime});
    }

    return (
        <div>
            <label>Update Order Status</label>
            <select className={styles.formcontrol_select} onChange={() => changedstatus(this)} style={{marginTop : 10}} defaultValue={props.orderStatus}>
                {props.orderType == 'walkin' &&
                    <>
                        <option value="new">NEW</option>
                        <option value="inkitchen">In Kitchen</option>
                        <option value="fulfilled">Fulfilled</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="rejected">Rejected</option>
                    </>
                }
                {props.orderType == 'eatin' &&
                    <>
                        <option value="new">NEW</option>
                        <option value="inkitchen">In Kitchen</option>
                        <option value="fulfilled">Fulfilled</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="rejected">Rejected</option>
                    </>
                }
                {props.orderType == 'collection' &&
                    <>
                        <option value="new">NEW</option>
                        <option value="awaitingcollection">Awaiting Collection</option>
                        <option value="inkitchen">In Kitchen</option>
                        <option value="collected">Collected</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="rejected">Rejected</option>
                        <option value="didnotcollect">Did Not Collect</option>
                    </>
                }
                {props.orderType == 'delivery' &&
                    <>
                        <option value="new">NEW</option>
                        <option value="inkitchen">In Kitchen</option>
                        <option value="outfordelivery">out for delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="rejected">Rejected</option>
                        <option value="couldnotdeliver">Could not Deliver</option>
                    </>
                }
                {props.orderType == 'staff' &&
                    <>
                        <option value="new">NEW</option>
                        <option value="inkitchen">In Kitchen</option>
                        <option value="fulfilled">Fulfilled</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="rejected">Rejected</option>
                    </>
                }
            </select>
            <button style={{marginTop : 10}} className="btn btn-success" onClick={() => updateStatus()}>Update Status</button>
        </div>
    );
}