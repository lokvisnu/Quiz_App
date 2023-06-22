import React, { useEffect, useState } from 'react'
import {View,Text,SafeAreaView,TouchableOpacity,StyleSheet,Image, Dimensions,Animated,TextInput, useColorScheme} from 'react-native'
import decode from 'html-entities-decoder'
import { StatusBar } from 'expo-status-bar'
import Option from '../../components/Option'
import {COLORS_SCHEME,LEADERBOARD_STORAGE_KEY,DIFFICULTY_STORAGE_KEY } from '../../constants'
import { ColorSpace, color } from 'react-native-reanimated'
import { Entypo,Ionicons,Feather } from '@expo/vector-icons'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter,useNavigation,Link } from 'expo-router'


export default function Quiz() {
  const [questions,setQuestions] = useState([]) // Array Of All Questions
  const [IsNewHighScore,setIsNewHighScore]  = useState(false)
  const [IsCompleted,setIsCompleted] =useState(false) // Once All Questions are Completed setIsCompletd(true) -> Loading Cong Box
  const [currentQuestion,setCurrentQuestion] = useState(-1) // Current Question Number Range(0-4)
  const [currentAnswerIndex,setCurrentAnswerIndex] = useState(0) // Current Question Answer Index Range(0-3) 4 Options
  const [SelectedOption,setSelectedOption] = useState(-1) // Anser Selected for the Current Question (-1) -> IF NO Ans Selected ELSE Range(0-3) -> If Ans Selected  
  const [score,setScore] = useState(0); // Score +4 -> Correct Answer, (-1) -> Wrong Answer
  const [correctPrediction,setCorrectPrediction]= useState(0);
  const [Points,setPoints] = useState(0)
  const [highScoreName,onChangeHighScoreName] = useState('')
  const [LeaderboardList,setLeaderboardList] = useState([]);
  const [Time,setTime] = useState(60);
  const [IsTimerPaused,setIsTimerPaused] = useState(false);
  const router = useRouter();
  const navigation = useNavigation();
  const colorScheme = useColorScheme()
  const [IsDark,setIsDark] = useState(colorScheme!=='light') //change // change
  const COLORS = COLORS_SCHEME[(IsDark)?1:0]
 // console.log(cS)
  // Fetch Question Array from API
  /*
  Response From API
  {
    "response_code":0,
    "results":[
      {"category":"General Knowledge",
      "type":"multiple","difficulty":"hard",
      "question":"Which of the following is an existing family in &quot;The Sims&quot;?",
      "correct_answer":"The Goth Family",
      "incorrect_answers":["The Family","The Simoleon Family","The Proud Family"
    ]}
  }
  */
  const FetchQuestion  = async ()=>{
    
    try
    {
      //Get Difficulty
      const val = await AsyncStorage.getItem(DIFFICULTY_STORAGE_KEY)
      const index = parseInt(val)
      const difficulty = ['','easy','medium','hard']
      const uri =`https://opentdb.com/api.php?amount=5&category=9&type=multiple${(index)!=0?`&difficulty=${difficulty[index]}`:''}`
      const res = await fetch(uri);
      const data = await res.json();
      let questionArray = [];
      if(data.response_code===0){
          //console.log(data.results[0])
          data.results.map((ques)=>{
          let Ques = {question:'',options:[],answer:-1}
          Ques.question = decode(ques.question); // decode - Remove Html entities from the text
          ques.incorrect_answers.forEach((q)=>{
            Ques.options.push(decode(q))
          });
          const answer_pos = Math.floor((Ques.options.length+1) * Math.random()); // Generating Random Pos to add the Answer in the options array
          Ques.options.splice( answer_pos, 0, ques.correct_answer) // Adds the answer to the random pos
          Ques.answer = answer_pos 
          Ques.difficulty = ques.difficulty// Pos of the answer in the options array
          questionArray.push(Ques);
        })
        setQuestions(questionArray)

        setCurrentQuestion(0) // Sets the Current Question to 0 So the The CurrentQuestion UseEffect Runs to set the inital Answer Index
      } 
    
    }
    catch(err){
      console.log(err)
    }
  }

  const setScoreList = async (value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem(LEADERBOARD_STORAGE_KEY, jsonValue)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(()=>{
    FetchQuestion()
  },[])
  useEffect(()=>{
    setIsDark(colorScheme!=='light')
  },[colorScheme])
  useEffect(()=>{
    if(questions.length >0)
      setCurrentAnswerIndex(questions[currentQuestion].answer)
    //console.log(questions)
  },[currentQuestion])
  useEffect(()=>{
    let isHighScore = false;
    if(IsCompleted)
    {    
      setIsTimerPaused(true)
      AsyncStorage.getItem(LEADERBOARD_STORAGE_KEY)
      .then((value)=>{
        let Leaderboard = value != null ? JSON.parse(value):[]
        //console.log("LeaderBoard UseEffect: ",Leaderboard)
        Leaderboard.forEach((ele)=>{
          if(ele.score<score)
            isHighScore = true;
        })
        if(isHighScore || Leaderboard.length<10)
          setIsNewHighScore(true)
        setLeaderboardList(Leaderboard);
      })
    }
  },[IsCompleted])
  useEffect(()=>{
    if(questions.length>0)
      if(Time<=0)
        setIsCompleted(true);
  },[Time])
  //////
  useEffect(()=>{
    let interval;
    if(questions&&questions.length>0)
    {
      setTime(60);
      interval = setInterval(() => {
        handleTimerInterval()
      }, 1000);
    }
    return () => clearInterval(interval);
  },[questions])
  const MarginBtm = 10;
  const handleOptionClick = (optionIndex)=>{
    setSelectedOption(optionIndex)
  }
  const handleContinue = ()=>{
    //console.log("Selected Option: ",SelectedOption,",Answer Index: ",currentAnswerIndex)
    if(questions.length)
    {
      if(currentAnswerIndex === SelectedOption)
      {
        // Score Update
        setScore((prev_score)=>prev_score+4)
        setCorrectPrediction((prev)=>prev+1)
      } 
        else
          setScore(prev_score=>prev_score-1)

      if(currentQuestion<4){
        setSelectedOption(-1)
        setCurrentQuestion((prev)=>prev+1) // Set the Current Question to the next Question
        setCurrentAnswerIndex(questions[currentQuestion].answer)
        setTime(60) // Set the Cyrrent Question Answer
      }
      else{
        setIsCompleted(true)
      }
    }
    
  }
  const handleNewHighscoreSubmit = ()=>{
    //console.log("HandleNewHighScore Prev : ",LeaderboardList)
    if(highScoreName.trim()!=''){
      let NewLeaderboardListItem = {
        name:highScoreName.trim(),
        score:score
      }
      setLeaderboardList((prev)=>{
        prev.push(NewLeaderboardListItem)
        prev.sort((a,b)=>b.score - a.score)
        if(prev.length>10)
          prev.length = 10;
        setScoreList(prev)
        return prev;
      })
     // console.log("HandleNewHighScore : ",LeaderboardList)
      setIsNewHighScore(false);
    }
  }
  const handleLeaderboardClick = ()=>{
    router.push('/leaderboard')
  }

  const handleTimerInterval = ()=>{
    if(!IsTimerPaused){
      setTime((prev)=>prev-1)
    }
  }

  const renderQuestion = ()=>{
    return(
      <Text style={{
        color:COLORS.PRIMARY_COLOR,
        fontWeight:'bold',
        fontSize:22,
        lineHeight:30,
        marginBottom:40
      }}>{currentQuestion!=-1&&questions.length!=0&&questions[currentQuestion].question}</Text>
    )
  }
  return (
    <SafeAreaView style={{  width:'100%',height:'100%',backgroundColor:(IsDark)?'#0F0F0F':'#FAFAFF'}}>
      <StatusBar />
      {IsCompleted &&
        <View style={{
          width:'100%',
          flex:1,
          alignItems:'center',
          justifyContent:'center',
          paddingHorizontal:10
        }}>
          {IsNewHighScore&&
            <View style={{
              width:'100%',
              paddingHorizontal:20,
              paddingVertical:30,
              justifyContent:'center',
              alignItems:'center',
              flexDirection:'column',
              backgroundColor:(IsDark)?COLORS.TERTIARY_COLOR:COLORS.ACTIVE_BTN,
              borderRadius:20
            }}>
               <Text style={{
                  fontWeight:'bold',
                  fontSize:23,
                  textAlign:'center',
                  color:COLORS.WHITE,
                  textTransform:'uppercase'
                }}>
                  New Highscore!
                </Text>
                <View style={{
                  marginTop:30,
                  justifyContent:'center',
                  gap:10,
                  alignItems:'center',
                  width:'100%'
                }}>
                  <TextInput 
                  placeholder='Your Name'
                  onChangeText={onChangeHighScoreName}
                  value={highScoreName}
                  style={{
                    backgroundColor:COLORS.WHITE,
                    justifyContent:'center',
                    alignItems:'center',
                    width:'100%',
                    height:50,
                    borderRadius:8,
                    paddingLeft:18,
                    color:COLORS.ACTIVE_BTN,
                    fontWeight:'300'
                  }}/>
                  <TouchableOpacity style={{
                    backgroundColor:COLORS.WHITE,
                    justifyContent:'center',
                    alignItems:'center',
                    width:'100%',
                    height:50,
                    borderRadius:8,
                  }}
                  onPress={handleNewHighscoreSubmit}>
                    <Text style={{
                      textAlign:'center',
                      color:COLORS.ACTIVE_BTN,
                      textTransform:'uppercase',
                      fontSize:16,
                      fontWeight:'500',
                    }}>Submit</Text>
                  </TouchableOpacity>
                </View>
            </View>
          }
          {!IsNewHighScore&&
              <View style={{
                width:'100%',
                flex:1,
                paddingHorizontal:10,
                paddingTop:150,
                justifyContent:'flex-start',
                alignItems:'center',
                flexDirection:'column',
                borderRadius:20
              }}>
                <Feather name="clipboard" size={150} color={(IsDark)?'white':COLORS.ACTIVE_BTN} />
                <Text style={{
                  fontSize:24,
                  fontWeight:'bold',
                  color:(IsDark)?'white':COLORS.ACTIVE_BTN,
                  marginTop:20
                }}>Results Of Quiz#1</Text>
                <View style={{
                  flexDirection:'column',
                  marginTop:90,
                  flex:1                
                }}>
                    <View style={{
                      backgroundColor:(IsDark)?'#171717':'#F4F3F6',
                      width:'100%',
                      alignItems:'center',
                      flexDirection:'row',
                      justifyContent:'space-between',
                      paddingHorizontal:16,
                      paddingVertical:16,
                      borderTopLeftRadius:8,
                      borderTopRightRadius:8
                    }}>

                        <View style={{ 
                            flex:2,
                            backgroundColor:(IsDark)?'#FFFFFF':'#EDE8E3',
                            alignItems:'center',
                            justifyContent:'center',
                            borderRadius:16,
                            width:32,
                            height:32,
                            maxWidth:32,
                            maxHeight:32,
                            borderBottomColor:'#EDE8E3',
                            borderBottomWidth:2
                          }}>
                          <Entypo name="star-outlined" size={16} color={(IsDark)?'#323232':COLORS.SECONDARY_COLOR} />
                        </View>
                        <Text style={{
                          flex:9,
                          paddingHorizontal:15,
                          fontSize:16,
                          fontWeight:'600',
                          textTransform:'uppercase',
                          color:COLORS.SECONDARY_COLOR
                        }}>Score Gained</Text>
                         <Text style={{
                          flex:1,
                          paddingHorizontal:15,
                          fontSize:16,
                          fontWeight:'500',
                          textTransform:'uppercase',
                          color:COLORS.SECONDARY_COLOR
                        }}>{score}</Text>
                    </View >
                    <View style={{
                      backgroundColor:(IsDark)?'#171717':'#F4F3F6',
                      width:'100%',
                      alignItems:'center',
                      flexDirection:'row',
                      justifyContent:'space-between',
                      paddingHorizontal:16,
                      paddingVertical:16,
                      borderBottomLeftRadius:8,
                      borderBottomRightRadius:8
                    }}>

                        <View style={{ 
                            flex:2,
                            backgroundColor:'#EDE8E3',
                            alignItems:'center',
                            justifyContent:'center',
                            borderRadius:16,
                            width:32,
                            height:32,
                            maxWidth:32,
                            maxHeight:32,
                            borderBottomColor:'#EDE8E3',
                            borderBottomWidth:2
                          }}>
                          <Ionicons name="checkmark-sharp" size={16} color={(IsDark)?'#323232':COLORS.SECONDARY_COLOR} />
                        </View>
                        <Text style={{
                          flex:9,
                          paddingHorizontal:15,
                          fontSize:16,
                          fontWeight:'500',
                          textTransform:'uppercase',
                          color:COLORS.SECONDARY_COLOR
                        }}>Correct Predictions</Text>
                         <Text style={{
                          flex:1,
                          paddingHorizontal:15,
                          fontSize:16,
                          fontWeight:'600',
                          textTransform:'uppercase',
                          color:COLORS.SECONDARY_COLOR
                        }}>{correctPrediction}</Text>
                    </View>
                </View>
                <View style={{
                      width:'100%',
                      flexDirection:'column',
                      alignItems:'center',
                      justifyContent:'center',
                      paddingBottom:40
                    }}>
                      <TouchableOpacity style={{
                        backgroundColor:(SelectedOption!=-1)?COLORS.ACTIVE_BTN:COLORS.INACTIVE_BTN,
                        width:'100%',
                        height:60,
                        borderRadius:8,
                        alignItems:'center',
                        justifyContent:'center',
                      }}
                      onPress={()=>router.push('/')}>
                            <Text style={{
                                color:COLORS.WHITE,
                                textTransform:'uppercase',
                                fontSize:16,
                                fontWeight:'500',
                              }}>Done</Text>
                      </TouchableOpacity>
                    </View>
              </View>
          }
        </View>
      }
        {!IsCompleted&&<View style={{
          alignItems:'center',
          justifyContent:'center',
          flexDirection:'column',
          justifyContent:'flex-start',
          marginTop:35,
          paddingHorizontal:12,
          width:'100%',
          height:'100%',
          paddingBottom:50
          }}>
            <View style={{
              flexDirection:'row',
              justifyContent:'space-between',
              alignItems:'center',
              paddingHorizontal:20,
              marginBottom:MarginBtm,
              width:'100%'
              }}>
              <View style={{
                flexDirection:'row',
                alignItems:'center',
                justifyContent:'space-around',
                backgroundColor:(IsDark)?'#171717':'white',
                borderRadius:10,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.8,
                shadowRadius: 40,
                elevation: 5,
                paddingHorizontal:10,
                paddingVertical:4
              }}>
                <Entypo name="star-outlined" size={16} color={COLORS.SECONDARY_COLOR} />
                <Text style={{
                  fontStyle:'italic',
                  fontWeight:'600',
                  fontSize:16,
                  marginLeft:10,
                  color:COLORS.SECONDARY_COLOR
                }}>{score}</Text>
              </View>
              <View style={{
                alignItems:'center',
                justifyContent:'center'
              }}>
                <Text style={{
                  fontWeight:'500',
                  fontSize:25,
                  textAlign:'center',
                  color:COLORS.SECONDARY_COLOR
                }}>{Time}s</Text>
              </View>
              <TouchableOpacity style={{
                alignItems:'center',
                justifyContent:'center',
                backgroundColor:(IsDark)?'#171717':'#F4F3F6',
                borderRadius:Math.round(Dimensions.get('window').width + Dimensions.get('window').height)*2,
                padding:5
              }}>
                <Link href={'/'}><Ionicons name="close" size={16} color={COLORS.SECONDARY_COLOR} /></Link>
              </TouchableOpacity>
            </View>
            <View style={{
              marginBottom:MarginBtm,
              flexDirection:'row',
              alignItems:'center',
              justifyContent:'flex-start',
              width:'100%',
              paddingHorizontal:20
            }}>
              <View style={{
                  height: 9.5,
                  backgroundColor: '#F4F3F6',
                  borderRadius: 10,
                  flex:8,
                  marginRight:10
                }}>
                <Animated.View style={{
                  height: '100%',
                  backgroundColor: '#376996',
                  borderRadius: 10,
                  width:Math.ceil((currentQuestion+1)*(275/5))
                }}/>
              </View>
              <Text style={{fontSize:12,color:(IsDark)?'white':'#757575',fontWeight:'500'}}>{`${currentQuestion+1}/5`}</Text>
            </View>
            <View>
              <Text style={{
                textAlign:'center',
                color:COLORS.PRIMARY_COLOR,
                fontWeight:'300',
                marginBottom:MarginBtm,
                paddingHorizontal:20
              }}>
              <Text style={{fontWeight:'500'}}> Format: </Text>
                <Text style={{fontWeight:'bold'}}> +4 </Text> 
                for correct answer, 
                <Text style={{fontWeight:'bold'}}> -1 </Text> 
                for incorrect
              </Text>
            </View>
            <View style={{
                backgroundColor:COLORS.TERTIARY_COLOR,
                flexDirection:'column',
                width:'100%',
                alignItems:'flex-start',
                borderRadius:15,
                shadowColor: (IsDark)?'white':'#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.8,
                shadowRadius: 40,
                elevation: 5,
                paddingBottom:5,
                paddingTop:20,
                paddingHorizontal:12,
                flex:1,
                marginTop:MarginBtm,
                justifyContent:'flex-start'
              }}>
              <Text style={{
                fontWeight:'300',
                fontSize:12,
                textAlign:'left',
                textTransform:'uppercase',
                color:COLORS.PRIMARY_COLOR
              }}>
                {currentQuestion!=-1&&questions.length!=0&&questions[currentQuestion].difficulty}
              </Text>
              {renderQuestion()}
            
              <View style={{width:'100%',flex:1}}>
               {
                currentQuestion!=-1&&questions.length!=0&&questions[currentQuestion].options.map((option,i)=>(
                  <Option key={i} optionText={option} optionIndex={i} OnClickListener={handleOptionClick} isSelected={SelectedOption===i} IsDark={IsDark}/>
                ))
               }
              </View>
              <View style={{
                    justifyContent:'center',
                    width:'100%',
                    paddingBottom:40
              }}>
                <TouchableOpacity style={{
                    backgroundColor:(SelectedOption!=-1)?COLORS.ACTIVE_BTN:COLORS.INACTIVE_BTN,
                    width:'100%',
                    height:60,
                    borderRadius:8,
                    alignItems:'center',
                    justifyContent:'center',
                  }}
                  disabled ={SelectedOption==-1}
                  onPress={handleContinue}>
                        <Text style={{
                            color:COLORS.WHITE,
                            textTransform:'uppercase',
                            fontSize:16,
                            fontWeight:'500',
                          }}>{currentQuestion!==4?'Continue':'Finish'}</Text>
                  </TouchableOpacity>
              </View>
            </View>
        </View>}
    </SafeAreaView>
  )
}
