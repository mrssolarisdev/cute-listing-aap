import React from 'react';
import { StyleSheet} from 'react-native';
import { pink } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/core/styles';

const Styles = StyleSheet.create({
    listTitle: {
      flex: 1,
      alignItems: 'right',
      fontSize: 24
    },
    bottom: {
      flex: 1,
      justifyContent: 'flex-end',
      marginBottom: 4
    },
    
    fabAdd: {
      alignSelf: 'center',
    }
  });

const COLOR = pink

export const theme = createMuiTheme({
  palette: {
    primary: {
      light: COLOR[50],
      main: COLOR[500],
      dark: COLOR[700],
    },
    secondary: {
      main: COLOR[900],
    },
  },
});

export const primary = theme.palette.primary.main
export const secondary = theme.palette.secondary.main

export const bottom = {
  flex: 1,
  justifyContent: 'flex-end',
  marginBottom: 0,
}

export const fabAdd = {
  flex: 1,
  alignSelf: 'center',
  marginBottom: 10,
  maxWidth: '64px', maxHeight: '64px', minWidth: '64px', minHeight: '64px'
}

export const filterIconButton = {
  color: primary
}

export const BasicCheckbox = withStyles({
  root: {
    color: primary,
    '&$disable': {
      color: secondary,
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

export default Styles;