import styles from "../../../../Setup.module.css";

export default function LoadCache(props){
    return (
        <div  className={styles.Setup} style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
            <div style={{width : '30%' , backgroundColor : 'white' , border : "1px solid white"}}>
                <div style={{display: 'flex', alignItems:'center' , backgroundColor : "#172345"}}>
                    <h4 style={{marginLeft : 10 , marginTop : 10 , color : 'white'}}>
                        {(props.cache == "catalog") ? "Load Catalog Cache" : "Load Devices Cache"}
                    </h4>
                </div>
                <div style={{display: 'flex',  justifyContent:'center', alignItems:'center' , color : '#172345'}}>
                    <button className="btn btn-primary" style={{backgroundColor : "#172345" , color : "white" , marginTop : 40 , marginBottom : 40}} onClick={() => props.fetchCatalog()}>Load Cache</button>
                </div>
            </div>
        </div>
    );
}