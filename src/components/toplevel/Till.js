import React from "react";

//Styles
import '../../Till.css';

//Contexts
import {useCurrentOrder} from '../../contexts/OrderContext';
import {useCurrentUser} from '../../contexts/UserContext';

//Components
import CreateOrderPanel from '../till/panels/CreateOrderPanel';
import ManageOrdersPanel from '../till/panels/ManageOrdersPanel';
import OrderEditor from '../till/screens/ordereditor/OrderEditor';
import SignOn from '../toplevel/SignOn';

function Till()
{
    //Setup Contexts
    var currentOrder = useCurrentOrder();

    //Get Current User Context
    var currentUser = useCurrentUser();

    if(currentUser)
    {
        //Present Till interface
        return(
            <div id="Till">
                {
                    currentOrder === null ? 
                    (
                        <>
                            <CreateOrderPanel/>
                            <ManageOrdersPanel/>
                        </>
                    )
                    : 
                    (
                        <OrderEditor/>
                    )
                }
                
            </div>
        );
    }

    //Show sign on screen
    return (
        <SignOn/>
    )
}

export default Till;