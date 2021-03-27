import {useUserUpdate} from '../../../contexts/UserContext';

import DateTimeClock from "../ui/DateTimeClock";

//Import Tabs
import Tabs from '../controls/Tabs';
import NewOrdersTab from '../controls/tabs/NewOrdersTab';
import StaffOrdersTab from '../controls/tabs/StaffOrdersTab';

function ManageOrdersPanel()
{
    //Use User Update Context
    const setCurrentUser = useUserUpdate();

    

    return (
        <section id="ManageOrders" className="panel sixty">
            <header>
                <div className="left">
                    <div className="brandLogoPlaceholder">Cleartwo</div>
                    <DateTimeClock/>
                    <div className="loggedUser">  | James</div>
                </div>
                <div className="right">
                    <button onClick={() => {setCurrentUser(null)}} className="btn btn-icon btn-danger">L</button>
                </div>
            </header>
            <Tabs startTab='new' 
                tabHeaders=
                {[
                    {key:"new", title:"New"},
                    {key:"inhouse", title:"In-House"},
                    {key:"kitchen", title:"Kitchen"},
                    {key:"complete", title:"Complete"}
                ]} 
                tabBodys=
                {[
                    <NewOrdersTab key="new"/>,
                    <StaffOrdersTab key="staff"/>
                ]}
            />           
        </section>
    );
}

export default ManageOrdersPanel;