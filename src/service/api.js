import Component from 'react';

import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import React from 'react';




class Api extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    createOrder(orderData)
    {
        var mutation = gql`
            mutation{
                
            }
        `;
    }

    getTestOrderData()
    {
        client
        .query({
            query: gql`
            query orders {
                id
            }
            `
        })
        .then(result => console.log(result));
    }
}

export default Api;