import {useState} from 'react';

import { gql, useMutation } from '@apollo/client';

import CustomerSearchResults from '../controls/CustomerSearchResults';

//Contexts
import { useSetCurrentOrder } from '../../../contexts/OrderContext';
import StaffSearchResults from '../controls/StaffSearchResults';

import CustomerForm from '../controls/CustomerForm';
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
const UPDATE_CUSTOMER_MUTATION = gql`

    mutation updatecustomer(
        $id: ID!,
        $fname : String!,
        $lname : String!,
        $phone : String!
    )
    {
        updateCustomer(input:{where:{id:$id},data:{
            firstname : $fname,
            lastname : $lname,
            mobilephone : $phone
        }})
        {
            customer{id}
        }
    }

`;
const UPDATE_ADDRESS_MUTATION = gql`

    mutation updateaddress(
        $id: ID!,
        $name : String!,
        $line1 : String!,
        $line2 : String!
        $postalcode: String!,
        $city : String!,
        $country : String!
    )
    {
        updateAddress(input:{where:{id:$id},data:{
            name : $name,
            line1 : $line1,
            line2 : $line2,
            postalcode : $postalcode,
            city : $city,
            county : $country
        }})
        {
            address{id}
        }
    }

`;
var customer_id = "";
var changedtype = "";
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
            changeShowSection('customer');
        }
    });
    const [CreateAddress, { loading: addressmutationLoading, error: addressmutationError }] = useMutation(CREATE_ADDRESS_MUTATION, {
        onCompleted(data){
            changeShowSection('customer');
        }
    });
    const [UpdateCustomer, { loading: updatecustomermutationLoading, error: updatecustomermutationError }] = useMutation(UPDATE_CUSTOMER_MUTATION, {
        onCompleted(data){
            changeShowSection('customer');
        }
    });
    const [UpdateAddress, { loading: updateaddressmutationLoading, error: updateaddressmutationError }] = useMutation(UPDATE_ADDRESS_MUTATION, {
        onCompleted(data){
            changeShowSection('customer');
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
        changedtype = val;
        if(val !== 'staff')
        {
            changeShowSection('customer');
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

    function updateCustomer(event , cust_id)
    {
        event.preventDefault();
        UpdateCustomer({variables:{id:cust_id , fname : event.target.firstname.value , lname:event.target.lastname.value , phone:event.target.mobilephone.value}});
    }

    function updateAddress(event , address_id)
    {
        event.preventDefault();
        UpdateAddress({variables:{id:address_id , name : event.target.name.value , line1:event.target.line1.value , line2:event.target.line2.value , postalcode: event.target.postalcode.value, city:event.target.city.value , country:event.target.county.value}});
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
                    {showSection === 'customerform' ? <div className="navbtn prev" onClick={() => changeShowSection('customer')}><i className="icon-prev"></i></div> : null}
                    {showSection === 'addressform' ? <div className="navbtn prev" onClick={() => changeShowSection('customer')}><i className="icon-prev"></i></div> : null}
                    {showSection === 'customer' ? <div className="navbtn prev" onClick={() => changeShowSection('type')}><i className="icon-prev"></i></div> : null}
                    {showSection === 'staff' ? <div className="navbtn prev" onClick={() => changeShowSection('type')}><i className="icon-prev"></i></div> : null}
                    {showSection === 'summary' ? <div className="navbtn prev" onClick={() => changeShowSection('customer')}><i className="icon-prev"></i></div> : null}
                    {showSection === 'editCustomer' ? <div className="navbtn prev" onClick={() => changeShowSection('summary')}><i className="icon-prev"></i></div> : null}
                    {showSection === 'editAddress' ? <div className="navbtn prev" onClick={() => changeShowSection('summary')}><i className="icon-prev"></i></div> : null}
                    <h4>Create Order</h4>
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

    function renderCustomerSearch()
    {
        if(newOrder.source === 'staff') return null;

        var updateFunctionToCall = newOrder.type === 'collection' ? customerSelected : addressSelected;
        return (
            <div className="customerSearch">
                <h4 className="center">Customer</h4>
                <div>
                    <button style={{width : "25%"}} className="btn btn-success btn-sm f_right" onClick={() => ShowCustomerForm()}>New Customer</button>
                    <input type="number" pattern="\d*" className="search__customers" style={{width : "70%"}} placeholder="Search Customers By Number" value={currentCustomerSearch} onChange={searchChanged}/>
                </div>
                {
                    currentCustomerSearch !== "" ? 
                        <CustomerSearchResults
                            search={currentCustomerSearch}
                            updateFunction={updateFunctionToCall}
                            customerOnly={newOrder.type === 'collection'}
                            AddressForm={ShowAddressForm}
                            Tab ={changedtype}
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
                <form onSubmit={(event) => updateCustomer(event , newOrder.customerData.id)}>
                    <div class="group">
                        <label>First Name*</label>
                        <input type="text" name="firstname" autoComplete="off" defaultValue={newOrder.customerData.firstname}  required />
                    </div>
                    <div class="group">
                        <label>Last Name</label>
                        <input type="text" name="lastname" autoComplete="off" defaultValue={newOrder.customerData.lastname}  />
                    </div>
                    <div class="group">
                        <label>Telephone*</label>
                        <input type="text" name="mobilephone" autoComplete="off" defaultValue={newOrder.customerData.mobilephone} required />
                    </div>
                    <div className="group">
                        <input style={{width : 100}} type="submit" value="Submit" className="btn btn-success f_right"/>
                    </div>
                </form>
            </div>
        );
    }

    function renderAddressEditSection()
    {
        return(
            <div className="section editAddress">
                <form onSubmit={(event) => updateAddress(event , newOrder.addressData.id)}>
                    <div class="group">
                        <label>Name*</label>
                        <input type="text" name="name" autoComplete="off" defaultValue={newOrder.addressData.name} required />
                    </div>
                    <div class="group">
                        <label>Line 1*</label>
                        <input type="text" name="line1" autoComplete="off" defaultValue={newOrder.addressData.line1} required />
                    </div>
                    <div class="group">
                        <label>Line 2</label>
                        <input type="text" name="line2" autoComplete="off" defaultValue={newOrder.addressData.line2}  />
                    </div>
                    <div class="group">
                        <label>City*</label>
                        <input type="text" name="city" autoComplete="off" defaultValue={newOrder.addressData.city} required />
                    </div>
                    <div class="group">
                        <label>County</label>
                        <input type="text" name="county" autoComplete="off" defaultValue={newOrder.addressData.city} />
                    </div>
                    <div class="group">
                        <label>Postcode*</label>
                        <input type="text" name="postalcode" autoComplete="off" defaultValue={newOrder.addressData.postalcode} required />
                    </div>
                    <input style={{width : 100}} type="submit" value="Submit" className="btn btn-success f_right"/>
                </form>
            </div>
        );
    }
    function ShowAddressForm(cust_id){
        customer_id = cust_id;
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
            {showSection === 'staff' ? renderStaffList() : null}
            {showSection === 'summary' ? renderSummarySection() : null}
            {showSection === 'editCustomer' ? renderCustomerEditSection() : null}
            {showSection === 'editAddress' ? renderAddressEditSection() : null}
            {showSection === 'customerform' ? renderCustomerForm() : null}
            {showSection === 'addressform' ? renderAddressForm() : null}
        </section>
    );
}

export default CreateOrderPanel;