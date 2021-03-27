import {useState} from 'react';

import { gql, useMutation } from '@apollo/client';

import CustomerSearchResults from '../controls/CustomerSearchResults';

//Contexts
import { useSetCurrentOrder } from '../../../contexts/OrderContext';

const BLANK_ORDER = {
    type: null,
    source: 'direct',
    customer : null,
    address: null
};

const CREATE_ORDER_MUTATION = gql`
    mutation CreateOrder(
        $type: ENUM_ORDER_TYPE!
        $source: ENUM_ORDER_SOURCE!
        $customer: ID!
        $address: ID
    ) {
        createOrder(
            input: {
                data: {
                    type: $type
                    source: $source
                    customer: $customer
                    address: $address
                }
            }
        )
        {
            order {
                id
                type
                source
                customer {
                    id
                    firstname
                    lastname
                    mobilephone
                }
                address {
                    id
                    name
                    postalcode
                }
            }
        }
    }
`;

function CreateOrderPanel(props)
{

    const [newOrder,updateNewOrder] = useState(BLANK_ORDER);
    const [showSection,changeShowSection] = useState('type');
    const [currentCustomerSearch, setCurrentCustomerSearch] = useState('');

    const [createNewOrder, { loading: mutationLoading, error: mutationError }] = useMutation(CREATE_ORDER_MUTATION, {onCompleted(data){
        openOrder(data);
    }});

    //Use our custom hook to enable us to set the current order after creating or opening one
    var setCurrentOrder = useSetCurrentOrder();

    //Check if currently creating new order
    if(mutationLoading)
    {
        return (
            <div className="loader">
                <div className="spinner"></div>
                <div className="message">Creating Order..</div>
            </div>
        );
    }

    if(mutationError)
    {
        return (
            <div className="Error">Error Creating the order..</div>
        );
    }

    function getTypeOptionClasses(myID)
    {
        return "coOption " + myID + (myID === newOrder.type ? " selected" : "");
    }

    /*Events*/
    function typeChanged(event)
    {
        var val = event.target.dataset.value;
        var nOrder = newOrder;
        nOrder.type = val;
        updateNewOrder(nOrder);
        changeShowSection('customer');
    }

    function searchChanged(event)
    {
        var val = event.target.value;
        setCurrentCustomerSearch(val);
    }

    function addressSelected(event)
    {
        var val = JSON.parse(event.target.dataset.value);
        var cust = JSON.parse(event.target.dataset.customer);
        var nOrder = newOrder;
        nOrder.customer = cust.id;
        nOrder.address = val.id;
        nOrder.customerData = cust;
        nOrder.addressData = val;
        updateNewOrder(nOrder);
        changeShowSection('summary');
    }

    function customerSelected(event)
    {
        var val = JSON.parse(event.target.dataset.customer);
        var nOrder = newOrder;
        nOrder.customer = val.id;
        nOrder.customerData = val;
        updateNewOrder(nOrder);
        changeShowSection('summary');
    }

    function updateCustomer(event)
    {

    }

    function updateAddress(event)
    {

    }

    function createOrder()
    {
        var theOrder = {...newOrder};
        delete theOrder.customerData;
        delete theOrder.addressData;
        createNewOrder({variables:theOrder});
    }

    function openOrder(data)
    {
        console.log("Opening Order:");
        console.log(data);
        setCurrentOrder(data.createOrder.order.id)
    }


    /*Section Renderers*/
    function renderCreatOrderNavigation()
    {
        return(
            <div className="createOrderHeaderBar">
                {showSection === 'customer' ? <div className="navbtn prev" onClick={() => changeShowSection('type')}>P</div> : null}
                {showSection === 'summary' ? <div className="navbtn prev" onClick={() => changeShowSection('customer')}>P</div> : null}
                {showSection === 'editCustomer' ? <div className="navbtn prev" onClick={() => changeShowSection('summary')}>P</div> : null}
                {showSection === 'editAddress' ? <div className="navbtn prev" onClick={() => changeShowSection('summary')}>P</div> : null}
                <h3>Create Order</h3>
                {showSection === 'type' && newOrder.type != null ? <div className="navbtn next" onClick={() => changeShowSection('customer')}>N</div> : null}
                {showSection === 'customer' && newOrder.customer != null ? <div className="navbtn next" onClick={() => changeShowSection('summary')}>N</div> : null}
            </div>
        );
    }

    function renderTypeSection()
    {
        return (
            <div className="section delivery_type">
                <h4 className="center">Order Type</h4>
                <div className="coSelector">
                    <div className={getTypeOptionClasses('walkin')} data-value="walkin" onClick={typeChanged}>Walk In</div>
                    <div className={getTypeOptionClasses('eatin')} data-value="eatin" onClick={typeChanged}>Eat In</div>
                    <div className={getTypeOptionClasses('collection')} data-value="collection" onClick={typeChanged}>Collection</div>
                    <div className={getTypeOptionClasses('delivery')} data-value="delivery" onClick={typeChanged}>Delivery</div>
                    <div className={getTypeOptionClasses('staff')} data-value="staff" onClick={typeChanged}>Staff</div>
                </div>
            </div>
        );
    }


    function renderCustomerSearch()
    {
        if(newOrder.source === 'staff') return null;

        var updateFunctionToCall = newOrder.type === 'collection' ? customerSelected : addressSelected;
        return (
            <div className="customerSearch">
                <h4 className="center">Customer</h4>
                <input type="number" pattern="\d*" className="search__customers" placeholder="Search Customers By Number" value={currentCustomerSearch} onChange={searchChanged}/>
                {
                    currentCustomerSearch !== "" ? 
                        <CustomerSearchResults 
                        search={currentCustomerSearch} 
                        updateFunction={updateFunctionToCall}
                        customerOnly={newOrder.type === 'collection'}
                        /> 
                    : null
                }
            </div>
        );
    }

    function renderSummarySection()
    {
        return(
            <div className="section summary">
                <div className="customerCard">
                    <div className="customerIcon">C</div>
                    <div className="content">
                        <div className="name">{newOrder.customerData.firstname} {newOrder.customerData.lastname}</div>
                        <div className="sub">{newOrder.customerData.mobilephone}</div>
                    </div>
                </div>
                <hr className="fifty"/>
                {
                    newOrder.addressData ? 
                        (
                            <>
                                <div className="addressCard">
                                    <div className="addressIcon">A</div>
                                    <div className="content">
                                        Delivering to {newOrder.addressData.name} address at {newOrder.addressData.postalcode}
                                    </div>
                                </div>
                                <hr/>
                            </>
                        )
                    : 
                    newOrder.type === 'collection' ? 
                        (
                            <>
                            <div className="addressCard">
                                <div className="addressIcon">A</div>
                                    <div className="content">
                                        Collection from store
                                    </div>
                                </div>
                                <hr/>
                            </>
                        ) 
                        : null
                }
                <div className="buttonBar">
                    <div className="btn btn-info" onClick={() => {changeShowSection('editCustomer');} }>Edit Customer</div>
                    {newOrder.addressData ? <div className="btn btn-info" onClick={() => {changeShowSection('editAddress');} }>Edit Address</div> : null}
                    <div className="btn btn-success" onClick={createOrder}>Create Order</div>
                </div>
            </div>
        );
    }

    function renderCustomerEditSection()
    {
        return(
            <div className="section editCustomer">
                <form onSubmit={updateCustomer}> 
                    <div class="group">
                        <label>First Name*</label>
                        <input type="text" name="firstname" value={newOrder.customerData.firstname} required />
                    </div>
                    <div class="group">
                        <label>Last Name</label>
                        <input type="text" name="firstname" value={newOrder.customerData.lastname}  />
                    </div>
                    <div class="group">
                        <label>Telephone*</label>
                        <input type="text" name="mobilephone" value={newOrder.customerData.mobilephone} required />
                    </div>
                </form>
            </div>
        );
    }

    function renderAddressEditSection()
    {
        return(
            <div className="section editAddress">
                <form onSubmit={updateAddress}> 
                    <div class="group">
                        <label>Name*</label>
                        <input type="text" name="name" value={newOrder.addressData.name} required />
                    </div>
                    <div class="group">
                        <label>Line 1*</label>
                        <input type="text" name="line1" value={newOrder.addressData.line1} required />
                    </div>
                    <div class="group">
                        <label>Line 2</label>
                        <input type="text" name="line2" value={newOrder.addressData.line2}  />
                    </div>
                    <div class="group">
                        <label>City*</label>
                        <input type="text" name="city" value={newOrder.addressData.city} required />
                    </div>
                    <div class="group">
                        <label>County</label>
                        <input type="text" name="county" value={newOrder.addressData.city} />
                    </div>
                    <div class="group">
                        <label>Postcode*</label>
                        <input type="text" name="postalcode" value={newOrder.addressData.postalcode} required />
                    </div>
                </form>
            </div>
        );
    }

    return (
        <section id="CreateOrder" className="panel forty">
            {renderCreatOrderNavigation()}
            {showSection === 'type' ? renderTypeSection() : null}
            {showSection === 'customer' ? renderCustomerSearch() : null}
            {showSection === 'summary' ? renderSummarySection() : null}
            {showSection === 'editCustomer' ? renderCustomerEditSection() : null}
            {showSection === 'editAddress' ? renderAddressEditSection() : null}
        </section>
    );
}

export default CreateOrderPanel;