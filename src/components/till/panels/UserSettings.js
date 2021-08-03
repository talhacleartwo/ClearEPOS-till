import * as _storage from "../../../service/storage";

function UserSettings(props)
{

    function changeprintingdevice(event){
        event = event ||  window.event;
        props.changeSettings(event.target.value);
    }

    var devices_data = JSON.parse(localStorage.getItem('deviceCache'));

    var devices = [];
    devices_data.map((device) => {
        if(device.type === 'printer'){
            devices.push(device);
        }
    });

    return (

        <div>

            <h4>Select Printer</h4>
            <div className="formGroup">
                <select className="" onChange={() => {changeprintingdevice(this)}}>
                    {
                        devices_data.map((device) => {
                            if(device.type === 'printer'){
                                return (
                                    <option value={device.id}>{device.name}</option>
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