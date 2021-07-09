export default function AllergensTab(props)
{

    function isOptionSelected(consumeObj, alternativeObj)
    {
        //Find the option
        var theOpt = props.existingItem.itemmeta.options.find(({ consumeId }) => consumeId === consumeObj.id);

        //Preference for this consume hasnt been selected,set it as the default ingredient
        if(!theOpt && alternativeObj === 'isDefault')
        {
            theOpt = {
                consumeId : consumeObj.id,
                isDefault : true
            };
        }
        else
        {
            var classN ="";
            if(theOpt.removed && alternativeObj === 'removed'){classN= 'selected'}
            else if(theOpt.isDefault && alternativeObj === 'isDefault'){classN= 'selected'}
            else if((theOpt.upgradedTo) && theOpt.upgradedTo.id === alternativeObj.id){classN= 'selected'}
            return (classN === 'selected' ? true : false);
        }
    }

    function isExtraSelected(extraObj)
    {
        if(props.existingItem.itemmeta.extras.find(({ id }) => id === extraObj.id)){return 'selected';}
        return '';
    }

    

    function getAllergens()
    {
        var allergens = [];

        //Get option allergens first
        for(var consume of props.productModel.consumes)
        {
            if(isOptionSelected(consume, 'isDefault'))
            {
                //Use Default Ingredient
                if(consume.defaultingredient.flags.length >0){
                    allergens.push(...consume.defaultingredient.flags);
                    /*consume.defaultingredient.flags.forEach(element => {
                        allergens.push(element);
                    });*/
                }
            }
            else
            {
                for(var alternative of consume.alternatives)
                {
                    if(isOptionSelected(consume, alternative))
                    {
                        if(alternative.ingredient.flags.length >0){
                            allergens.push(...alternative.ingredient.flags);
                            /*alternative.ingredient.flags.forEach(element => {
                                allergens.push(element);
                            });*/
                        }
                    }
                }
            }
        }

        //Get Extra Allergens
        for(var extra of props.productModel.extras)
        {
            if(isExtraSelected(extra))
            {
                for(var econsume of extra.consumes)
                {
                    if(econsume.defaultingredient.flags.length > 0){
                        allergens.push(...econsume.defaultingredient.flags);
                        /*econsume.defaultingredient.flags.forEach((element => {
                            allergens.push(element);
                        }));*/
                    }
                }
            }
        }

        //Remove Duplicate allergens
        var usedIds = [];
        allergens = allergens.filter(function( obj ) {
            if(usedIds.indexOf(obj.id) === -1)
            {
                usedIds.push(obj.id);
                return true;
            }
            return false;
        });
        //console.log(allergens);
        return allergens;
    }

    return(
        <div className="section allergens">
            {
                getAllergens().map((flag)=>(
                    <div key={flag.id} className="flag">
                        <span className="name">{flag.name}</span>
                    </div>
                ))
            }
        </div>
    );
}