export function NoDataToDisplay(message, classes = [])
{
    function getClasses(clss)
    {
        return "nothingToDisplay " + clss.forEach((c)=>{return c;});
    }
    return(
        <div className={getClasses(classes)}>
            <div>{message}</div>
        </div>
    );
}

export function LoadingData(message = "Loading..", spinner = true)
{
    return (
        <div className="loadingData">
            <div>
                {spinner ? <div className="Spinner"></div> : null}
                <div className="Message">{message}</div>
            </div>
        </div>
    );
}