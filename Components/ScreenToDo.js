import React, {useState, useEffect} from 'react';
import { Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import List from './List';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { createStackNavigator } from '@react-navigation/stack';
import ScreenShowList from './ScreenShowList'
import {BasicCheckbox, bottom, fabAdd, primary} from '../Styles/Styles'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { chooseColour, returnColours } from './commonFunctions';
import SimpleAccordion from './SimpleAccordion';
import Paper from '@material-ui/core/Paper'; 
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import bearImage from '../urso.png'
import { GithubPicker  } from 'react-color';

const ScreenToDo = ({ navigation, route }) => {
  const [openAddListModal, setOpenAddListModal] = useState(false);
  const [openDeleteListModal, setOpenDeleteListModal] = useState(false);
  const [currentModal, setCurrentModal] = useState("");
  const [badInput, setBadInput] = useState(false);
  const [titleName, setTitleName] = useState("");
  const [chosenIndex, setChosenIndex] = useState(-1)
  const [currentlyDeleting, setCurrentlyDeleting] = useState(false)
  const [lists, setLists] = useState([])
  const [bearValue, setBearValue] = useState('yes2')
  const [openBearModal, setOpenBearModal] = useState(false)
  const [usingPickedColour, setUsingPickedColour] = useState(false)
  const [customColour, setCustomColour] = useState(chooseColour())
  const [bearDialog, setBearDialog] = useState("")
  const [bearDialogTitle, setBearDialogTitle] = useState("Random List Bear Says:")
  const [possibleBearDialogs, setPossibleBearDialogs] = useState([
    {title: bearDialogTitle, body:`This is so nice of you to say! :3`},
    {title: bearDialogTitle, body:`I like you too, you're so cute! :3`},
    {title: bearDialogTitle, body:`Wow thanks! have a nice day!`},
  ])

  const handleClickOnList = (index) => {
    navigation.navigate("List", {listTitle: lists[index].title, index: index, color:lists[index].color, list:lists[index] })
  }

  const handleClickOnBear = () => {
    let index = Math.floor(Math.random() * lists.length)
    if(lists.length > 0)
      handleClickOnList(index)
    else if(lists.length == 0) {
      handleOpenBearModal("empty")
    }
  }

  const handleClose = () => {
    if(currentModal == "add") {
      setOpenAddListModal(false);
    }
    else if (currentModal == "delete") 
      setOpenDeleteListModal(false);
    else if (currentModal == "bear") {
      setOpenBearModal(false)
      setBearDialog("")
    }
  };


  useEffect(() => {
    if(!openAddListModal)
      setUsingPickedColour(false)
  }, [openAddListModal]);

  {/*Start add Modal*/}

  const handleOpenAddListModal = (index) => {
    setCurrentModal('add')
    setTitleName("")
    setOpenAddListModal(true);
    setBadInput(false)
  };

  const handleConfirmAddList = async () => {
      if(titleName != "") {
        await addNewListToStorage()
        setOpenAddListModal(false)
      }
      else 
        setBadInput(true)
  };

  const handleTextChange = (event) => {
    let value = event.target.value;
    value?setBadInput(false):setBadInput(true)
    setTitleName(value);
  }

  const handleOpenBearModal = (type) => {
    if(type == "empty")
      setBearDialog({title: `No lists`, body:`Sorry, i can't redirect you to a list "bearcause" you don't have any. ${'\n'}Please, add one and try again!`})
    if(type == "hugBear") {
      let bearPhraseIndex = Math.floor(Math.random() * possibleBearDialogs.length)
      setBearDialog(possibleBearDialogs[bearPhraseIndex])
    }
    setCurrentModal('bear')
    setOpenBearModal(true)
  };

  const renderBearDialog = () => {
    return (
      <View>
        <Dialog
          open={openBearModal}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{bearDialog.title}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {bearDialog.body}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary" autoFocus>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </View>
    );
  }

  const handleUsingPickedColour = (e) => {
    setUsingPickedColour(!usingPickedColour)
  }

  const handleColourChange = (color) => {
    console.log(color.hex)
    setCustomColour(color.hex)
  }

  const renderColourPicker = () => {
    return <GithubPicker color={customColour} colors={returnColours()} onChangeComplete={handleColourChange}/>
  }
  const renderAddListDialog = () => {
    return (
      <View>
        <Dialog
          open={openAddListModal}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Add New List</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
            Lists should have   simple yet descriptive names {'\n'}
            Example: Daily Chores
            </DialogContentText>
            <TextField 
            onChange={handleTextChange}
            autoFocus
            required
            error={badInput}
            helperText={badInput?"List title must not be empty.":""}
            margin="dense"
            id="name"
            label="List name"
            type="text"
            fullWidth
          />
          <FormControlLabel
          control={<BasicCheckbox checked={usingPickedColour} onChange={(e) => {handleUsingPickedColour(e)}} name="usePickedColour" />}
          label="Custom Colour."
        />
          {usingPickedColour? renderColourPicker() : null }
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmAddList} color="primary" autoFocus>
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </View>
    );
  }

  {/*End add modal*/}
  {/*Start delete Modal*/}

  const handleOpenDeleteModal = (index) => {
    setChosenIndex(index)
    setCurrentModal("delete");
    setOpenDeleteListModal(true);
  };

  const handleConfirmDelete = () => {
    if(chosenIndex != -1) {
      setCurrentlyDeleting(true)
      let allLists = [...lists]
      allLists.splice(chosenIndex, 1)
      setLists(allLists)
      setOpenDeleteListModal(false);
      setChosenIndex(-1)
      setListsToStorage(allLists)
    }
  };

  const renderDeleteDialog = () => {
    let listTitle
    if(chosenIndex != -1)
      listTitle = lists[chosenIndex].title
    else
      listTitle = ""
    return (
      <View>
        <Dialog
          open={openDeleteListModal}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Delete List \""+listTitle+"\"?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} color="primary" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </View>
    );
  }

  {/*End delete Modal*/}

  const addNewListToStorage = async () => {
    let allLists = [...lists];

    let choose = usingPickedColour?customColour:chooseColour()

    let newList = {
      title: titleName,
      color: choose,
      categories: [{
        name:'NO_CAT',
        items:[]
      }]
    }
    allLists.push(newList)
    await setListsToStorage(allLists)
  }

  const getListsFromStorage = async () => {
    try {
      let jsonValue = await AsyncStorage.getItem('lists');
      
      if(jsonValue != null) {
        setLists(JSON.parse(jsonValue))
      }
      else {
        setLists([])
      }

    }
    catch (error) {
      console.log("Error when getting lists from Storage: "+ error)
    }
    finally {
    }
  }

  const setListsToStorage = async (lists) => {
    try {
      await AsyncStorage.setItem(
       'lists',
       JSON.stringify(lists)
    );
    } catch (error) {
      console.log("Error when adding list to Storage: "+ error)
    }
    finally {
      await getListsFromStorage()
    }
  }

  useEffect(() => {
    async function func() {
      let promise = await getListsFromStorage()
    };
    func()
  }, [route.params?.listTitle]);

  // Only on initial render? ', []'
  useEffect(() => {
    async function func() {
      let promise = await getListsFromStorage()
    };
    func()
  }, []);

  const renderLists = () => {
    let allLists = []
      for(let i = 0; i < lists.length; i++) {
        let changedTitle = lists[i].title
      allLists.push(
        <List 
          title={changedTitle}
          color={lists[i].color}
          key={"list_"+i.toString()}
          showFunction={(index) => handleClickOnList(index)}
          deleteFunction={(index) => handleOpenDeleteModal(index)}
          index={i}
        />
      )
    }
    return <View>{allLists}</View>
  }
    
  const handleBearChange = (event) => {
    setBearValue(event.target.value);
  };

  const renderBear = () => {
    let ret;
    let bearcomponent = (
      <View style={{flex:1, justifyContent:'center'}}>
        <Text style={{fontSize:24, justifyContent:'center'}}>Press this cute bear to travel to a random list!</Text>
        <Paper style={{justifyItems: 'center', marginTop:12}}>
          <TouchableOpacity style={{ flex:1, alignItems:'center'}} onPress={() => handleClickOnBear()}>
            <Image source={bearImage} style={{width: 300, height: 300}} />
          </TouchableOpacity>
        </Paper>
        <View style={{flex:1, marginTop:'10px'}}>
          <FormControl component="fieldset">
            <FormLabel component="legend"><Text style={{fontSize:18}}>Do you like this bear?</Text></FormLabel>
            <RadioGroup aria-label="gender" name="likeBear" value={bearValue} onChange={handleBearChange}>
              <View style={{flex:1, marginTop:'10px', flexDirection:'row'}}>
                <FormControlLabel value="yes1" control={<Radio />} label="Yes!" onChange={() => {handleOpenBearModal("hugBear")}}/>
                <FormControlLabel value="yes2" control={<Radio />} label="Absolutely Yes!" onChange={() => {handleOpenBearModal("hugBear")}} />
              </View>
            </RadioGroup>
          </FormControl>
        </View>
      </View>
    )
    ret = (
      <View style={{marginTop:'1px'}}>
        <SimpleAccordion key={0} style={{justifyContent: 'center', borderWidth:'6px'}}
          title="The Random List Bear"
          contents={<>{bearcomponent}</>}
        />
      </View>
    )
      return ret
  }

    return (
      
    <View style={{flex:1}}>
      <ScrollView style={{paddingBottom:`50px`}}>
        {renderLists()}
        {renderAddListDialog()}
        {renderDeleteDialog()}
        {renderBear()}
        {renderBearDialog()}
      </ScrollView>
      <View style={bottom}>
        <Fab size={'medium'} onClick={() => handleOpenAddListModal()} style={fabAdd} color="primary" aria-label="add">
          <AddIcon/>
        </Fab>
      </View>
    </View>
    );
};



  const toDoStack = createStackNavigator();

  function toDoStackScreen() {
    
    return (
      <toDoStack.Navigator>
        <toDoStack.Screen options={{headerShown: false, animationEnabled: true}} name="To Do" component={ScreenToDo} />
        <toDoStack.Screen name="List" component={ScreenShowList} options={
          ScreenShowList.navigationOptions
          }  />
      </toDoStack.Navigator>
    );
  }

export default toDoStackScreen