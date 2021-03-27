const LOCAL_CONFIG_KEY = "appConfig";
//const LOCAL_DATA_KEY = "appData";

/*const fetchTodos = async () => {

    const url = 'https://jsonplaceholder.typicode.com/todos';

    return await axios.get(url)
        .then(res => {
            const result = res.data;
            if (result && result.length !== 0) {
                return result.slice(0, 10);
            }
            return [];
        }).catch(error => {
            console.error(error);
            return [];
        });
};*/

export function appConfigured() {
    return (localStorage.getItem(LOCAL_CONFIG_KEY) === null ? false : true);
}

