import {useState} from 'react';

import CategorySelector from './addorderitems/CategorySelector';
import ProductSelector from './addorderitems/ProductSelector';
import ProductEditor from './addorderitems/ProductEditor';
import OrderReceipt from './orderreceipt/OrderReceipt';

function OrderEditor()
{
    const [currentCategory,setCurrentCategory] = useState(null);
    const [currentProduct,setCurrentProduct] = useState(null);

    return(
        <>
            <section id="AddOrderItems" className="panel sixty">
                {
                    currentProduct === null ? 
                    (
                        <>
                            <CategorySelector current={currentCategory} update={setCurrentCategory}/>
                            {currentCategory !== null ? <ProductSelector category={currentCategory} update={setCurrentProduct}/> : null}
                        </>
                    )
                    :
                    (
                        <ProductEditor entity={currentProduct}/>
                    )
                }
            </section>
            <section id="OrderReceipt" className="panel forty">
                <OrderReceipt/>
            </section>
        </>
    );
}

export default OrderEditor;