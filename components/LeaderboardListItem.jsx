import React from 'react'
import { Text, View } from 'react-native'
import { COLORS_SCHEME } from '../constants'
import { FontAwesome5 } from '@expo/vector-icons';

export default function LeaderboardListItem({index,name,score,IsDark}) {
  const COLORS = COLORS_SCHEME[(IsDark)?1:0]
  const CrownColor = ()=>{
    let crownColor = ''
    switch(index){
      case 1:
        crownColor = '#FFD700'
        break;
      case 2:
        crownColor = '#C0C0C0'
        break;
      case 3:
        crownColor = '#CD7F32'
        break;
    }
    return crownColor;
  }
  return (
    <View  style={{
        backgroundColor:(IsDark)?'#171717':'#F4F3F6',
        width:'100%',
        alignItems:'center',
        flexDirection:'row',
        paddingHorizontal:16,
        paddingVertical:13,
        borderRadius:15,
        marginBottom:(index===10)?30:10,
        
      }}>
        <Text style={{
            fontWeight:'600',
            fontSize:15,
            color:COLORS.WHITE,
            backgroundColor:(IsDark)?'#323232':COLORS.PRIMARY_COLOR,
            width:30,
            height:30,
            borderRadius:1000,
            textAlign:'center',
            paddingTop:4

        }}>{index}</Text>
        <View style={{
          flexDirection:'column',
          justifyContent:'flex-start',
          flex:8,
          marginLeft:40
        }}>
            <Text style={{
                fontSize:17,
                fontWeight:'bold',
                color:(IsDark)?'#FFFFFFFF':COLORS.PRIMARY_COLOR,
                textTransform:'uppercase'
            }}>{name}</Text>
            <Text style={{
                fontSize:15,
                fontWeight:'300',
                textTransform:'uppercase',
                color:(IsDark)?'#FFFFFF':COLORS.PRIMARY_COLOR,
            }}>{score}</Text>
        </View>
       {(index<4)?<FontAwesome5 name="crown" size={24} color={CrownColor()}/>:''}
    </View>
  )
}
