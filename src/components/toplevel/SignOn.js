import React, {useState} from "react";
import {useLazyQuery, gql} from "@apollo/client";
import * as _storage from "../../service/storage";

import styles from '../../cssmodules/signon.module.css';

import {useUserUpdate} from '../../contexts/UserContext';

import {DEVICES_QUERY} from '../../service/queries';

import {deleteDevicesCache, setDevicesCache, setSettingsCache} from "../../service/storage";

const LOGIN_QUERY = gql`
query AttemptLogin($code: String!){
    attemptTillLogin(logindata:{code:$code})
    {
        result
        jwt,
        user
        {
            id,
            name,
            username,
            email,
            role
            {
                id,
                type
            },
            brands
            {
                id,
                name
            }
        }
    }
}`;
function SignOn()
{
    
    //Context for Users
    //const currentUser = useCurrentUser();
    const updateUser = useUserUpdate();

    //State for keypad
    const [currentCode, setCurrentCode] = useState("");
    const [submitForm, setSubmitForm] = useState(false);
    const [showDevOpts, setShowDevOpts] = useState(false);

    var codeToSubmit = submitForm ? currentCode : "";
    
    const [attemptLogin] = useLazyQuery(LOGIN_QUERY, {
        variables: {code:codeToSubmit},
        onCompleted: (data) =>{
            if(data.attemptTillLogin)
            {
                var loginResult = data.attemptTillLogin;
                if(loginResult.result)
                {
                    updateUser({jwt:loginResult.jwt, user: loginResult.user});
                    setSubmitForm(false);
                }
                else
                {
                    setSubmitForm(false);
                    setCurrentCode("");
                }
            }
        }
    })

    const [getDevices] = useLazyQuery(DEVICES_QUERY, {
        onCompleted: (data) =>{
            _storage.setDevicesCache(data.devices);
            for (let i = 0; i < data.devices.length; i++) {
                if(data.devices[i].type === 'printer'){
                    _storage.setSettingsCache({activePrinter : data.devices[i].id});
                    break;
                } else {
                    _storage.setSettingsCache({activePrinter : null});
                }
            }
            window.location.reload();
        }
    })
    

    function keyPress(key)
    {
        var val = key.target.dataset.value;
        var newVal = (val === "-" ? currentCode.substring(0, currentCode.length - 1) : currentCode + val);
        setCurrentCode(newVal);
    }

    function handleSubmit(event)
    {
        event.preventDefault();

        setSubmitForm(true);
        //Live
        attemptLogin();

        //Send API request / Update state so that we can send API request
        //TESTING  updateUser(1);
    }

    function changeDevOpts(o)
    {
        setShowDevOpts(o);
    }

    return(
        <div id="SignOn" className={styles.SignOn}>
            <h4>Enter Your Pin</h4>
            <div className={styles.SignOnCode}>
                <input type="password" className={styles.code} value={currentCode} readOnly/>
            </div>
            <div className={styles.keypadContainer}>
                <div className={styles.keyRow}>
                    <div onClick={keyPress} className={styles.key} data-value="1">1</div>
                    <div onClick={keyPress} className={styles.key} data-value="2">2</div>
                    <div onClick={keyPress} className={styles.key} data-value="3">3</div>
                </div>
                <div className={styles.keyRow}>
                    <div onClick={keyPress} className={styles.key} data-value="4">4</div>
                    <div onClick={keyPress} className={styles.key} data-value="5">5</div>
                    <div onClick={keyPress} className={styles.key} data-value="6">6</div>
                </div>
                <div className={styles.keyRow}>
                    <div onClick={keyPress} className={styles.key} data-value="7">7</div>
                    <div onClick={keyPress} className={styles.key} data-value="8">8</div>
                    <div onClick={keyPress} className={styles.key} data-value="9">9</div>
                </div>
                <div className={styles.keyRow}>
                    <div onClick={keyPress} className={styles.key} data-value="-">C</div>
                    <div onClick={keyPress} className={styles.key} data-value="0">0</div>
                    <div onClick={handleSubmit} className={styles.key}>G</div>
                </div>
            </div>
            <div id="DevOptions" className={"show-" + showDevOpts} onClick={()=>{setShowDevOpts(true)}}>
                {
                    showDevOpts ? (
                        <div className="DevOptionList">
                            <ul>
                                <li onClick={()=>{changeDevOpts(false)}}><i className="icon-prev"></i></li>
                                <li onClick={()=>{
                                    if(window.confirm("Are you sure you want to wipe device config?")){
                                        _storage.removeInitialConfig();window.location.reload();
                                    }
                                }}>Clear Device Config</li>
                                <li onClick={()=>{
                                    if(window.confirm("Are you sure you want to wipe the catalog cache?")){
                                        _storage.deleteCatalogCache();window.location.reload();
                                    }
                                }}>Clear Catalog Cache</li>
                                <li onClick={()=>{getDevices()}}>Refresh Device Cache</li>
                                <li onClick={()=>{
                                    _storage.deleteDevicesCache();window.location.reload();
                                }}>Clear Devices Cache</li>
                            </ul>
                        </div>
                    )
                    : null
                }
            </div>
        </div>
    );
}


export default SignOn;