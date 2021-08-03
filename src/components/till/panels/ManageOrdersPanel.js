import {useUserUpdate} from '../../../contexts/UserContext';

import DateTimeClock from "../ui/DateTimeClock";
import React, { useState } from 'react';

import {LoadingData} from '../../../components/till/ui/DisplayUtility';
import { useQuery, gql } from '@apollo/client';

import ManageOrders from "./ManageOrders";
import UserSettings from "./UserSettings";

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

var renderUsers = 'orders';

function ManageOrdersPanel()
{
     const [renderUsersSettings, setView] = useState([]);
     const setCurrentUser = useUserUpdate();

    //Fetch all orders
    const { loading, error, data } = useQuery(OPEN_ORDERS,{fetchPolicy: "cache-and-network"});

    if (loading) return LoadingData();
    if (error) return <p>Error :(</p>;

    function changeUserSettings (data){
        setView(renderUsersSettings => data);
    }

    function changeprinterSetting(printer_id){
        localStorage.setItem('settingscache',JSON.stringify({activePrinter : printer_id}));
        setView(renderUsersSettings => 'orders');
    }

    if(renderUsersSettings === 'settings'){
        return (

            <section id="ManageOrders" className="panel sixty">
                <header>
                    <div className="left">
                        <div className="brandLogoPlaceholder">Cleartwo</div>
                        <DateTimeClock/>
                        <div className="loggedUser">  | James</div>
                    </div>
                    <div className="right">
                        <div style={{marginRight : 10}} onClick={() => {changeUserSettings('orders')}} className="btn btn-icon btn-info "><i className="icon-prev"></i></div>
                        <div onClick={() => {setCurrentUser(null)}} className="btn btn-icon btn-danger "><i className="icon-exit"></i></div>
                    </div>
                </header>
                <div className="clearfix"></div>
                <UserSettings changeSettings = {changeprinterSetting}/>
            </section>

        );
    } else {
        return (
            <section id="ManageOrders" className="panel sixty">
                <header>
                    <div className="left">
                        <div className="brandLogoPlaceholder">Cleartwo</div>
                        <DateTimeClock/>
                        <div className="loggedUser">  | James</div>
                    </div>
                    <div className="right">
                        <div style={{marginRight : 10}} onClick={() => {changeUserSettings('settings')}} className="btn btn-icon btn-info "><i className="icon-settings"></i></div>
                        <div onClick={() => {setCurrentUser(null)}} className="btn btn-icon btn-danger "><i className="icon-exit"></i></div>
                    </div>
                </header>
                <div className="clearfix"></div>
                <ManageOrders ordersData ={data} />
            </section>
        );
    }
}

export default ManageOrdersPanel;