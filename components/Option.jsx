import React from 'react'
import decode from 'html-entities-decoder'
import {Text,View} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { COLORS_SCHEME } from '../constants';
import { Ionicons } from '@expo/vector-icons';
export default function Options({optionText,OnClickListener,optionIndex,isSelected}) {
  const OptionsArray =['A','B','C','D']
  const COLORS = COLORS_SCHEME[0]
  const handleOptionClick = ()=>{
    OnClickListener(optionIndex)
  }
  return (
    <TouchableOpacity 
    onPress={handleOptionClick}
    style={{
      backgroundColor:(isSelected)?COLORS.ACTIVE_BTN:'#F4F3F6',
      width:'100%',
      alignItems:'center',
      flexDirection:'row',
      justifyContent:'space-between',
      paddingHorizontal:16,
      paddingVertical:16,
      borderRadius:8,
      marginVertical:7
    }}>

        <View style={{ 
            flex:1.2,
            backgroundColor:(isSelected)?COLORS.WHITE:'#EDE8E3',
            alignItems:'center',
            justifyContent:'center',
            borderRadius:16,
            width:32,
            height:32,
            position:(isSelected)?undefined:'relative'
          }}>
        {!isSelected?
           <Text style={{
            fontSize:15,
            fontWeight:500,
            color:COLORS.SECONDARY_COLOR,
            position:'absolute'
          }}>{OptionsArray[optionIndex]}</Text>:
          <Ionicons name="checkmark-sharp" size={16} color={COLORS.PRIMARY_COLOR} />
        } 
        </View>
        <Text
        style={{
          flex:9,
          paddingHorizontal:15,
          fontSize:13.5,
          fontWeight:400,
          textTransform:'uppercase',
          color:(isSelected)?COLORS.WHITE:COLORS.SECONDARY_COLOR
        }}>{optionText}</Text>
    </TouchableOpacity >
  )
}
