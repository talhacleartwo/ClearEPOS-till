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
                <input type="text" name="fname" autoComplete="off" /><br/>

                <label>Last Name</label>
                <input type="text" name="lname" autoComplete="off"/><br/>

                <label>Email</label>
                <input type="email" name="email" autoComplete="off"/><br/>

                <label>MobilePhone</label>
                <input type="text" name="phone" autoComplete="off"/><br/>

                <label>Birthdate</label>
                <input type="date" name="date" autoComplete="off"/><br/>

                <input style={{width : 100}} type="submit" value="Submit" className="btn btn-success f_right"/>


            </form>

        </div>

    );
}

export default CustomerForm;