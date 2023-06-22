import React from 'react'
import decode from 'html-entities-decoder'
import {Text,View} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { COLORS_SCHEME } from '../constants';
import { Ionicons } from '@expo/vector-icons';
export default function Options({optionText,OnClickListener,optionIndex,isSelected,IsDark,IsLoading}) {
  const OptionsArray =['A','B','C','D']
  const COLORS = COLORS_SCHEME[IsDark?1:0] // Change
  const handleOptionClick = ()=>{
    OnClickListener(optionIndex)
  }
  return (
    <TouchableOpacity 
    onPress={handleOptionClick}
    style={{
      backgroundColor:(isSelected)?COLORS.ACTIVE_BTN:(IsDark)?'#171717':'#F4F3F6',
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
            width:30,
            height:30,
            maxHeight:30,
            maxWidth:30,
            position:(isSelected)?undefined:'relative'
          }}>
        {!isSelected?
           <Text style={{
            fontSize:15,
            fontWeight:500,
            color:(IsDark)?'#323232':COLORS.SECONDARY_COLOR,
            position:'absolute'
          }}>{!IsLoading?OptionsArray[optionIndex]:' '}</Text>:
          <Ionicons name="checkmark-sharp" size={16} color={(IsDark)?'#323232':COLORS.PRIMARY_COLOR} />
        } 
        </View>
        <Text
        style={{
          flex:9,
          paddingHorizontal:15,
          fontSize:13.5,
          fontWeight:400,
          textTransform:'uppercase',
          color:(IsDark)?COLORS.WHITE:(isSelected)?COLORS.WHITE:COLORS.SECONDARY_COLOR
        }}>{!IsLoading?optionText:'     '}</Text>
    </TouchableOpacity >
  )
}
