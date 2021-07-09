//require('dotenv').config()

//import './App.css';
import * as _storage from './service/storage';
//import * as _clientHandler from './service/clientHandler';
import Setup from './components/toplevel/Setup';
import Till from './components/toplevel/Till';

//Contexts
import UserContextProvider from './contexts/UserContext';
import OrderContextProvider from './contexts/OrderContext';
//import {useCurrentUser} from './contexts/UserContext';

//Apollo
//import { ApolloProvider, createHttpLink, ApolloClient, InMemoryCache} from '@apollo/client';
//import { setContext } from '@apollo/client/link/context';
import AuthLayer from './components/toplevel/AuthLayer';

/*const httpLink = createHttpLink({
  uri: "http://192.168.1.70:1337/graphql",
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = _storage.getUser('user').token;
  if(!token)
  {
    //Dont add the auth token header
    return {
      headers: {
        ...headers
      }
    }
  }
  else
  {
    //TEMP hardcoded token for till user
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjAsImlhdCI6MTYxNjcwNDU4NiwiZXhwIjoxNjE5Mjk2NTg2fQ.nnR2EOxOfwiG5V-mwL4FW4j6gaGcFUTlTxc0joz0nAk";
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      }
    }
  }
  
});*/






function App() {
 // const currentUser = useCurrentUser();

  //Initalise with no auth
  /*const client = new ApolloClient({
    link: _clientHandler.getLink(currentUser),
    cache: new InMemoryCache()
  });*/

  //Use Current User Context
  //const currentUser = useCurrentUser();

  //Check if application has been configured
  if(!_storage.appConfigured())
  {
    return (
      <UserContextProvider>
        <AuthLayer>
          <Setup/>
        </AuthLayer>
      </UserContextProvider>
    );
  }
  

  return(
    <UserContextProvider>
      <AuthLayer>
        <OrderContextProvider>
          <Till/>
        </OrderContextProvider>
      </AuthLayer>
    </UserContextProvider>
  );

  //Initialise the Till
 /* return (
    <UserContextProvider>
    <ApolloProvider client={client}>
      
        <OrderContextProvider>
          <Till/>
        </OrderContextProvider>
     
    </ApolloProvider>
    </UserContextProvider>
  );*/

}

export default App;
