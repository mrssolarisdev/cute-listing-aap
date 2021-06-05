import React, { useState } from 'react';


const ContextAllLists = React.createContext([{}, () => {}]);

const ProviderAllLists = (props) => {
    const allListsIni = [{
        title: "",
        color: "",
        categories: [{
            name:'NO_CAT',
            items:[]
        }],
      set: (property, value) => {
        setAllLists(
          {...list,[property]: value}
        );
      }
    }]
    const [allLists, setAllLists] = useState(allListsIni);
    return (
      <ContextAllLists.Provider value={[allLists, setAllLists]}>
        {props.children}
      </ContextAllLists.Provider>
    )
  }

  export {ProviderAllLists, ContextAllLists} 