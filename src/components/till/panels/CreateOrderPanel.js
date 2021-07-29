import {useState} from 'react';

import { gql, useMutation } from '@apollo/client';

import CustomerSearchResults from '../controls/CustomerSearchResults';

//Contexts
import { useSetCurrentOrder } from '../../../contexts/OrderContext';
import StaffSearchResults from '../controls/StaffSearchResults';

import CustomersResults from '../controls/CustomersResults';
import CustomerForm from '../controls/CustomerForm';
import AddressesResults from '../controls/AddressesResults';
import AddressForm from '../controls/AddressForm';

import {ORDER_QUERY, UPDATE_ORDER_STATUS} from "../../../service/queries";

const BLANK_ORDER = {
    type: null,
    source: 'direct',
    staff_member: null,
    customer : null,
    address: null
};



const CREATE_ORDER_MUTATION = gql`
    mutation CreateOrder(
        $type: ENUM_ORDER_TYPE!
        $source: ENUM_ORDER_SOURCE!
        $staff_member: ID,
        $customer: ID,
        $address: ID
    ) {
        createOrder(
            input: {
                data: {
                    type: $type
                    source: $source
                    staff_member: $staff_member
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
                staff_member
                {
                    id,
                    firstname,
                    lastname
                }
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
const CREATE_CUSTOMER_MUTATION = gql`
    mutation CreateCustomer(
        $email : String!,
        $firstname : String!,
        $lastname : String!,
        $mobilephone : String!,
        $birthdate: Date!
    ) {
        createCustomer(
            input: {
                data: {
                    emailaddress1: $email,
                    firstname: $firstname,
                    lastname: $lastname,
                    mobilephone: $mobilephone,
                    birthdate: $birthdate
                }
            }
        )
        {
            customer {
                id
                firstname
                lastname
            }
        }
    }
`;
const CREATE_ADDRESS_MUTATION = gql`
    mutation CreateAddress(
        $name : String!,
        $line1 : String!,
        $line2 : String!,
        $postalcode : String!,
        $city: String!,
        $country: String!,
        $customer_id : ID!
    ) {
        createAddress(
            input: {
            data: {
                name: $name,
                line1: $line1,
                line2: $line2,
                city: $city,
                postalcode: $postalcode,
                county: $country,
                customer: $customer_id
            }
        }
    )
        {
            address{
                line1
                line2
                postalcode
        }
        }
    }
`;
var customer_id = "";
function CreateOrderPanel(props)
{
    var create_customer = null;
    const [newOrder,updateNewOrder] = useState(BLANK_ORDER);
    const [showSection,changeShowSection] = useState('type');
    const [currentCustomerSearch, setCurrentCustomerSearch] = useState('');

    const [createNewOrder, { loading: mutationLoading, error: mutationError }] = useMutation(CREATE_ORDER_MUTATION, {
        onCompleted(data){
            openOrder(data);
        }
    });

    const [CreateCustomer, { loading: customermutationLoading, error: CustomermutationError }] = useMutation(CREATE_CUSTOMER_MUTATION, {
        onCompleted(data){
            changeShowSection('customers');
        }
    });
    const [CreateAddress, { loading: addressmutationLoading, error: addressmutationError }] = useMutation(CREATE_ADDRESS_MUTATION, {
        onCompleted(data){
            changeShowSection('customers');
        }
    });



    //Use our custom hook to enable us to set the current order after creating or opening one
    var setCurrentOrder = useSetCurrentOrder();

    //IF the current type is walkin or eatin, create the order now
    /*useEffect(() => {
        if( (newOrder.type === "eatin" || newOrder.type === "walkin") && !mutationLoading )
        {
            createOrder();
        }
    }, [newOrder.type]);*/
    

    

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

        if(val === "collection" || val === "delivery")
        {
            changeShowSection('customer');
        }
        else if(val === "customers"){
            changeShowSection('customers');
        }
        else
        {
            changeShowSection('staff');
        }
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

    function staffMemberSelected(event)
    {
        var val = JSON.parse(event.target.dataset.staffmember);
        var nOrder = newOrder;
        nOrder.staff_member = val.id;
        nOrder.staffData = val;
        updateNewOrder(nOrder);
        changeShowSection('summary');
    }

    function updateCustomer(event)
    {

    }

    function updateAddress(event)
    {

    }

    function createOrder(nOrder)
    {
        var theOrder = {...nOrder};
        delete theOrder.customerData;
        delete theOrder.staffData;
        delete theOrder.addressData;
        console.log("order query check : ");
        console.log(theOrder);
        createNewOrder({variables:theOrder});
    }

    function createEatinWalkinOrder(type)
    {
        var no={...BLANK_ORDER}; 
        no.type=type;
        createOrder(no);
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
            <>
                <header className="withNav">
                    {showSection === 'customerform' ? <div className="navbtn prev" onClick={() => changeShowSection('customers')}><i className="icon-prev"></i></div> : null}
                    {showSection === 'addressform' ? <div className="navbtn prev" onClick={() => changeShowSection('customers')}><i className="icon-prev"></i></div> : null}
                    {showSection === 'customers' ? <div className="navbtn prev" onClick={() => changeShowSection('type')}><i className="icon-prev"></i></div> : null}
                    {showSection === 'customer' ? <div className="navbtn prev" onClick={() => changeShowSection('type')}><i className="icon-prev"></i></div> : null}
                    {showSection === 'staff' ? <div className="navbtn prev" onClick={() => changeShowSection('type')}><i className="icon-prev"></i></div> : null}
                    {showSection === 'summary' ? <div className="navbtn prev" onClick={() => changeShowSection('customer')}><i className="icon-prev"></i></div> : null}
                    {showSection === 'editCustomer' ? <div className="navbtn prev" onClick={() => changeShowSection('summary')}><i className="icon-prev"></i></div> : null}
                    {showSection === 'addresses' ? <div className="navbtn prev" onClick={() => changeShowSection('customers')}><i className="icon-prev"></i></div> : null}
                    <h3>Create Order</h3>
                    {showSection === 'type' && newOrder.type != null ? <div className="navbtn next" onClick={() => changeShowSection('customer')}><i className="icon-next"></i></div> : null}
                    {showSection === 'customer' && newOrder.customer != null ? <div className="navbtn next" onClick={() => changeShowSection('summary')}><i className="icon-next"></i></div> : null}
                </header>
                <div className="clearfix"></div>
            </>
        );
    }

    function renderTypeSection()
    {
        return (
            <div className="section delivery_type">
                {/*<h4 className="center">Order Type</h4>*/}
                <div className="coSelector">
                    <div className={getTypeOptionClasses('walkin')} data-value="walkin" onClick={()=>{createEatinWalkinOrder("walkin")}}>Walk In</div>
                    <div className={getTypeOptionClasses('eatin')} data-value="eatin" onClick={()=>{createEatinWalkinOrder("eatin")}}>Eat In</div>
                    <div className={getTypeOptionClasses('collection')} data-value="collection" onClick={typeChanged}>Collection</div>
                    <div className={getTypeOptionClasses('delivery')} data-value="delivery" onClick={typeChanged}>Delivery</div>
                    <div className={getTypeOptionClasses('staff')} data-value="staff" onClick={typeChanged}>Staff</div>
                    <div className={getTypeOptionClasses('customers')} data-value="customers" onClick={typeChanged}>Customers</div>
                </div>
            </div>
        );
    }

    function ShowCustomerForm(){
        changeShowSection('customerform');
    }

    function CreateCustomerForm(data){

        CreateCustomer({variables:{email:data.email , firstname:data.fname , lastname:data.lname , birthdate:data.date , mobilephone:data.phone}});

    }

    function renderCustomers(){
        return (

            <div className="customerSearch">
                <h4 className="center">Customers</h4>
                {
                    // <CustomersResults updateFunction={staffMemberSelected}/>
                    <CustomersResults CustomerForm={ShowCustomerForm} renderaddress={showAddresses}/>
                }
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

    function renderStaffList()
    {
        return(
            <div className="staffSearch">
                <h4 className="center">Staff Member</h4>
                {
                    <StaffSearchResults updateFunction={staffMemberSelected}/>
                }
            </div>
        );
    }

    function renderSummarySection()
    {
        return(
            <div className="section summary">
                {
                    newOrder.type === 'staff' ?
                    (
                        <div className="customerCard">
                            <div className="customerIcon"><i className="icon-person"></i></div>
                            <div className="content">
                                <div className="name">{newOrder.staffData.firstname} {newOrder.staffData.lastname}</div>
                            </div>
                        </div>
                    )
                    :
                    (
                        <div className="customerCard">
                            <div className="customerIcon"><i className="icon-person"></i></div>
                            <div className="content">
                                <div className="name">{newOrder.customerData.firstname} {newOrder.customerData.lastname}</div>
                                <div className="sub">{newOrder.customerData.mobilephone}</div>
                            </div>
                        </div>
                    )
                }
                
                <hr className="fifty"/>
                {
                    newOrder.addressData && newOrder.type === "delivery" ? 
                    (
                        <>
                            <div className="addressCard">
                                <div className="addressIcon"><i className="icon-location"></i></div>
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
                            <div className="addressIcon"><i className="icon-eatin"></i></div>
                                <div className="content">
                                    Collection from store
                                </div>
                            </div>
                            <hr/>
                        </>
                    ) 
                    : 
                    null
                }
                <div className="buttonBar">
                    {
                        newOrder.type !== "staff" ? 
                        (
                            <div className="btn btn-info" onClick={() => {changeShowSection('editCustomer');} }>Edit Customer</div>
                        )
                        :
                        null
                    }
                    {newOrder.addressData ? <div className="btn btn-info" onClick={() => {changeShowSection('editAddress');} }>Edit Address</div> : null}
                    <div className="btn btn-success" onClick={()=>{createOrder(newOrder)}}>Create Order</div>
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

    function showAddresses(id){
        customer_id = id;
        changeShowSection('addresses');
    }
    function renderAddresses(){
        return (
            <div className="customerSearch">
                <h4 className="center">Create New Customer</h4>
                <button className="btn btn-success f_right" onClick={() => ShowAddressForm()}>New Address</button>
                {
                    <AddressesResults cust_id={customer_id}/>
                }
            </div>

        );

    }
    function ShowAddressForm(){
        changeShowSection('addressform');
    }

    function renderAddressForm(){
        return (

            <div className="customerSearch">
                <h4 className="center">Create New Address</h4>
                {
                    // <CustomersResults updateFunction={staffMemberSelected}/>
                    <AddressForm CustomerForm={ShowCustomerForm} form_submit = {CreateAddressForm}/>
                }
            </div>

        );
    }

    function CreateAddressForm(data){
        CreateAddress({variables:{name:data.name , line1:data.line1 , line2:data.line2 , postalcode:data.postalcode , city:data.city , country:data.country, customer_id:customer_id}});
    }

    function renderCustomerForm(){
        return (

            <div className="customerSearch">
                <h4 className="center">Create New Customer</h4>
                {
                    // <CustomersResults updateFunction={staffMemberSelected}/>
                    <CustomerForm CustomerForm={ShowCustomerForm} form_submit = {CreateCustomerForm}/>
                }
            </div>

        );
    }
    return (
        <section id="CreateOrder" className="panel forty">
            {renderCreatOrderNavigation()}
            {showSection === 'type' ? renderTypeSection() : null}
            {showSection === 'customer' ? renderCustomerSearch() : null}
            {showSection === 'customers' ? renderCustomers() : null}
            {showSection === 'staff' ? renderStaffList() : null}
            {showSection === 'summary' ? renderSummarySection() : null}
            {showSection === 'editCustomer' ? renderCustomerEditSection() : null}
            {showSection === 'editAddress' ? renderAddressEditSection() : null}
            {showSection === 'customerform' ? renderCustomerForm() : null}
            {showSection === 'addressform' ? renderAddressForm() : null}
            {showSection === 'addresses' ? renderAddresses() : null}
        </section>
    );
}

export default CreateOrderPanel;