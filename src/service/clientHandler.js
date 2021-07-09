import {createHttpLink} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const DS_URL = "https://ds-cleartwo.clearepos.com/graphql";

export function getLink(userContext = null)
{
    const httpLink = createHttpLink({
        uri: DS_URL,
    });

    if(userContext)
    {
        const authLink = setContext((_, { headers }) => {
            // return the headers to the context so httpLink can read them
            return {
                headers: {
                    ...headers,
                    authorization: `Bearer ${userContext.jwt}`,
                }
            }
    
        });

        return authLink.concat(httpLink);
    }

    return httpLink;
}


/*export function getNoAuthLink()
{
    const httpLink = createHttpLink({
        uri: DS_URL,
    });
    
    return httpLink;
}

export function getAuthLink(userJwt)
{
    const httpLink = createHttpLink({
        uri: DS_URL,
    });
    
    const authLink = setContext((_, { headers }) => {
        // return the headers to the context so httpLink can read them
        return {
            headers: {
                ...headers,
                authorization: `Bearer ${userJwt}`,
            }
        }

    });

    return authLink.concat(httpLink);
}*/