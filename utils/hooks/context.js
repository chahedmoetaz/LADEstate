import React, { useState } from "react";

export const ContractContext = React.createContext([]);
export const UserIdContext = React.createContext([]);

const Store = ({ children }) => {
  const [contract, setContract] = useState([]);
  const [userId, setUserId] = useState([]);
  return (
    <UserIdContext.Provider value={[userId, setUserId]}>
      <ContractContext.Provider value={[contract, setContract]}>
        {children}
      </ContractContext.Provider>
    </UserIdContext.Provider>
  );
};

export default Store;
