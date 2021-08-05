import * as _storage from "../../../service/storage";
import styles from "../../../Setup.module.css";

function UserSettings(props)
{

    function changeprintingdevice(event){
        event = event ||  window.event;
        props.changeSettings(event.target.value);
    }

    var devices_data = JSON.parse(localStorage.getItem('deviceCache'));
    var activePrinter = JSON.parse(localStorage.getItem('settingscache')).activePrinter;

    return (

        <div>

            <h4>Select Printer</h4>
            <div className="formGroup">
                <select className={styles.formcontrol_select} onChange={() => {changeprintingdevice(this)}} defaultValue={activePrinter}>
                    {
                        devices_data.map((device) => {
                            if(device.type === 'printer'){
                                return (
                                    <option value={device.id} key={device.id}>{device.name}</option>
                                );
                            }
                        })
                    }
                </select>
            </div>

        </div>

    );

}

export default UserSettings;