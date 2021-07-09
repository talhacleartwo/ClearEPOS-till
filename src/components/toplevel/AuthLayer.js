import * as _clientHandler from '../../service/clientHandler';
import {useCurrentUser} from '../../contexts/UserContext';

//Apollo
import { ApolloProvider, ApolloClient, InMemoryCache} from '@apollo/client';

function AuthLayer(props)
{
    const currentUser = useCurrentUser();

    //Initalise with no auth
    const client = new ApolloClient({
        link: _clientHandler.getLink(currentUser),
        cache: new InMemoryCache()
    });
    
    return (
        <ApolloProvider client={client}>
            {props.children}
        </ApolloProvider>
    );
}

export default AuthLayer;