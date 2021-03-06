import {React, useState} from "react";

import * as _storage from "../../service/storage";

//Apollo
import {gql, useLazyQuery} from "@apollo/client";

//Styles
import '../../Till.css';

//Contexts
import {useCurrentOrder} from '../../contexts/OrderContext';
import {useCurrentUser} from '../../contexts/UserContext';

//Queries
import {CATALOG_CACHE_QUERY} from '../../service/queries';
import {DEVICES_QUERY} from '../../service/queries';

//Components
import CreateOrderPanel from '../till/panels/CreateOrderPanel';
import ManageOrdersPanel from '../till/panels/ManageOrdersPanel';
import OrderEditor from '../till/screens/ordereditor/OrderEditor';
import SignOn from '../toplevel/SignOn';
import LoadCache from '../till/panels/cache/LoadCache';

function Till()
{
    //Setup Contexts
    var currentOrder = useCurrentOrder();

    //Get Current User Context
    var currentUser = useCurrentUser();

    const [awaitingCache,setAwaitingCache] = useState(false);

    const [fetchCatalogCache] = useLazyQuery(CATALOG_CACHE_QUERY,{fetchPolicy:"no-cache",variables:{brands:_storage.getDeviceBrands()}, onCompleted:(data)=>{
        _storage.setCatalogCache(data);
        setAwaitingCache(false);
    }});

    const [getDevices] = useLazyQuery(DEVICES_QUERY, {
        onCompleted: (data) =>{
            setAwaitingCache(true);
            _storage.setDevicesCache(data.devices);
            for (let i = 0; i < data.devices.length; i++) {
                if(data.devices[i].type === 'printer'){
                    _storage.setSettingsCache({activePrinter : data.devices[i].id});
                    break;
                } else {
                    _storage.setSettingsCache({activePrinter : null});
                }
            }
            window.location.reload();
            setAwaitingCache(false);

        }
    })

    if(currentUser)
    {
        //Check if catalog cache has already been saved
        if(!_storage.hasCatalogCache() && !awaitingCache)
        {
            return (
                <LoadCache cache={"catalog"} fetchCatalog={fetchCatalogCache} />
                // <div className="CacheLoadNeeded" onClick={()=>{fetchCatalogCache(); setAwaitingCache(true);}}>Click to load cache</div>
            );
        }
        if(!_storage.hasDevicesCache() && !awaitingCache)
        {
            return (
                <LoadCache cache={"devices"} fetchCatalog={getDevices} />
                // <div className="CacheLoadNeeded" onClick={()=>{getDevices(); setAwaitingCache(true);}}>Click to load Device cache</div>
            );
        }

        if(awaitingCache)
        {
            return (
                <div className="LoadingCache">Please wait while the catalog cache loads..</div>
            );
        }


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
                        <OrderEditor orderId={currentOrder}/>
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