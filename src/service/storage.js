const LOCAL_CONFIG_KEY = "appConfig";
const CATALOG_CACHE_KEY = "catalogCache";
const DEVICES_CACHE_KEY = "deviceCache";

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


/* Catalog Cache */
export function hasDevicesCache()
{
    return (localStorage.getItem(DEVICES_CACHE_KEY) === null ? false : true);
}
export function setDevicesCache(deviceData)
{
    localStorage.setItem(DEVICES_CACHE_KEY,JSON.stringify(deviceData));
}
export function deleteDevicesCache()
{
    localStorage.removeItem(DEVICES_CACHE_KEY);
}
export function hasCatalogCache()
{
    return (localStorage.getItem(CATALOG_CACHE_KEY) === null ? false : true);
}
export function setCatalogCache(catalog)
{
    localStorage.setItem(CATALOG_CACHE_KEY,JSON.stringify(catalog));
}
export function deleteCatalogCache()
{
    localStorage.removeItem(CATALOG_CACHE_KEY);
}
export function getCatalogProduct(productId)
{
    var catalog = JSON.parse(localStorage.getItem(CATALOG_CACHE_KEY));
    return catalog.products.filter((product) => {return product.id === productId})[0];
}
export function getDeviceBrands()
{
    return JSON.parse(localStorage.getItem(LOCAL_CONFIG_KEY)).brands;
}
export function getCategoryList()
{
    var catalog = JSON.parse(localStorage.getItem(CATALOG_CACHE_KEY));
    return catalog.productCategories;
}
export function getProductsOrGroupsInCategory(categoryId)
{
    var catalog = JSON.parse(localStorage.getItem(CATALOG_CACHE_KEY));
    var ret = {products:[],groups:[]};

    ret.products = catalog.products.filter((product) => {
        return (product.product_categories.find(category => category.id === categoryId) !== undefined)
    });

    ret.groups = catalog.productGroups.filter((group) => {
        return (group.product_categories.find(category => category.id === categoryId) !== undefined)
    });

    return ret;
}






/* App Configuration */
export function appConfigured() {
    return (localStorage.getItem(LOCAL_CONFIG_KEY) === null ? false : true);
}
export function setInitialConfig(initConfig)
{
    localStorage.setItem(LOCAL_CONFIG_KEY, JSON.stringify(initConfig));
}
export function getInitialConfig()
{
    return localStorage.getItem(LOCAL_CONFIG_KEY);
}
export function removeInitialConfig()
{
    localStorage.removeItem(LOCAL_CONFIG_KEY);
}



/* User Data */
export function getUser()
{
    var u = sessionStorage.getItem('user');
    if(!u){return false;}
    
    return JSON.parse(u);
}

export function setUser(user)
{
    sessionStorage.setItem('user', JSON.stringify(user));
}