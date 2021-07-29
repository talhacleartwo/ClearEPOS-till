import { useQuery, gql } from '@apollo/client';
import {NoDataToDisplay} from '../ui/DisplayUtility';

const Fetch_CUSTOMERS = gql`
    query {
        customers
        {
            id,
            firstname,
            lastname
        }
    }
`;

function CustomersResults(props)
{
    //Query
    const { loading, error, data,refetch  } = useQuery(Fetch_CUSTOMERS,{
        fetchPolicy: "network-only"
    });
    if (loading || !data) return null;
    if (error) return `Error! ${error}`;

    if(data.customers.length === 0)
    {
        return (NoDataToDisplay("No Customer to show"));
    }

    return (

        <div>
            <button className="btn btn-success f_right" onClick={() => props.CustomerForm()}>New Customer</button>
            {data.customers.map((customer, index) =>
                <div className="staffMini" key={customer.id} onClick={() => props.renderaddress(customer.id)}>
                    <div className="staff" data-staffmember={JSON.stringify(customer)}>
                        <div className="staffIcon"><i className="icon-person"></i></div>
                        <div className="content">
                            <div className="name" key={index}>{customer.firstname} {customer.lastname} </div>
                        </div>
                    </div>
                </div>
            )}
        </div>

    );
}
export default CustomersResults;