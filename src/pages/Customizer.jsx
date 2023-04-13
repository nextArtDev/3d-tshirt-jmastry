import { AnimatePresence, motion } from 'framer-motion'
import React, {useState, useEffect} from 'react'
import { useSnapshot } from 'valtio'

import config from '../config/config'
import state from '../store'
import {download} from '../assets'
import {downloadCanvasToImage, reader} from '../config/helpers'
import {EditorTabs, FilterTabs, DecalTypes} from '../config/constants'
import { fadeAnimation, slideAnimation } from '../config/motion'
import { AIPicker, ColorPicker, CustomButton, FilePicker, Tab } from '../components'

const Customizer = () => {
  const {intro} = useSnapshot(state)

  const [file, setFile] = useState('')
  const [prompt, setPrompt] = useState('')
  const [activeEditorTab, setActiveEditorTab] = useState('')
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt:true , stylishShirt:false
  })

  const generateTabContent =()=>{
    switch (activeEditorTab) {
      case 'colorpicker':
        return <ColorPicker/>
      case 'filepicker':
        return <FilePicker 
        file={file} setFile={setFile} readFile={readFile}
        />
      case 'aipicker':
        return <AIPicker/>
      default:
        return null
        break;
    }
  }

  const handleDecals = (type, result)=>{
    const decalType = DecalTypes[type]

    state[decalType.stateProperty] = result;

    if(!activeFilterTab[decalType.filterTab]){
      handleActiveFilterTab(decalType.filterTab)
    }
  }

  const handleActiveFilterTab = tabName =>{
    switch (tabName) {
      case 'logoShirt':
        state.isLogoTexture = !activeFilterTab[tabName]
        break
        
      case 'stylishShirt':
        state.isFullTexture = !activeFilterTab[tabName]
        break
        
      default:
        state.isLogoTexture =true
        state.isFullTexture =false
        break
    }
    setActiveFilterTab((prevState)=>{
      return{
        ...prevState, [tabName]:!prevState[tabName]
      }
    })
  }

  const readFile =type=>{
    reader(file)
    .then(result =>{
      handleDecals(type, result)
      setActiveEditorTab('')
    })
  }
  return (
    <AnimatePresence>
      {!intro &&(
      <>
      <motion.div key='custom' {...slideAnimation('left')} className="absolute top-0 left-0 z-10 ">
        <div className="flex items-center min-h-screen">
          <div className="editortabs-container tabs">
            {EditorTabs.map(tab=>(
              <Tab key={tab.name} tab={tab} 
              handleClick={()=> setActiveEditorTab(tab.name)}
              />
            ))}
            {generateTabContent()}
          </div>
        </div>
      </motion.div>
      <motion.div className="absolute z-10 top-5 right-5" {...fadeAnimation}>
        <CustomButton title='Go Back' type='filled' handleClick={()=>state.intro = true} customStyles='w-fit px-4 py-2.5 font-bold text-sm'/>
      </motion.div>

      <motion.div  {...slideAnimation('up')} className="filtertabs-container">
            {FilterTabs.map(tab=>(
              <Tab key={tab.name} tab={tab} isFilterTab isActiveTab={activeFilterTab[tab.name]}
              handleClick={()=>handleActiveFilterTab(tab.name)} 
              />
            ))}
          
      </motion.div>
      </>
      )}
    </AnimatePresence>
  )
}

export default Customizer