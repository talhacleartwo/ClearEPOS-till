import '../../Setup.css'

function Setup()
{
    return (
        <div id="Setup">
            <div className="setupContainer">
                <h2 className="brandLogo">Clear EPOS</h2>
                <h4 className="subtitle">Application Setup</h4>
                <form onSubmit={completeSetup}>
                    <div className="form-group">
                        <label>Application Source URI</label>
                        <input type="url" name="appsource" required/>
                    </div>
                    <div className="form-group">
                        <label>Create Device?</label>
                        <label className="switch">
                            <input type="checkbox" name="createDevice" value="1"/>
                            <span className="slider"></span>
                        </label>
                    </div>
                </form>
            </div>
        </div>
    );
}

function completeSetup()
{

}

export default Setup;