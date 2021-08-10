import Tabs from "../../../controls/Tabs"
import CurrentOrderHeader from "../../../ui/CurrentOrderHeader"
import GeneralTab from "./tabs/GeneralTab";
import NotesTab from "./tabs/NotesTab";
import StatusTab from "./tabs/StatusTab";
import {PrintReceipt} from '../../../../../service/printer';

export default function OrderSettings(props)
{
    var notes = '';
    function set_notes(note){
        notes = note;
    }
    return (
        <div className="orderSettingsWrapper">
            <CurrentOrderHeader currentOrder={props.existingOrder} orderSettingsToggle={props.closeOrderSettings}/>
            <div id="SettingsContent">
                <Tabs
                    startTab="general"
                    tabHeaders={[{key:"general", title:"General", icon:"customise"},{key:"notes",title:"Notes",icon:"customise"} , {key:"status",title:"Status",icon:"customise"}]}
                    tabBodys={[
                        <GeneralTab key="general" existingOrder={props.existingOrder}/>,
                        <NotesTab key="notes" set_notes={set_notes} note={props.existingOrder.notes}/>,
                        <StatusTab key="status" updateCurrentOrderStatus={props.updateCurrentOrderStatus} orderType={props.existingOrder.type} orderStatus={props.existingOrder.status} orderDeliveryTime={props.existingOrder.estimateddelivery}/>
                    ]}
                />
            </div>
            <div id="SettingsActions">
                <div className="buttonBar joined">
                    <div className="btn btn-lg btn-danger" onClick={props.closeOrderSettings}>Cancel</div>
                    <div className="btn btn-lg btn-secondary" onClick={()=>{PrintReceipt(props.existingOrder)}}>Re-Print</div>
                    <div className="btn btn-lg btn-success" onClick={()=>props.UpdateOrderNotes(notes)}>Done</div>
                </div>
            </div>
        </div>
    );
}