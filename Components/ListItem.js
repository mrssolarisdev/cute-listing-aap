import React, {useState, useEffect} from 'react';
import { StyleSheet, ItemName, View } from 'react-native';
import Button from '@material-ui/core/Button';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {BasicCheckbox} from '../Styles/Styles'

const ListItem = (props) => {
    
    const [complete, setComplete] = useState(false)
    const [itemName, setItemName] = useState("Empty List Item")
    
    const printListItem = () => {
      let internalName = props.list+'_'+props.index
        return (
        <View>
            <FormControlLabel
            control={<BasicCheckbox checked={false} onChange={() => {}} name={internalName} inputProps={{ 'aria-label':internalName }} key={internalName} />}
            label={itemName} style={{flex:1, flexDirection: 'row'}}
          />
        </View>
        )
    }

    return (
      printListItem()
    )
  };

export default ListItem