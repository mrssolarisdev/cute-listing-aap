import React, {useState, useEffect, useContext} from 'react';
import {Text, View, ScrollView } from 'react-native';
import Button from '@material-ui/core/Button';
import SimpleAccordion from './SimpleAccordion'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {BasicCheckbox, secondary, primary, theme} from '../Styles/Styles'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper'; 
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { GithubPicker } from 'react-color';
import { chooseColour, returnColours } from './commonFunctions';
import listServices from "../Services/ListServices";
import {ContextAllLists} from './ContextAllLists';
import {ContextThisList} from './ContextThisList';

const ScreenShowList = ({route, navigation}) => {
    const [listIndex, setListIndex] = useState(route.params.index)
    const [listId, setListId] = useState(route.params.list.id)
    const [listColour, setListColour] = useState(route.params.color)
    const [editMode, setEditMode] = useState(false)
    const [listTitle, setListTitle] = useState(route.params.listTitle)
    const [openDeleteModal, setOpenDeleteModal] = useState(false)
    const [openAddModal, setOpenAddModal] = useState(false)
    const [currentModal, setCurrentModal] = useState('')
    const [chosenCatIndex, setChosenCatIndex] = useState(-1) // Chosen index of whatever is selected
    const [chosenItemIndex, setChosenItemIndex] = useState(-1) // Chosen index of whatever is selected
    const [itemToUse, setItemToUse] = useState("") // Name of item to be added (item/category)
    const [badInput, setBadInput] = useState(false)
    const [nameToAdd, setNameToAdd] = useState('')
    const [lists, setLists] = useContext(ContextAllLists) // Needed to keep all lists consistent and circumvent mockapi's connection delay.
    const [thisList, setThisList] = useContext(ContextThisList)
    const [usingPickedColour, setUsingPickedColour] = useState(false)
    const [customColour, setCustomColour] = useState(chooseColour())

    const textInputStyles = {
        title:{
            fontSize:'20px'
        },
        category:{
            fontSize:'18px',
            fontWeight:500
        },
        item:{
            fontSize:'14px'
        }
    }

    const handleMasterEditBtn = () => {
        setEditMode(!editMode)
    }

    useEffect(() => {
        let newLists = [...lists]
        newLists[listIndex] = thisList
        setLists(newLists)
        /*async function setToStorage() {
            if(editMode) {
                await setThisListToStorage()
            }
        }
        setToStorage()*/
    }, [thisList])

    useEffect(() => {
        if(editMode)
            navigation.setOptions({ headerTitle:
                <View>
                    <TextField onChange={(e) => handleEditedInput(e, true)} id="listTitle" defaultValue={thisList.title} inputProps={{style:textInputStyles.title}}/>
                </View>
            })
        else {
            navigation.setOptions({ headerTitle: thisList.title})
        }
        navigation.setOptions({
            headerRight: () => (
                <IconButton style={{marginRight:'8px'}} size='small' aria-label="edit"  onClick={() => handleMasterEditBtn()}>
                  {renderEditButton()}
                </IconButton>
            )
          });
    }, [editMode]);


    useEffect(() => {
        navigation.setOptions({ // Aqui a gente trocou o botao de back do header. ELE AGORA EH ROSA
            headerLeft: () => (
            <IconButton style={{marginRight:'8px'}} size='small' aria-label="edit"  onClick={() => handleBackBtn()}>
                <ArrowBackIcon style={{color:primary, marginLeft:'10px'}}/>
            </IconButton>
            )
        })
        async function getFromStorage() {
            await getThisListFromStorage()
        };
        getFromStorage()
     }, []);

    const handleBackBtn = () => {
        navigation.navigate("To Do", {listTitle: route.params.listTitle, updateStorage: true})
    }

    const renderEditButton = () => {
        return <EditIcon style={editMode?editIcon.Off:editIcon.On}/>
    }

    const renderAddBtn = (catIndex, label, whiteBG=false) => {
        let viewStyle = {}
        let btnStyle
        if(catIndex != 0)
            viewStyle = {margin:'10px', marginTop:'-7px'}  
        else
            viewStyle = {margin:'10px'}
        whiteBG ? btnStyle = addItemBtn : btnStyle = addItemBtnWhite
        if(editMode) {
            return (
            <View style={viewStyle}>
                <Button
                    variant="contained"
                    color="default"
                    startIcon={<AddIcon style={{color:secondary}}/>}
                    style={btnStyle}
                    onClick={() => handleOpenAddModal('item', catIndex)}
                >
                    {label}
                </Button>
            </View>
            )
            }
        else 
            return null
    }

    // Dialog Start

    const handleClose = () => {
        if(currentModal == "add")
            setOpenAddModal(false);
        else if (currentModal == "delete") 
            setOpenDeleteModal(false);
    };

    const handleTextChange = (event) => {
        let value = event.target.value;
        value?setBadInput(false):setBadInput(true)
        setNameToAdd(value);
    }

    // Delete Dialog Start

    const handleOpenDeleteModal = (typeToUse, catIndex, itemIndex=-1) => {
        if(typeToUse == 'item') {
            setItemToUse('item')
            setChosenCatIndex(catIndex)
            setChosenItemIndex(itemIndex)
        }
        else if(typeToUse == 'category') {
            setItemToUse('category')
            setChosenCatIndex(catIndex)
        }
        setCurrentModal("delete");
        setOpenDeleteModal(true);
      };

    const handleConfirmDelete = () => {
        let newList = {...thisList}
        if(itemToUse == 'item') {
            try {
                newList.categories[chosenCatIndex].items.splice(chosenItemIndex, 1)
                setThisList(newList)
            }
            catch (error) {
                console.log("Error when deleting item from list array: "+ error)
            }
        }
        else if(itemToUse == 'category') {
            try {
                newList.categories.splice(chosenCatIndex, 1)
                setThisList(newList)
            }
            catch (error) {
                console.log("Error when deleting category from list array: "+ error)
            }
        }
        setOpenDeleteModal(false);
      };

    const renderDeleteDialog = () => {
        let titleText;
        if(itemToUse == 'item') {
            titleText = 'Item'
        }
        else if(itemToUse == 'category') {
            titleText = 'Category'
        }
        return (
          <View>
            <Dialog
              open={openDeleteModal}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{"Delete "+titleText + "?"}</DialogTitle>
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

    // Delete Dialog End

    // Add Dialog Start

    const handleOpenAddModal = (typeToUse, catIndex) => {
        if(typeToUse == 'item' || typeToUse == 'category')
            setItemToUse(typeToUse)
        if(typeToUse == 'item')
            setChosenCatIndex(catIndex)
        setCurrentModal('add')
        setNameToAdd("")
        setUsingPickedColour(false)
        setOpenAddModal(true);
        setBadInput(false)
    };

    const handleConfirmAdd = () => {
        if(nameToAdd != '') {
            if(itemToUse == 'item') {
                addNewItem(nameToAdd, chosenCatIndex)
            }
            else if(itemToUse == 'category') {
                addNewCategory(nameToAdd)
            }
            setOpenAddModal(false)
        }
        else
            setBadInput(true)
    }

    const handleUsingPickedColour = (e) => {
        setUsingPickedColour(!usingPickedColour)
      }
    
    const handleColourChange = (color) => {
        console.log(color.hex)
        setCustomColour(color.hex)
    }

    const renderColourPicker = () => {
        return <GithubPicker color={customColour} colors={returnColours(true)} onChangeComplete={handleColourChange}/>
    }

    const renderAddDialog = () => {
        let text = {titleText: '', descText: '', exampleText: ''}
        if(itemToUse == 'item') {
            text.titleText = 'Item'
            text.descText = 'Items'
            text.exampleText = 'Milk'
        }
        else if(itemToUse == 'category') {
            text.titleText = 'Category'
            text.descText = 'Categories'
            text.exampleText = 'Dairy Products'
        }
        return (
          <View>
            <Dialog
              open={openAddModal}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{ 'Add New '+text.titleText }</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                {text.descText} should have simple yet descriptive names. {'\n\n'}
                Example: {text.exampleText}
                </DialogContentText>
                <TextField 
                onChange={handleTextChange}
                autoFocus
                required
                error={badInput}
                helperText={badInput?"Name must not be empty.":""}
                margin="dense"
                id="name"
                label={text.titleText+" name"}
                type="text"
                fullWidth
              />
                {itemToUse == 'category' ?
                    <FormControlLabel
                        control={<BasicCheckbox checked={usingPickedColour} onChange={(e) => {handleUsingPickedColour(e)}} name="usePickedColour" />}
                        label="Custom Colour."
                    />
                : null}
                {usingPickedColour ? renderColourPicker() : null }
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleConfirmAdd} color="primary" autoFocus>
                  Add
                </Button>
              </DialogActions>
            </Dialog>
          </View>
        );
    }

    // Add Dialog End

    const addNewItem = (itemName, catIndex) => {
        let newList = {...thisList}
        newList.categories[catIndex].items.push({
            name:itemName,
            checked: false,
        })
        setThisList(newList)
    }

    const addNewCategory = (catName) => {
        let newList = {...thisList}
        let chosenColor = usingPickedColour?customColour:chooseColour(true)
        newList.categories.push({
            name:catName,
            items:[],
            color: chosenColor
        })
        setThisList(newList)
    }

    const turnInputEditable = (text, style, isTitle=false, catIndex=-1) => {
        if(editMode) {
            return <TextField
            onChange={(e) => handleEditedInput(e, isTitle, catIndex)}
            value={text}
            inputProps={{style:style}}/>
        }
        else 
            return <Text style={style}>{text}</Text>;
    }

    const handleEditedInput = (e, isTitle, catIndex=-1, itemIndex=-1) => {
        let txtValue = e.target.value
        if(txtValue != '') {
            if(isTitle) {
                let newList = {...thisList}
                newList.title = txtValue
                route.params.listTitle = txtValue
                setThisList(newList)
                setListTitle(txtValue)
            }
            else {
                if(itemIndex == -1) {
                    if(catIndex > -1) {
                        let newList = {...thisList}
                        newList.categories[catIndex].name = txtValue
                        setThisList(newList)
                    }
                }
                else {
                    if(catIndex > -1) {
                        let newList = {...thisList}
                        newList.categories[catIndex].items[itemIndex].name = txtValue
                        setThisList(newList)
                    }
                }
            }
        }
    }

    const createCategory = (catName, catIndex, items=[]) => {
        let retCategory;
        let categoryItems = [];
        let categoryColor = thisList.categories[catIndex].color?thisList.categories[catIndex].color:'white'
        for(let i=0; i < items.length; i++) {
            categoryItems.push(createListItem(items[i].name, i, items[i].checked, catIndex))
        }
        if(catIndex != 0) {
            retCategory = 
                <SimpleAccordion backgroundColor={categoryColor} key={catIndex} style={{borderWidth:'6px', marginBottom:'24px', borderColor:'black'}} title={
                    <View style={{flex:1, flexDirection:'row'}}>
                        {turnInputEditable(catName, textInputStyles.category, false, catIndex)}
                        {editMode?
                        <IconButton onClick={()=> handleOpenDeleteModal('category', catIndex)} size='small' aria-label="delete" key={catIndex}>
                            <DeleteIcon style={{color:primary, marginLeft:'10px'}}/>
                        </IconButton>
                        :null}
                    </View>
                    }
                    contents={
                        <>
                            {(categoryColor == 'white' || categoryColor == '#ffffff')?renderAddBtn(catIndex, "Add Item", true):renderAddBtn(catIndex, "Add Item")}
                            {categoryItems}
                            
                        </>
                    }
                />
        }
        else {
            retCategory = 
                <View key={catIndex}>
                    {renderAddBtn(catIndex, "Add Item (No Category)", true)}
                    {categoryItems}
                </View>
        }
        return retCategory;
    }

    const renderCategories = () => {
        let allCategories = []
        if(thisList == null)
            return null
        for(let i=0; i < thisList.categories.length; i++) {
            allCategories.push(createCategory(thisList.categories[i].name, i, thisList.categories[i].items))
        }
        allCategories.push(allCategories.splice(0, 1)[0]);
        return allCategories;
    }

    const createListItem = (name, index, checked=false, category=0) => {
        let itemSettings = {
            deleteIconStyle: "",
            nameString: "",
            labelStyle: ""
        }
        if(category!=0) {
            itemSettings.deleteIconStyle = {color:primary, marginRight:'-2px'}
            itemSettings.nameString = category+"_"+index // indexCategory_indexItem
            itemSettings.labelStyle = categoryItem
        }
        else {
            itemSettings.deleteIconStyle = {color:primary, marginRight:'15px'}
            itemSettings.nameString = "0_"+index
            itemSettings.labelStyle = noCategoryItem
        }

        function listItemText() {
            if(editMode) {
                return <TextField onChange={(e) => handleEditedInput(e, false, category, index)} value={name} inputProps={textInputStyles.item}/>
            }
            else {
                return name
            }
        }
        return (
        <View key={index} style={{flexDirection: "row"}}>
            <FormControlLabel
                control={
                <BasicCheckbox
                    checked={checked}
                    onChange={handleChange}
                    name={itemSettings.nameString}
                    inputProps={{ 'aria-label': listTitle+' item '+(index+1)+' called '+name}}
                    key={index}
                    disabled={editMode}
                    />
                }
                label={listItemText()} style={itemSettings.labelStyle}
            />
            {editMode?
            <IconButton onClick={()=> handleOpenDeleteModal('item', category, index)} size='small' aria-label="delete" key={index}>
                <DeleteIcon style={itemSettings.deleteIconStyle}/>
            </IconButton>
            :null}
        </View>
        )
    }

    const handleChange = (event) => {
        let btnName = event.target.name
        let divisorIndex = btnName.search('_')

        let catIndex = parseInt(btnName.substring(0, divisorIndex))
        let itemIndex = parseInt(btnName.substring(divisorIndex+1))
        let newList = {...thisList}
        newList.categories[catIndex].items[itemIndex].checked = event.target.checked
        /*async function setToStorage() {
            if(!editMode)
                await setThisListToStorage(newList)
                //await setThisListToStorage()
        }
        setToStorage()*/
        setThisList(newList);
      }

    /*const getThisListFromStorage = async () => {
        try {
          let jsonValue = await AsyncStorage.getItem('lists');
          if(jsonValue != null) {
            let parsedLists = JSON.parse(jsonValue)
            setThisList(parsedLists[listIndex])
          }
          else {
            alert("Failed to load list. Creating empty list.")
            setThisList({
                title:listTitle,
                color: listColour,
                categories: []
            })
          }
    
        }
        catch (error) {
          console.log("Error when getting this list from Storage: "+ error)
        }
        finally {
        }
    }*/

    const getThisListFromStorage = async () => {
        listServices.get(listId)
        .then(res => {
            console.log(res.data)
            setThisList(res.data)
        })
        .catch(err => {
            console.error("Erro ao conectar com a API: " + err)
        })
    }

    const setThisListToStorage = async (list=thisList) => {
        listServices.update(list.id, list)
        .then(res => {
            console.log(res.data)
        })
        .catch(err => {
            console.error("Erro ao conectar com a API: " + err)
        })
    }

    /*const setThisListToStorage = async (list=thisList) => {
        let allLists;
        try {
            let jsonAllLists = await AsyncStorage.getItem('lists')
            
            if(jsonAllLists != null) {
                allLists = JSON.parse(jsonAllLists)
              }
              else {
                throw "Lists not found";
            }
        } catch (error) {
            console.log("Error when getting all lists from Storage: "+ error)
        }
        allLists[listIndex] = list
        
        try {
          await AsyncStorage.setItem(
           'lists',
           JSON.stringify(allLists)
        );
        } catch (error) {
          console.log("Error when setting this list to Storage: "+ error)
        }
        finally {
          //await getThisListFromStorage()
        }
    }*/

    const addCategoryBtn = {
        color:secondary, 
        padding:'10px',
        backgroundColor: theme.palette.primary.light,
        borderStyle:'dashed',
        borderWidth:'1px',
        marginTop:'4px',
        marginBottom:'4px',
        boxShadow:"none",
        display:editMode?'':'none',
        margin:'4px',
    }

    const addItemBtn = {
        color: secondary, 
        padding:'6px',
        backgroundColor: theme.palette.primary.light,
        borderStyle:'dashed',
        borderWidth:'1px',
        marginTop:'4px',
        marginBottom:'4px',
        boxShadow:"none",
        display:editMode?'':'none',
        margin:'4px',
    }

    const addItemBtnWhite = {
        color: secondary, 
        padding:'6px',
        backgroundColor: 'white',
        borderStyle:'dashed',
        borderWidth:'1px',
        marginTop:'4px',
        marginBottom:'4px',
        boxShadow:"none",
        display:editMode?'':'none',
        margin:'4px',
    }

    const addIcon = {
        fontSize:16,
        color: primary,
        backgroundColor: "white",
        borderRadius:4,
        borderWidth:2,
        borderStyle:'solid',
        padding:0
      };

    const noCategoryItem = {
        marginLeft:'-4px',
        flex:1
    }
    
    const categoryItem = {
        flex:1,
        flexDirection: 'row'
    }

    return (
    <View style={{backgroundColor:listColour, flex:1}}>
        <ScrollView>
            <Paper style={{}}>
                    <View style={{}}>
                        <Button
                            variant="contained"
                            color="default"
                            startIcon={<AddIcon style={{color:secondary}}/>}
                            style={addCategoryBtn}
                            onClick={() => handleOpenAddModal('category')}
                        >
                            Category
                        </Button>
                    </View>
                {renderCategories()}
                {renderDeleteDialog()}
                {renderAddDialog()}
            </Paper>
        </ScrollView>
    </View>
    )
}

const editIcon = {
    On:{
        fontSize:22,
        color: secondary,
        backgroundColor: "white",
        borderRadius:10,
        borderWidth:1,
        borderStyle: 'solid',
        borderColor: secondary,
        padding:4,
        backgroundColor:'white',
        boxShadow:'0px 2px',
    },
    Off:{
        fontSize:22,
        color: secondary,
        backgroundColor: "e6e6e6",
        borderRadius:10,
        borderRadius:10,
        borderWidth:1,
        borderStyle: 'solid',
        borderColor: secondary,
        boxShadow:'0px 0px',
        padding:4
    }
};

export default ScreenShowList