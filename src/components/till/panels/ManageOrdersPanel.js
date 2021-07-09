import {useUserUpdate} from '../../../contexts/UserContext';

import DateTimeClock from "../ui/DateTimeClock";

import {LoadingData} from '../../../components/till/ui/DisplayUtility';
import { useQuery, gql } from '@apollo/client';

//Import Tabs
import Tabs from '../controls/Tabs';
import NewOrdersTab from '../controls/tabs/NewOrdersTab';
import CompleteOrdersTab from '../controls/tabs/CompleteOrdersTab';
import InHouseOrdersTab from '../controls/tabs/InHouseOrdersTab';
import ProcessingOrdersTab from '../controls/tabs/ProcessingOrdersTab';


const OPEN_ORDERS = gql`
    query {orders(sort: "created_at:desc") {
        id,
        ordernumber,
        type,
        status,
        paymentstatus,
        staff_member
        {
            id,
            firstname,
            lastname
        }
        customer{
            firstname,
            lastname
        }
        address{
            id,
            postalcode
        }
        created_at
    }}
`;

function ManageOrdersPanel()
{
    //Use User Update Context
    const setCurrentUser = useUserUpdate();

    //Fetch all orders
    const { loading, error, data } = useQuery(OPEN_ORDERS,{fetchPolicy: "cache-and-network"});
    
    if (loading) return LoadingData();
    if (error) return <p>Error :(</p>;

    return (
        <section id="ManageOrders" className="panel sixty">
            <header>
                <div className="left">
                    <div className="brandLogoPlaceholder">Cleartwo</div>
                    <DateTimeClock/>
                    <div className="loggedUser">  | James</div>
                </div>
                <div className="right">
                    <div onClick={() => {setCurrentUser(null)}} className="btn btn-icon btn-danger"><i className="icon-exit"></i></div>
                </div>
            </header>
            <div className="clearfix"></div>
            <Tabs startTab='new' 
                tabHeaders=
                {[
                    {key:"new", title:"New", icon:"list"},
                    {key:"inhouse", title:"In-House", icon:"eatin"},
                    {key:"processing", title:"Processing",icon:"list"},
                    {key:"complete", title:"Complete",icon:"tick"}
                ]} 
                tabBodys=
                {[
                    <NewOrdersTab key="new" orders={data.orders}/>,
                    <InHouseOrdersTab key="inhouse" orders={data.orders}/>,
                    <ProcessingOrdersTab key="processing" orders={data.orders}/>,
                    <CompleteOrdersTab key="complete" orders={data.orders}/>
                ]}
            />           
        </section>
    );
}

export default ManageOrdersPanel;