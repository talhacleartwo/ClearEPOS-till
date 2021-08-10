import styles from '../../Setup.module.css'
import {gql, useLazyQuery, useQuery} from '@apollo/client'
import {useState} from 'react'
import Select from 'react-select'
import * as _storage from "../../service/storage";
var QRCode = require('qrcode.react');

const BRAND_QUERY= gql`
    query
    {
        brands
        {
            id,
            name
        }
    }
`;

const DEVICE_QUERY = gql`
    query CheckDevice($code: String!)
    {
        devices(where:{identifier:$code})
        {
            id,
            name,
            site{
                id,
                name,
                deliverytime,
                collectiontime
            },
            type
        }
    }
`;

const newCode = makeid(10);

//const SITE_QUERY = gql``;

function makeid(length) {
    var result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
   return result.join('');
}

function Setup()
{
    const {loading, error, data} = useQuery(BRAND_QUERY);
    
    const [step,setStep] = useState(1);
    const [config,setConfig] = useState({allowedAccess:false,mode:undefined,brands:[],multiBrand: false});
    const [useExistingCode,setUseExistingCode] = useState(false);
    const [existingCode,setExistingCode] = useState("");

    const [checkDevice, { loading:loadingDevice, data:deviceData }] = useLazyQuery(DEVICE_QUERY, {
        variables: {code:(useExistingCode ? existingCode : newCode)},
        onCompleted:(data) => {
            console.log(data.devices);
        }
    })

    if(loading){return 'Loading Setup..';}
    if(error){return 'Something went wrong while loading setup..';}

    if(loadingDevice)
    {
        return ("Checking Device..");
    }

    if(deviceData && config.allowedAccess === false && deviceData.devices.length === 1)
    {
        var newConfig = {...config};

        newConfig.deviceConfig = deviceData.devices[0];
        newConfig.allowedAccess = true;
        setConfig(newConfig);
       
    }

    function setConfigVar(event)
    {
        var newConfig = {...config}

        var targetprop = event.target.dataset.prop;
        var val = event.target.value;

        if(targetprop === "brands")
        {
            val = [];
            for(let x=0;x<event.target.selectedOptions.length;x++)
            {
                val.push(event.target.selectedOptions[x].value);
            }
            
            newConfig.multiBrand = (val.length > 1);
        }
        
        newConfig[targetprop] = val;
        setConfig(newConfig);
    }

    const options = [
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' }
    ]

    function completeSetup()
    {
        _storage.setInitialConfig(config);
        window.location.reload();
    }

    function renderStep()
    {
        console.log(config);
        console.log(step);
        console.log(existingCode);
        var retStep;
        switch(step)
        {
            case 1 :
                retStep = (
                    <div className={styles.step}>
                        <div className={styles.formgroup}>
                            <label className={styles.formgroup_label}>Allow Device Access</label>
                            <div style={{margin:"1em 0"}}>
                                <div className={config.allowedAccess ? styles.deviceAccessIcon : styles.deviceAccessIconDenied}>
                                    <i className={config.allowedAccess ? "icon-tick" : "icon-minus"}></i>
                                </div>
                                <div className={styles.accessText}>{config.allowedAccess ? "Access Granted" : "Access Denied"}</div>
                            </div>

                                <div className="methodSelector">
                                    <label>Use Existing Code?</label>
                                    <label className="switch">
                                        <input type="checkbox" checked={useExistingCode} onChange={(e)=>{setUseExistingCode(e.target.checked)}}/>
                                        <span className="slider"></span>
                                    </label>
                                </div>
                                {
                                    useExistingCode === true ? 
                                    (
                                        <div style={{marginBottom:".5em"}}>
                                            <label>Enter your code:</label>
                                            <input type="text" value={existingCode} onChange={(e)=>{setExistingCode(e.target.value)}}/>
                                        </div>
                                    ) 
                                    :
                                    (
                                        <div style={{marginBottom:".5em"}}>
                                            <div style={{marginBottom:".5em"}}>Your Code:</div>
                                            <QRCode value={newCode} />,
                                        </div>
                                    )
                                }
                            
                            <button className="btn btn-info" onClick={checkDevice}>Check Again</button>
                        </div>
                        {
                            config.allowedAccess ? (
                                <div className="nav buttonBar">
                                    <button className="btn btn-danger" disabled>Back</button>
                                    <button className="btn btn-success" onClick={()=>{setStep(2)}}>Next</button>
                                </div>
                            )
                            : null
                        }     
                    </div>
                );
            break;
            case 2 :
                retStep = (
                    <div className={styles.step}>
                        <div className={styles.formgroup}>
                            <label className={styles.formgroup_label}>Device Mode</label>
                            <select className={styles.formcontrol_select} data-prop="mode" onChange={setConfigVar} value={config.mode}>
                                <option value="EPOS">EPOS</option>
                                <option value="SCREEN">Screen</option>
                            </select>
                        </div>
                        <div className="nav buttonBar">
                            <button className="btn btn-danger" onClick={()=>{setStep(1)}}>Back</button>
                            <button className="btn btn-success" onClick={()=>{setStep(3)}}>Next</button>
                        </div>
                    </div>
                );
            break;
            case 3 :
                retStep = (
                    <div className={styles.step}>
                        <div className={styles.formgroup}>
                            <label className={styles.formgroup_label}>Select Brands</label>
                            <select className={styles.formcontrol_select} data-prop="brands" onChange={setConfigVar} value={config.brands} multiple>
                                {
                                    data.brands.map((brand)=>(
                                        <option key={brand.id} value={brand.id}>{brand.name}</option>
                                    ))
                                }
                            </select>



                            {/*<Select options={options} style={{color : 'white'}} />*/}
                        </div>
                        <div className="nav buttonBar">
                            <button className="btn btn-danger" onClick={()=>{setStep(2)}}>Back</button>
                            <button className="btn btn-success" onClick={completeSetup}>Finish</button>
                        </div>
                    </div>
                );
            break;
            default:
                setStep(1);
            break;
        }

        return retStep;
    }

    return (
        <div className={styles.Setup}>
            <div className="setupContainer">
                <h2 className="brandLogo" style={{margin:0}}>Clear EPOS</h2>
                <h4 className={styles.subtitle}>Application Setup</h4>
                {
                    renderStep()
                }
                <style>
                    {"html, body, #root{margin:0;height:100%;}"}
                </style>
            </div>
        </div>
    );
}

export default Setup;