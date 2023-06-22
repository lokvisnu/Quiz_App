import React,{useState,useEffect} from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,useColorScheme } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS_SCHEME ,DIFFICULTY_STORAGE_KEY} from '../constants';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { diff } from 'react-native-reanimated';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

export default function App(){
    const colorScheme = useColorScheme()
    const [IsDark,setIsDark] = useState(colorScheme!=='light') //change // change
    const COLORS = COLORS_SCHEME[(IsDark)?1:0]
    const [difficulty,setDifficulty] = useState(0);
    const router = useRouter();
    async function getDifficulty(){
        try{
            const val = await AsyncStorage(DIFFICULTY_STORAGE_KEY);
            const Index = parseInt(val);
            setDifficulty(Index);
        }
        catch(e){
            console.log("E",e);
        }    
    }

    useEffect(()=>{
            getDifficulty();
    },[])
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
        },
        PickerStyle:{
            width:'100%',
            height:'100%',
            backgroundColor:COLORS.ACTIVE_BTN,
            color:'white',
            textTransform:'uppercase',
            borderRadius:8,
        },
        PickerItemStyle:{
           
        },
        PickerTextItemStyle:{
            
        }
      });

      useEffect(()=>{
        setIsDark(colorScheme!=='light')
      },[colorScheme])
      const setDifficultyLevel = async () => {
        try {
          const Value = difficulty.toString();
          await AsyncStorage.setItem(DIFFICULTY_STORAGE_KEY, Value)
        } catch (e) {
          console.log(e)
        }
      }
    const handleClick = ()=>{
        setDifficultyLevel()
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
                <View style={{
                    backgroundColor:COLORS.ACTIVE_BTN,
                    borderRadius:8,
                    paddingVertical:2,
                    paddingHorizontal:5,
                    width:335,
                    height:60
                }}>
                <Picker style={styles.PickerStyle}
                    itemStyle = {styles.PickerTextItemStyle}
                    dropdownIconColor={'white'}
                    mode='dropdown'
                    selectedValue={difficulty}
                    onValueChange={(itemValue) =>{
                        
                        setDifficulty(itemValue)
                    }}>
                    <Picker.Item label="AUTO" value={0} style={styles.PickerItemStyle}/>
                    <Picker.Item label="EASY" value={1} style={styles.PickerItemStyle}/>
                    <Picker.Item label="MEDIUM" value={2} style={styles.PickerItemStyle}/>
                    <Picker.Item label="HARD" value={3} style={styles.PickerItemStyle}/>
                </Picker>
                </View>
                <TouchableOpacity style={styles.ButtonActive}
                onPress={handleLeaderboardClick}>
                    <Text style={styles.ButtonText}>LeaderBoard</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    
)
   
 
}

