import React, {useContext, useState} from "react";

const UserContext = React.createContext();
const UserUpdateContext = React.createContext();

//Custom Hook to allow anyone to ready the current user
export function useCurrentUser()
{
    return useContext(UserContext);
}

//Custom Hook to allow anyone to update the user
export function useUserUpdate()
{
    return useContext(UserUpdateContext);
}



export default function UserContextProvider({children})
{
    const [user, setUser] = useState(null);

    //Function to change the current user
    /*function setCurrentUser(user)
    {
        setUser(user);
    }*/

    return (
        <UserContext.Provider value={user}>
            <UserUpdateContext.Provider value={setUser}>
                {children}
            </UserUpdateContext.Provider>
        </UserContext.Provider>
    );
}