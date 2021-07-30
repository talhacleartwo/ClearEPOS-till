import { useQuery, gql } from '@apollo/client';

const CUSTOMER_ADDRESS_SEARCH = gql`
query SearchCustomers($telsearch: String!)
    {customers(where:{mobilephone_contains:$telsearch})
    {
        id,
        firstname,
        lastname,
        mobilephone,
        addresses
        {
            id,
            name,
            line1,
            line2,
            city,
            county,
            postalcode
        }
    }
}
`;

const CUSTOMER_SEARCH = gql`
query SearchCustomers($telsearch: String!)
    {customers(where:{mobilephone_contains:$telsearch})
    {
        id,
        firstname,
        lastname,
        mobilephone
    }
}
`;


function CustomerSearchResults(props)
{
    //Determine which query to use
    var queryToUse = CUSTOMER_ADDRESS_SEARCH;
    if(props.customerOnly)
    {queryToUse = CUSTOMER_SEARCH;}

    //Query
    const { loading, error, data } = useQuery(queryToUse,{
        variables: {telsearch : props.search},
        fetchPolicy: "network-only"
    });
    if (loading) return null;
    if (error) return `Error! ${error}`;

    function getCustomerUpdateFunction()
    {
        return props.customerOnly ? props.updateFunction : null;
    }

    // console.log(data.customers);return false;
    return data.customers.map((customer) => (
        <div style={{marginTop : 30}} className="customerMini" key={customer.id} >
            <div className="customer" data-customer={JSON.stringify(customer)} onClick={getCustomerUpdateFunction()}>
                <div className="customerIcon"><i className="icon-person"></i></div>
                <div className="content">
                    <div className="name">{customer.firstname} {customer.lastname} </div>
                    <div className="phone">{customer.mobilephone}</div>
                </div>
            </div>
            {
                !props.customerOnly ? (
                <div className="addresses">
                    <button className="btn btn-success f_right" onClick={() => props.AddressForm(customer.id)}>New Address</button><br/>
                    {
                        customer.addresses.map((address) => (
                            <div style={{marginTop : 20}} className="address" key={address.id} data-customer={JSON.stringify(customer)} data-value={JSON.stringify(address)} onClick={props.updateFunction}>
                                <div className="addressIcon"><i className="icon-location"></i></div>
                                <div className="content">
                                    {address.name} | {address.postalcode}
                                </div>
                            </div>
                        ))
                    }
                </div>)
                : null
            }
        </div>
    ));
}

export default CustomerSearchResults;