import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { View,Text,TouchableOpacity,FlatList,ScrollView, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons';
import { COLORS_SCHEME,LEADERBOARD_STORAGE_KEY } from '../../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LeaderboardListItem from '../../components/LeaderboardListItem';
import { Link } from 'expo-router';
import { useColorScheme } from 'react-native';
export default function index() {

    const [LeaderboardList,setLeaderboardList] = useState([]);
    const FirstDimension = 100;
    const colorScheme = useColorScheme()
    const [IsDark,setIsDark] = useState(colorScheme!=='light') //change // change
    const COLORS = COLORS_SCHEME[(IsDark)?1:0]

    const getLeaderboard = async ()=>{
        const jsonValue = await AsyncStorage.getItem(LEADERBOARD_STORAGE_KEY);
        const data = jsonValue.length?JSON.parse(jsonValue):[];
        setLeaderboardList(data);
    }
    useEffect(()=>{
        getLeaderboard()
    },[])
    useEffect(()=>{
        setIsDark(colorScheme!=='light')
      },[colorScheme])
  return (
    <SafeAreaView style={{flex:1,backgroundColor:(IsDark)?'#0F0F0F':'white'}}>
        <StatusBar/>
        <View style={{
            width:'100%',
            justifyContent:'flex-start',
            flexDirection:'column',
            paddingHorizontal:8,
            flex:1,
            height:'100%'
        }}>
            <View style={{
                paddingVertical:30
            }}>
                <View style={{
                    justifyContent:'flex-start',
                    flexDirection:'row',
                    paddingHorizontal:15
                }}>
                   
                    <Text style={{
                        textAlign:'center',
                        fontSize:20,
                        fontWeight:'bold',
                        textTransform:'uppercase',
                        flex:9,
                        color:COLORS.SECONDARY_COLOR
                    }}>Leaderboard</Text>
                     <TouchableOpacity style={{
                        alignItems:'center',
                        justifyContent:'center',
                        backgroundColor:(IsDark)?'#171717':COLORS.WHITE,
                        borderRadius:1000,
                        padding:5
                    }}>
                        <Link href={'/'}><Ionicons name="close" size={16} color={COLORS.SECONDARY_COLOR} /></Link>
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView style={{
                width:'100%',
                paddingHorizontal:20,
                paddingTop:10,
                flexDirection:'column',
                backgroundColor:COLORS.TERTIARY_COLOR,
                borderTopLeftRadius:25,
                borderTopRightRadius:25,
                flex:1,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.8,
                shadowRadius: 40,
                elevation: 5,
            }}>
                    {LeaderboardList.length!=0&& LeaderboardList.map((item,i)=>{
                            return(
                                <LeaderboardListItem key={i} name={item.name} score={item.score} index={i+1} IsDark={IsDark}/>
                            )
                        })
                    }
            </ScrollView>
        </View>
    </SafeAreaView>
  )
}
