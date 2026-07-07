import { createContext, useContext, useState } from "react";

const UserContext = createContext(null);

export function UserProvider({ children }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getProfileData = async (userId) => {
        try{
            const res = await fetch(`${process.env.REACT_APP_HOST_URL}/admin/profile/${userId}`);
            if (!res.ok) {
                throw new Error('User not found');
            }
            const data = await res.json();
            return data;
        }catch(error){
            setError(error.message);
            return null;
        }finally{
            setLoading(false);
        }
    };
    return (
    <>
    <UserContext.Provider value={{ getProfileData, loading, error }}>
      {children}
    </UserContext.Provider>
    </>
  );
};
    
// 3. Create a custom hook for easy consumption
export const useProfile = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useProfile must be used within a UserProvider');
  }
  return context;
};

    

