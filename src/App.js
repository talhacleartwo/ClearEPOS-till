//import './App.css';
import * as _storage from './service/storage';
import Setup from './components/toplevel/Setup';
import Till from './components/toplevel/Till';

//Contexts
import UserContextProvider from './contexts/UserContext';
import OrderContextProvider from './contexts/OrderContext';

//Apollo
import { ApolloProvider, createHttpLink, ApolloClient, InMemoryCache} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'http://81.134.26.100:1337/graphql',
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  //const token = localStorage.getItem('token');
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjAsImlhdCI6MTYxNjcwNDU4NiwiZXhwIjoxNjE5Mjk2NTg2fQ.nnR2EOxOfwiG5V-mwL4FW4j6gaGcFUTlTxc0joz0nAk";
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});


function App() {

  //Use Current User Context
  //const currentUser = useCurrentUser();

  //Check if application has been configured
  if(_storage.appConfigured())
  {
    return (
      <ApolloProvider client={client}>
        <Setup/>
      </ApolloProvider>
    );
  }
  
  //Initialise the Till
  return (
    <ApolloProvider client={client}>
      <UserContextProvider>
        <OrderContextProvider>
          <Till/>
        </OrderContextProvider>
      </UserContextProvider>
    </ApolloProvider>
  );

}

export default App;
