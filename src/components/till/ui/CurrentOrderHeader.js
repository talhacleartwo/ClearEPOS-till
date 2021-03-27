
export default function CurrentOrderHeader()
{
    return(
        <header className="orderHeader">
            <div className="brandLogoPlaceholder f_left">Brand</div>
            <div className="orderDetails f_left">
                <div className="orderNumber">Order #1334</div>
                <div className="customerName">John Smith</div>
            </div>
            <div className="f_right">
                <div className="btn btn-icon btn-info">E</div>
            </div>
        </header>
    );
}