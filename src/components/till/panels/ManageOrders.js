

//Import Tabs
import Tabs from '../controls/Tabs';
import NewOrdersTab from '../controls/tabs/NewOrdersTab';
import CompleteOrdersTab from '../controls/tabs/CompleteOrdersTab';
import InHouseOrdersTab from '../controls/tabs/InHouseOrdersTab';
import ProcessingOrdersTab from '../controls/tabs/ProcessingOrdersTab';

function ManageOrders(props)
{

    return (
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
                      <NewOrdersTab key="new" orders={props.ordersData.orders}/>,
                      <InHouseOrdersTab key="inhouse" orders={props.ordersData.orders}/>,
                      <ProcessingOrdersTab key="processing" orders={props.ordersData.orders}/>,
                      <CompleteOrdersTab key="complete" orders={props.ordersData.orders}/>
                  ]}
        />
    );
}

export default ManageOrders;