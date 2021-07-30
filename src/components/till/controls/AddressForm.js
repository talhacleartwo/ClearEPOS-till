function AddressForm(props){
    function SubmitForm(e){
        e = e || window.event;
        e.preventDefault();
        var data = {
            'name' : e.target.name.value,
            'line1' : e.target.line1.value,
            'line2' : e.target.line2.value,
            'postalcode' : e.target.postalcode.value,
            'city' : e.target.city.value,
            'country' : e.target.country.value
        };
        props.form_submit(data);
    }
    return (

        <div>

            <form onSubmit={() => SubmitForm(this)}>

                <label>Name</label>
                <input type="text" name="name" autoComplete="off" /><br/>

                <label>Line1</label>
                <input type="text" name="line1" autoComplete="off"/><br/>

                <label>line2</label>
                <input type="text" name="line2" autoComplete="off"/><br/>

                <label>PostalCode</label>
                <input type="text" name="postalcode" autoComplete="off"/><br/>

                <label>City</label>
                <input type="text" name="city" autoComplete="off"/><br/>

                <label>Country</label>
                <input type="text" name="country" autoComplete="off"/><br/>

                <center><input style={{width : 100}} type="submit" value="Submit" className="btn btn-success"/></center>


            </form>

        </div>

    );
}

export default AddressForm;