import React,{useState,useEffect} from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,useColorScheme } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS_SCHEME } from '../constants';
export default function App(){
    const colorScheme = useColorScheme()
    const [IsDark,setIsDark] = useState(colorScheme!=='light') //change // change
    const COLORS = COLORS_SCHEME[(IsDark)?1:0]
    const router = useRouter();

    const styles = StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor:(IsDark)?'#0F0F0F': COLORS.WHITE,
          alignItems: 'center',
          justifyContent: 'center',
          gap:15
        },
        ButtonActive:{
            backgroundColor:COLORS.ACTIVE_BTN,
            width:335,
            height:60,
            borderRadius:8,
            alignItems:'center',
            justifyContent:'center',
        },
        ButtonText:{
            color:COLORS.WHITE,
            textTransform:'uppercase',
            fontSize:16,
            fontWeight:600,
        }
      });

      useEffect(()=>{
        setIsDark(colorScheme!=='light')
      },[colorScheme])

    const handleClick = ()=>{
        router.push('/quiz')
    }
    const handleLeaderboardClick = ()=>{
        router.push('/leaderboard')
    }


    return(
        <SafeAreaView style={{flex:1}}>
            <View style={styles.container}>
                <StatusBar/>
                <TouchableOpacity style={styles.ButtonActive}
                onPress={handleClick}>
                    <Text style={styles.ButtonText}>Start</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.ButtonActive}
                onPress={handleLeaderboardClick}>
                    <Text style={styles.ButtonText}>LeaderBoard</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    
)
   
 
}

