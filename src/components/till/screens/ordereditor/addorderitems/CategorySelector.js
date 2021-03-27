//Utility
import {LoadingData} from '../../../ui/DisplayUtility';

import {gql, useQuery} from '@apollo/client';

const CATEGORY_QUERY = gql`
    query{
        productCategories(sort:"name:asc"){
            id,
            name
        }
    }
`;

export default function CategorySelector(props)
{
    const {loading, error, data} = useQuery(CATEGORY_QUERY);

    if(loading){
        return LoadingData();
    }
    if(error){
        return 'Error loading data';
    }

    function getClasses(myId)
    {
        return "productCategory" + (myId === props.current ? " selected" : "");
    }

    /*return(
        <div className="area categorySelector">
            {
                data.productCategories.map((category) => (
                    <div key={category.id} className={getClasses(category.id)} onClick={()=>props.update(category.id)}>
                        <div className="icon"></div>
                        <div className="name">{category.name}</div>
                    </div>
                ))
            }
        </div>
    );*/

    return(
        <div className="area categorySelector">
            {
                data.productCategories.map((category) => (
                    <div key={category.id} className={getClasses(category.id)} onClick={()=>props.update(category.id)}>
                        <div className="icon"></div>
                        <div className="name">{category.name}</div>
                    </div>
                ))
            }
        </div>
    );
    

}