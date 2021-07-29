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
                <div className="staffMini" key={address.id}>
                    <div className="staff" data-staffmember={JSON.stringify(address)}>
                        <div className="staffIcon"><i className="icon-person"></i></div>
                        <div className="content">
                            <div className="name" key={index}>{address.name} {address.line1} </div>
                        </div>
                    </div>
                </div>
            )}
        </div>

    );
}
export default AddressesResults;