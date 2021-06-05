import React, { useState } from 'react';


const ContextThisList = React.createContext([{}, () => {}]);

const ProviderThisList = (props) => {
    const thisListIni = {
        title: "",
        color: "",
        categories: [{
            name:'NO_CAT',
            items:[]
        }],
      set: (property, value) => {
        setThisList(
          {...list,[property]: value}
        );
      }
    }
    const [thisList, setThisList] = useState(thisListIni);
    return (
      <ContextThisList.Provider value={[thisList, setThisList]}>
        {props.children}
      </ContextThisList.Provider>
    )
  }

  export {ProviderThisList, ContextThisList} 