import Tabs from "../../../controls/Tabs"
import CurrentOrderHeader from "../../../ui/CurrentOrderHeader"
import GeneralTab from "./tabs/GeneralTab";
import NotesTab from "./tabs/NotesTab";

import {PrintReceipt} from '../../../../../service/printer';

export default function OrderSettings(props)
{

    
    return (
        <div className="orderSettingsWrapper">
            <CurrentOrderHeader currentOrder={props.existingOrder} orderSettingsToggle={props.closeOrderSettings}/>
            <div id="SettingsContent">
                <Tabs 
                    startTab="general"
                    tabHeaders={[{key:"general", title:"General", icon:"customise"},{key:"notes",title:"Notes",icon:"customise"}]}
                    tabBodys={[
                        <GeneralTab key="general" existingOrder={props.existingOrder}/>,
                        <NotesTab key="notes"/>
                    ]}
                />
            </div>
            <div id="SettingsActions">
                <div className="buttonBar joined">
                    <div className="btn btn-lg btn-danger" onClick={props.closeOrderSettings}>Cancel</div>
                    <div className="btn btn-lg btn-secondary" onClick={()=>{PrintReceipt(props.existingOrder)}}>Re-Print</div>
                    <div className="btn btn-lg btn-success">Done</div>
                </div>
            </div>
        </div>
    );
}