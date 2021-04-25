import React from 'react';
import {Text, View, TouchableOpacity } from 'react-native';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Styles from '../Styles/Styles'
import Paper from '@material-ui/core/Paper';
import {primary, secondary} from '../Styles/Styles'

const List = (props) => {

    const printList = () => {
        let index = props.index;

        return (
        
        <Paper style={{marginBottom:'2px', backgroundColor:props.color}}>
            <View style={{padding:'6px', paddingBottom: "14px"}}>
                <View style={{ flexDirection: 'row'}}>
                    <TouchableOpacity style={{ flex:1}} onPress={() => props.showFunction(index)}>
                        <Text style={Styles.listTitle}>{props.title}</Text>
                    </TouchableOpacity>
                    <IconButton onClick={() => props.deleteFunction(index)} size='small' aria-label="delete">
                        <DeleteIcon style={deleteIcon}/>
                    </IconButton>
                </View>
            </View>
        </Paper>
        )
    }

    return (
        printList()
    )
  };

  const ICONSIZE = 18
  const BORDER_RADIUS = 10
  const BORDER_WIDTH = 1
  const BORDER_COLOUR = secondary
  const PADDING = 2
  const ICON_COLOR = primary

  const deleteIcon = {
      fontSize:ICONSIZE,
      color: ICON_COLOR,
      backgroundColor: "white",
      borderRadius:BORDER_RADIUS,
      borderColor:BORDER_COLOUR,
      borderWidth:BORDER_WIDTH,
      borderStyle:'solid',
      padding:PADDING
  };

export default List