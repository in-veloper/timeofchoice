import { useMemo, useRef, useState } from 'react'
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import Animated, { Easing, interpolate, SharedValue, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { useOptionStore } from '../../store/optionStore'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../navigations/AppNavigators'
import Fontisto from 'react-native-vector-icons/Fontisto'
import LottieView from 'lottie-react-native'
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads'

interface CardResultProps {
    options?: string[]
}

const { width } = Dimensions.get('window')
const CARD_WIDTH = width * 0.35
const CARD_HEIGHT = CARD_WIDTH * 1.4
const MAX_CARDS = 6;

const shuffleArray = (array: string[]) => {
    return [...array].sort(() => Math.random() - 0.5)
}

const CardResult: React.FC<CardResultProps> = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
    const { options } = useOptionStore()
    const limitedOptions = useMemo(() => options?.slice(0, MAX_CARDS) ?? [], [options])
    const [shuffledOptions, setShuffledOptions] = useState<string[]>(shuffleArray(limitedOptions))
    const [firstFlippedIndex, setFirstFlippedIndex] = useState<number | null>(null)
    const [showResultModal, setShowResultModal] = useState(false)
    const [flipped, setFlipped] = useState<boolean[]>(() => Array(shuffledOptions.length).fill(false))
    const flip0 = useSharedValue(0)
    const flip1 = useSharedValue(0)
    const flip2 = useSharedValue(0)
    const flip3 = useSharedValue(0)
    const flip4 = useSharedValue(0)
    const flip5 = useSharedValue(0)

    const flips = [flip0, flip1, flip2, flip3, flip4, flip5]

    const handlePress = (index: number) => {
        if (!flipped[index]) {
            flips[index].value = withTiming(180, {
                duration: 600,
                easing: Easing.inOut(Easing.ease)
            })
    
            setFlipped(prev => {
                const updated = [...prev]
                updated[index] = true
                return updated
            })

            if(firstFlippedIndex === null) {
                setFirstFlippedIndex(index)
                setShowResultModal(true)
                setTimeout(() => {
                    setShowResultModal(false)
                }, 5000);
            }
        }
    }

    const resetFlips = () => {
        flips.forEach(flip => {
            flip.value = 0
        })
        setFirstFlippedIndex(null)
    }

    const handleReset = () => {
        const newShuffled = shuffleArray(limitedOptions)
        setShuffledOptions(newShuffled)
        setFlipped(Array(newShuffled.length).fill(false))
        resetFlips()
    }

    const handleGoBack = () => {
        navigation.goBack()
    }

    return (
        <View style={styles.container}>
            <View style={styles.topAdBanner}>
                <BannerAd
                    unitId={TestIds.BANNER}
                    // unitId="ca-app-pub-4250906367423857/9122880779"
                    size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                    requestOptions={{
                        requestNonPersonalizedAdsOnly: true
                    }}
                    onAdFailedToLoad={(error) => {
                        console.log('배너 광고 Load 실패 : ', error)
                    }}
                />
            </View>
            <ScrollView contentContainerStyle={styles.cardRow}>
                {shuffledOptions.map((item, index) => {
                    const frontStyle = useAnimatedStyle(() => {
                        const rotateY = interpolate(flips[index].value, [0, 180], [180, 360])
                        return {
                            transform: [{ rotateY: `${rotateY}deg` }],
                            backfaceVisibility: 'hidden',
                        }
                    })

                    const backStyle = useAnimatedStyle(() => {
                        const rotateY = interpolate(flips[index].value, [0, 180], [0, 180])
                        return {
                            transform: [{ rotateY: `${rotateY}deg` }],
                            backfaceVisibility: 'hidden',
                        }
                    })

                    return (
                        <TouchableWithoutFeedback key={index} onPress={() => handlePress(index)}>
                            <View style={styles.card}>
                                <Animated.View style={[styles.cardFace, backStyle]}>
                                    <View style={styles.cardBack}>
                                        {/* <Text style={styles.cardQuestion}>?</Text> */}
                                        <Fontisto name="question" size={35} color="#FFF"/>
                                    </View>
                                </Animated.View>
                                <Animated.View style={[styles.cardFace, frontStyle]}>
                                    <View style={styles.cardFront}>
                                        <Text style={styles.cardText}>{item}</Text>
                                    </View>
                                </Animated.View>
                            </View>
                        </TouchableWithoutFeedback>
                    )
                })}
                <View style={styles.buttonWrapper}>
                    <TouchableOpacity style={styles.button} onPress={handleGoBack}>
                        <Text style={styles.buttonText}>이전으로</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={handleReset}>
                        <Text style={styles.buttonText}>다시 뒤집기</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <View style={styles.bottomAdBanner}>
                <BannerAd
                    unitId={TestIds.BANNER}
                    // unitId="ca-app-pub-4250906367423857/4293210013"
                    size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                    requestOptions={{
                        requestNonPersonalizedAdsOnly: true
                    }}
                    onAdFailedToLoad={(error) => {
                        console.log('배너 광고 Load 실패 : ', error)
                    }}
                />
            </View>
            {showResultModal && firstFlippedIndex !== null && (
                <View style={styles.resultModalContainer}>
                    <LottieView
                        source={require('../../../assets/animations/roulette_result_animation.json')}
                        autoPlay
                        loop
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                        }}
                    />
                    <View style={styles.resultModal}>
                        <Text style={styles.resultText}>{shuffledOptions[firstFlippedIndex]}</Text>
                    </View>
                </View>    
            )}
        </View>
    )
}

export default CardResult

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#EEF2F5',
      paddingTop: 60,
    },
    topAdBanner: {
        position: 'absolute',
        height: 60,
        top: 0,
        backgroundColor: '#EEE',
        justifyContent: 'center',
        alignItems: 'center'
    },
    cardRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      columnGap: 20,
      paddingTop: 20,
      paddingBottom: 70
    },
    card: {
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      margin: 10,
      backfaceVisibility: 'hidden',
      borderRadius: 12,
      overflow: 'hidden',
      elevation: 8,
    },
    cardFace: {
        ...StyleSheet.absoluteFillObject,
        backfaceVisibility: 'hidden',
    },
    cardBack: {
      flex: 1,
      backgroundColor: '#333',
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: '#FFD700',
      borderWidth: 3,
      borderRadius: 12
    },
    cardFront: {
      flex: 1,
      backgroundColor: '#FFF',
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: '#CCC',
      borderWidth: 3,
      borderRadius: 12
    },
    cardText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333',
    },
    buttonWrapper: {
        flexDirection: 'row',
        marginTop: 30,
        marginBottom: 10,
        gap: 10,
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#227DBD',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 10,
        elevation: 5
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 18,
    },
    resultModalContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 100,
    },
    resultModal: {
        backgroundColor: '#fff',
        paddingVertical: 20,
        paddingHorizontal: 30,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    resultText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    bottomAdBanner: {
        position: 'absolute',
        height: 60,
        bottom: 0,
        backgroundColor: '#EEE',
        justifyContent: 'center',
        alignItems: 'center'
    }
})