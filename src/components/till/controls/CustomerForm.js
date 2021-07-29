function CustomerForm(props){
    function SubmitForm(e){
        e = e || window.event;
        e.preventDefault();
        var data = {
            'fname' : e.target.fname.value,
            'lname' : e.target.lname.value,
            'email' : e.target.email.value,
            'date' : e.target.date.value,
            'phone' : e.target.phone.value
        };
        props.form_submit(data);
    }
    return (

        <div>

            <form onSubmit={() => SubmitForm(this)}>

                <label>First Name</label>
                <input type="text" name="fname" /><br/>

                <label>Last Name</label>
                <input type="text" name="lname"/><br/>

                <label>Email</label>
                <input type="email" name="email"/><br/>

                <label>MobilePhone</label>
                <input type="text" name="phone"/><br/>

                <label>Birthdate</label>
                <input type="date" name="date"/><br/>

                <input type="submit" value="Submit" className="btn btn-success"/>


            </form>

        </div>

    );
}

export default CustomerForm;