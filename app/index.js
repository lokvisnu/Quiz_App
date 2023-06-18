import React from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS_SCHEME } from '../constants';
const COLORS = COLORS_SCHEME[0]
export default function App(){
    const router = useRouter();
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

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.WHITE,
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
