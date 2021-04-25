import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { View } from 'react-native';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { primary } from '../Styles/Styles'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

export default function SimpleAccordion(props) {
  const classes = useStyles();

  return (
    <View className={classes.root}>
      <Accordion style={{marginBottom:'6px', backgroundColor:props.backgroundColor?props.backgroundColor:'white'}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon style={{color:primary}} />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography style={{fontSize:'30px', textTransform:'capitalize'}} className={classes.heading}>{props.title}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography style={{flex:1}}>
          {props.contents}
          </Typography>
        </AccordionDetails>
      </Accordion>
    </View>
  );
}