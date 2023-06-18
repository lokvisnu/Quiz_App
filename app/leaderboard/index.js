import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { View,Text,TouchableOpacity,FlatList,ScrollView, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons';
import { COLORS_SCHEME,LEADERBOARD_STORAGE_KEY } from '../../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LeaderboardListItem from '../../components/LeaderboardListItem';
import { Link } from 'expo-router';
export default function index() {

    const [LeaderboardList,setLeaderboardList] = useState([]);
    const FirstDimension = 100;
    const COLORS = COLORS_SCHEME[0]

    const getLeaderboard = async ()=>{
        const jsonValue = await AsyncStorage.getItem(LEADERBOARD_STORAGE_KEY);
        const data = jsonValue.length?JSON.parse(jsonValue):[];
        setLeaderboardList(data);
    }
    useEffect(()=>{
        getLeaderboard()
    },[])
  return (
    <SafeAreaView style={{flex:1,backgroundColor:'white'}}>
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
                        backgroundColor:COLORS.WHITE,
                        borderRadius:1000,
                        padding:5
                    }}>
                        <Link href={'/'}><Ionicons name="close" size={16} color={COLORS.SECONDARY_COLOR} /></Link>
                    </TouchableOpacity>
                </View>
                {/*<View style={{
                    flexDirection:'row',
                    justifyContent:'center',
                    marginTop:20,
                    gap:10,
                    alignContent:'flex-end',
                    alignItems:'flex-end'
                }}>
                    <View style={{
                        flexDirection:'column',
                        alignItems:'center',
                        justifyContent:'center'
                    }}>
                        <View style={{
                                backgroundColor:'lightgray',
                                borderRadius:1000,
                                width:FirstDimension/1.3,
                                height:FirstDimension/1.3,
                                justifyContent:'center',
                                alignItems:'center',
                                marginBottom:5
                            }}>
                            <Text style={{
                                textAlign:'center',
                                fontSize:20,
                                fontWeight:'900',
                            }}>2</Text>
                        </View>
                        <Text style={{
                            fontWeight:'200',
                            textAlign:'center',
                            textTransform:'uppercase',
                            fontSize:12
                        }}>{LeaderboardList.length&&LeaderboardList[1].name}</Text>
                        <Text style={{
                            fontWeight:'400',
                            textAlign:'center',
                            textTransform:'uppercase',
                            fontSize:20,
                            backgroundColor:COLORS.SECONDARY_COLOR,
                            paddingHorizontal:15,
                            color:COLORS.WHITE,
                            borderRadius:25
                        }}>{LeaderboardList.length&&LeaderboardList[1].score}</Text>
                    </View>
                    <View style={{
                        flexDirection:'column',
                        alignItems:'center',
                        justifyContent:'center'
                    }}>
                        <View style={{
                                backgroundColor:'lightgray',
                                borderRadius:1000,
                                width:FirstDimension,
                                height:FirstDimension,
                                justifyContent:'center',
                                alignItems:'center',
                                marginBottom:5
                            }}>
                            <Text style={{
                                textAlign:'center',
                                fontSize:20,
                                fontWeight:'900',
                            }}>1</Text>
                        </View>
                        <Text style={{
                            fontWeight:'200',
                            textAlign:'center',
                            textTransform:'uppercase',
                            fontSize:12
                        }}>{LeaderboardList.length&&LeaderboardList[0].name}</Text>
                        <Text style={{
                            fontWeight:'400',
                            textAlign:'center',
                            textTransform:'uppercase',
                            fontSize:20,
                            backgroundColor:COLORS.SECONDARY_COLOR,
                            paddingHorizontal:15,
                            color:COLORS.WHITE,
                            borderRadius:25
                        }}>{LeaderboardList.length&&LeaderboardList[0].score}</Text>
                    </View>
                    <View style={{
                        flexDirection:'column',
                        alignItems:'center',
                        justifyContent:'center'
                    }}>
                        <View style={{
                                backgroundColor:'lightgray',
                                borderRadius:1000,
                                width:FirstDimension/1.3,
                                height:FirstDimension/1.3,
                                justifyContent:'center',
                                alignItems:'center',
                                marginBottom:5
                            }}>
                            <Text style={{
                                textAlign:'center',
                                fontSize:20,
                                fontWeight:'900',
                            }}>3</Text>
                        </View>
                        <Text style={{
                            fontWeight:'200',
                            textAlign:'center',
                            textTransform:'uppercase',
                            fontSize:12
                        }}>{LeaderboardList.length&&LeaderboardList[2].name}</Text>
                        <Text style={{
                            fontWeight:'400',
                            textAlign:'center',
                            textTransform:'uppercase',
                            fontSize:20,
                            backgroundColor:COLORS.SECONDARY_COLOR,
                            paddingHorizontal:15,
                            color:COLORS.WHITE,
                            borderRadius:25
                        }}>{LeaderboardList.length&&LeaderboardList[2].score}</Text>
                    </View>
                    </View>*/}
            </View>
            <ScrollView style={{
                width:'100%',
                paddingHorizontal:20,
                paddingTop:10,
                flexDirection:'column',
                backgroundColor:COLORS.WHITE,
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
                                <LeaderboardListItem key={i} name={item.name} score={item.score} index={i+1}/>
                            )
                        })
                    }
            </ScrollView>
        </View>
    </SafeAreaView>
  )
}
