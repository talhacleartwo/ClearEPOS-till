import { useQuery, gql } from '@apollo/client';
import {NoDataToDisplay} from '../ui/DisplayUtility';

const Fetch_Addresses = gql`
    query cust($id : ID!){
        customer(id:$id)
        {
            addresses{
                id,
                name,
                line1,
                line2,
                city,
                county
            }
        }
    }
`;

function AddressesResults(props)
{

    //Query
    const { loading, error, data,refetch  } = useQuery(Fetch_Addresses,{
        variables:{id:props.cust_id},
        fetchPolicy: "network-only"
    });
    if (loading || !data) return null;
    if (error) return `Error! ${error}`;
    // console.log(data.customer.addresses);return false;
    if(data.customer.addresses.length === 0)
    {
        return (NoDataToDisplay("No Address to show"));
    }

    return (

        <div>
            {data.customer.addresses.map((address, index) =>
                <div className="addressmini" key={address.id}>
                    <div className="address" data-staffmember={JSON.stringify(address)}>
                        {/*<div className="staffIcon"><i className="icon-person"></i></div>*/}
                        <div className="content">
                            <div className="name" key={index}><h3>{address.name}</h3></div>
                            <p><b>Line1</b> : {address.line1}</p>
                            <p><b>Line2</b> : {address.line2}</p>
                            <p><b>City</b> : {address.city}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>

    );
}
export default AddressesResults;