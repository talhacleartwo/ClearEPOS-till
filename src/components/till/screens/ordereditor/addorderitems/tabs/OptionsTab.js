export default function OptionsTab(props)
{

    //Ensure that option data is populated
    /*if(props.productData.itemmeta.options.length === 0)
        {
            //Set default options
            var newOpts = [];
            for(var oconsume of props.consumes)
            {
                newOpts.push({
                    consumeId : oconsume.id,
                    isDefault: true,
                });
            }

            var data = {...props.productData};
            data.itemmeta.options = newOpts;
            props.updateProductData(data);
        }*/


    function optionSelected(consumeObj, alternativeObj)
    {
        //Doesnt work when editing existing item because ites read-only : var data = {...props.existingItem};
        var data = JSON.parse(JSON.stringify(props.existingItem));
        
        //Find the options current config
        var theOpt = data.itemmeta.options.find(({ consumeId }) => consumeId === consumeObj.id);
        var index = data.itemmeta.options.indexOf(theOpt);

        //Reset Option
        theOpt = {
            consumeId : consumeObj.id,
            consumeName : consumeObj.name
        };

        switch(alternativeObj)
        {
            case "removed":  //Option has been removed (None)
                theOpt.removed = true;
            break;
            case "isDefault": //Option is left as the Default Ingredient
                theOpt.isDefault = true;
            break;
            default: //Has been upgraded
                theOpt.upgradedTo = alternativeObj;
            break;
        }

        //replace original option data with new option data
        data.itemmeta.options[index] = theOpt;

        props.updateExistingItem(data);



        /*var data = {...props.productData};
        data.itemmeta.options[consumeId] = alternativeId;

        props.updateProductData(data);*/
    }

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
            return classN;
        }
    }

    function getUpgrades()
    {
        
        //Before rendering, check if there are no options set in itemmeta,
        //This cant happen becuase if a product has options, we must delect the defaults
        /*if(props.productData.itemmeta.options.length === 0)
        {
            //Set default options
            var newOpts = [];
            for(var oconsume of props.consumes)
            {
                newOpts.push({
                    consumeId : oconsume.id,
                    isDefault: true,
                });
            }

            var data = {...props.productData};
            data.itemmeta.options = newOpts;
            props.updateProductData(data);
        }*/



        var upgradables = [];
        for(var consume of props.productModel.consumes)
        {
            if(consume.alternatives.length > 0 || consume.configurable)
            {
                upgradables.push(consume);
                
            }
        }

       return upgradables.map((consume)=>(
        <div key={consume.id} className="upgrade">
            <div className="consume">
                {consume.configurable === true ? <span className={"option none " + isOptionSelected(consume, 'removed')} onClick={()=>{optionSelected(consume, 'removed')}}>None</span> : null}
                <span className={"option " + isOptionSelected(consume, 'isDefault')} onClick={()=>{optionSelected(consume, 'isDefault')}}>{consume.name}</span> 
            </div>
            {
                consume.alternatives.map((alternative)=>(
                    <div className="alternative" key={alternative.id}>
                        <i className="icon-next"></i> 
                        <span className={"option " + isOptionSelected(consume, alternative)} onClick={()=>{optionSelected(consume, alternative)}}>{alternative.name} + £{alternative.price.toFixed(2)}</span> 
                        
                    </div>
                ))
            }
        </div>
       ))
    }

    return(
        <div className="section extras">
            {getUpgrades()}
        </div>
    );
}