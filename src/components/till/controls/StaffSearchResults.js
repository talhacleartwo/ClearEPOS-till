import { useQuery, gql } from '@apollo/client';
import {NoDataToDisplay} from '../ui/DisplayUtility'

const STAFF_MEMBER_SEARCH = gql`
query SearchStaff
{
    staffMembers
    {
        id,
        firstname,
        lastname
    }
}
`;

function StaffSearchResults(props)
{
    //Query
    const { loading, error, data } = useQuery(STAFF_MEMBER_SEARCH,{
        
    });
    if (loading || !data) return null;
    if (error) return `Error! ${error}`;


    if(data.staffMembers.length === 0)
    {
        return (NoDataToDisplay("No Staff Members to show"));
    }

    return data.staffMembers.map((staff) => (
        <div className="staffMini" key={staff.id} >
            <div className="staff" data-staffmember={JSON.stringify(staff)} onClick={props.updateFunction}>
                <div className="staffIcon"><i className="icon-person"></i></div>
                <div className="content">
                    <div className="name">{staff.firstname} {staff.lastname} </div>
                </div>
            </div>
        </div>
    ));
}


export default StaffSearchResults;