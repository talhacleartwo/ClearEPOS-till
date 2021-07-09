export function calculateItemTotal(item)
{
    var total = item.product.price;

    for(var option of item.itemmeta.options)
    {
        if(option.upgradedTo)
        {
            total += option.upgradedTo.price;
        }
    }

    for(var extra of item.itemmeta.extras)
    {
        total += extra.price;
    }

    return total;
}

export function calculateOrderTotal(items)
{
    var total =0;
    for(var item of items)
    {
        total+= calculateItemTotal(item);
    }
    return total;
}