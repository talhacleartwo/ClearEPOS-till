export default function NotesTab(props)
{
    function send_note(e){
        e =e ||  window.event;
        var target = e.target || e.srcElement;
        props.set_notes(target.value);
    }
    return(
        <div className="section notes">
            <div className="formGroup">
                <label>Kitchen Notes</label>
                <textarea onChange={()=>send_note(this)}>{props.note}</textarea>
            </div>
            <div className="formGroup">
                <label>Delivery Notes</label>
                <textarea></textarea>
            </div>
            {
              /*  getAllergens().map((flag)=>(
                    <div key={flag.id} className="flag">
                        <span className="name">{flag.name}</span>
                    </div>
                ))*/
            }
        </div>
    );
}