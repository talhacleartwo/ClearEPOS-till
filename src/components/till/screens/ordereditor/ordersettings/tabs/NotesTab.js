export default function NotesTab(props)
{
    return(
        <div className="section notes">
            <div className="formGroup">
                <label>Kitchen Notes</label>
                <textarea></textarea>
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