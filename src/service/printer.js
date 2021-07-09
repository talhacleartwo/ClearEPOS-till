import {PrettyPrintOrderType} from '../components/till/ui/DisplayUtility';
import {DateTimeToHumanTime} from '../components/till/ui/DateTimeUtils';
import * as _itemEditUtils from '../service/itemEditUtils';

const PRINTER_IP = "192.168.1.55";
const PRINTER_ID = "local_printer";
const PRINTER_TO = "10000";

const NL = "\n";
const PPOS = 425;
const INDENT = "   ";

export function PrintReceipt(order)
{
    var builder = new window.epson.ePOSBuilder();
    builder.addLayout(builder.LAYOUT_RECEIPT);

    getHeader(builder,order);
    getBody(builder,order);
    getFooter(builder,order);

    //Print
    builder.addCut(builder.CUT_FEED);

    var url = 'https://' + PRINTER_IP + '/cgi-bin/epos/service.cgi?devid=' + PRINTER_ID + '&timeout=' + PRINTER_TO;
    var epos = new window.epson.ePOSPrint(url);
    
    epos.onreceive = function (res) {
        //When the printing is not successful, display a message
        if (!res.success) {
            window.alert('A print error occurred');
        }
    }
		
	epos.send(builder.toString());
}

function getHeader(builder, order)
{
    builder.addTextAlign(builder.ALIGN_CENTER);
    builder.addTextSize(2, 2);
	builder.addTextFont(builder.FONT_A);

    builder.addText(PrettyPrintOrderType(order.type) + NL);
    builder.addText("Placed: " + DateTimeToHumanTime(order.created_at) + NL);

    builder.addText("#" + order.ordernumber + NL + NL);

}

function getBody(builder, order)
{
    builder.addTextAlign(builder.ALIGN_LEFT);
    builder.addTextSmooth(true);
    builder.addTextFont(builder.FONT_A);
    builder.addTextSize(1, 1);
    //builder.addTextStyle(false, false, false, undefined);

    for(var item of order.line_items)
    {
        //Item
        builder.addTextAlign(builder.ALIGN_LEFT);
        builder.addTextStyle(false, false, true, undefined);
        if(item.product.product_group === null)
        {
            builder.addText(item.product.tillname);
        } 
        else
        {
            builder.addText(item.product.product_group.tillname + " - " + item.product.tillname)
            
        }
        //builder.addTextAlign(builder.ALIGN_RIGHT);
        builder.addTextPosition(PPOS);
        
        builder.addText(_itemEditUtils.calculateItemTotal(item).toFixed(2)); 
        builder.addTextStyle(false, false, false, undefined);
        builder.addText(NL);

        //Options
        if(item.itemmeta.options.length > 0)
        {
            for(var option of item.itemmeta.options)
            {
                if(option.isDefault !== true)
                {
                    if(option.upgradedTo)
                    {
                        builder.addTextAlign(builder.ALIGN_LEFT);
                        builder.addText(INDENT + "W\\ " + option.upgradedTo.name + " ("+option.upgradedTo.price.toFixed(2)+")");
                        builder.addText(NL);
                        //builder.addTextAlign(builder.ALIGN_RIGHT);
                        /*builder.addTextPosition(PPOS);
                        builder.addText(option.upgradedTo.price.toFixed(2));
                        builder.addText(NL);*/
                    }
                    else if(option.removed)
                    {
                        builder.addTextAlign(builder.ALIGN_LEFT);
                        builder.addText(INDENT + "NO: " + option.consumeName);
                        builder.addText(NL);
                    }
                    
                }
            }
        }
        
        //Extras
        if(item.itemmeta.extras.length > 0){ 
            for(var extra of item.itemmeta.extras)
            {
                builder.addTextAlign(builder.ALIGN_LEFT);
                builder.addText(INDENT + "+ " + extra.name + " (" + extra.price.toFixed(2) + ")");
                builder.addText(NL);
                //builder.addTextAlign(builder.ALIGN_RIGHT);
                /*builder.addTextPosition(PPOS);
                builder.addText(extra.price.toFixed(2));
                builder.addText(NL);*/
            }
        }

        builder.addText(NL);
    }
}

function getFooter(builder, order)
{
    builder.addTextPosition(PPOS);
    builder.addText("------");
    builder.addText(NL);

    builder.addTextStyle(false, false, true, undefined);
    builder.addText("Total Due");
    builder.addTextPosition(PPOS);
    builder.addText(_itemEditUtils.calculateOrderTotal(order.line_items).toFixed(2));
    builder.addText(NL);


    if(order.type === "delivery")
    {
        builder.addTextAlign(builder.ALIGN_CENTER);
        builder.addTextSize(2, 2);
        builder.addText("---------------------");
        builder.addText(NL);
        builder.addText(order.paymentstatus.toUpperCase() + NL);
        builder.addText("---------------------");
        builder.addText(NL);
        builder.addTextAlign(builder.ALIGN_LEFT);
        builder.addTextStyle(false, false, true, undefined);
        builder.addTextSize(1, 1);
        builder.addText("Customer Details");
        builder.addText(NL);
        builder.addTextStyle(false, false, false, undefined);

        builder.addTextSize(2, 2);
        builder.addText(order.customer.firstname + " " + order.customer.lastname + NL);
        builder.addText("Tel: " + order.customer.mobilephone + NL);
        builder.addText(NL);
        builder.addText(order.address.line1 + NL);
        builder.addText(order.address.line2 + NL);
        builder.addText(order.address.city + NL);
        builder.addText(order.address.county + NL);
        builder.addText(order.address.postalcode + NL);
        
    }
}