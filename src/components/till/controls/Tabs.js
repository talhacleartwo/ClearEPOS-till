import {useState} from 'react';

function Tabs(props)
{
    const [currentTab,setCurrentTab] = useState(props.startTab);

    function changeTab(event)
    {
        setCurrentTab(event.target.dataset.tabid);
    }

    //Bind event to all tab headers
    
    function getTabHeaderClasses(header)
    {
        return "tabHeader" + (header.key === currentTab ? " active" : "");
    }

    return (
        <div className="Tabs">
            <div className="tabs_header">
                {
                    props.tabHeaders.map((header) => (
                        <div key={header.key} className={getTabHeaderClasses(header)} onClick={changeTab} data-tabid={header.key}>
                            <i className={'icon-' + header.icon}></i>
                            <span className="text">{header.title}</span>
                        </div>
                    ))
                }
            </div>
            <div className="tabs_bodys">
                {props.tabBodys.filter((tab) => { return tab.key === currentTab})}
            </div>
        </div>
    );
}

export default Tabs;