import { useState } from 'react'
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Animated, { Easing, interpolate, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { useOptionStore } from '../../store/optionStore'
import LottieView from 'lottie-react-native'
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../navigations/AppNavigators'

interface CoinResultProps {
    options: string[]
}

const { width } = Dimensions.get('window')
const COIN_SIZE = width * 0.6

const CoinResult: React.FC<CoinResultProps> = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
    const { options } = useOptionStore()
    const rotation = useSharedValue(0)
    const [selectedSide, setSelectedSide] = useState<number | null>(null)
    const [spining, setSpining] = useState(false)
    const [showResultModal, setShowResultModal] = useState(false)

    const handleSpin = () => {
        if(spining || options.length < 2) return

        setSpining(true)
        const randomSide = Math.random() < 0.5 ? 0 : 1
        const baseRotation = randomSide === 0 ? 0 : 180
        const spinRounds = 5
        const totalRotaion = 360 * spinRounds + baseRotation

        rotation.value = 0
        rotation.value = withTiming(totalRotaion, {
            duration: 3000,
            easing: Easing.out(Easing.cubic)
        }, (finished) => {
            if(finished) {
                runOnJS(setSelectedSide)(randomSide)
                runOnJS(setSpining)(false)
                runOnJS(startShowResultModal)()
            }
        })
    }

    const animatedStyle = useAnimatedStyle(() => {
        const rotateY = interpolate(rotation.value, [0, 360], [0, 360])
        return {
            transform: [{ rotateY: `${rotateY}deg`}]
        }
    })

    const frontTextStyle = useAnimatedStyle(() => {
        const rotateY = interpolate(rotation.value % 360, [0, 180], [0, 180])
        return {
            transform: [{ rotateY: `${rotateY}deg` }],
            backfaceVisibility: 'hidden',
        }
    })

    const backTextStyle = useAnimatedStyle(() => {
        const rotateY = interpolate(rotation.value % 360, [0, 180], [180, 360])
        return {
            transform: [{ rotateY: `${rotateY}deg` }],
            backfaceVisibility: 'hidden',
        }
    })

    const startShowResultModal = () => {
        setShowResultModal(true)
        setTimeout(() => {
            setShowResultModal(false)
        }, 5000)
    }

    const handleGoBack = () => {
        navigation.goBack()
    }

    return (
        <View style={styles.container}>
            <View style={styles.topAdBanner}>
                <BannerAd
                    unitId={TestIds.BANNER}
                    // unitId="ca-app-pub-4250906367423857/2252611861"
                    size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                    requestOptions={{
                        requestNonPersonalizedAdsOnly: true
                    }}
                    onAdFailedToLoad={(error) => {
                        console.log('배너 광고 Load 실패 : ', error)
                    }}
                />
            </View>
            <Animated.View style={[styles.coin, animatedStyle]}>
                <Image
                    source={require('../../../assets/images/coin.png')}
                    style={styles.coinImage}
                    resizeMode="contain"
                />
                <Animated.View style={[styles.textOverlay, frontTextStyle]}>
                    <Text style={styles.coinText}>{options[0]}</Text>
                </Animated.View>
                <Animated.View style={[styles.textOverlay, backTextStyle]}>
                    <Text style={styles.coinText}>{options[1]}</Text>
                </Animated.View>
            </Animated.View>
            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.button} onPress={handleGoBack}>
                    <Text style={styles.buttonText}>이전으로</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleSpin}>
                    <Text style={styles.buttonText}>동전 던지기</Text>                
                </TouchableOpacity>
            </View>
            <View style={styles.bottomAdBanner}>
                <BannerAd
                    unitId={TestIds.BANNER}
                    // unitId="ca-app-pub-4250906367423857/7025833498"
                    size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                    requestOptions={{
                        requestNonPersonalizedAdsOnly: true
                    }}
                    onAdFailedToLoad={(error) => {
                        console.log('배너 광고 Load 실패 : ', error)
                    }}
                />
            </View>
            {showResultModal && (
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
                        <Text style={styles.resultText}>{selectedSide !== null ? options[selectedSide] : ''}</Text>
                    </View>
                </View>
            )}
        </View>
    )
}

export default CoinResult

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EEF2F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    topAdBanner: {
        position: 'absolute',
        height: 60,
        top: 0,
        backgroundColor: '#EEE',
        justifyContent: 'center',
        alignItems: 'center'
    },
    coin: {
        width: COIN_SIZE,
        height: COIN_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    coinImage: {
        width: '100%',
        height: '100%',
    },
    textOverlay: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    coinText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
    },
    resultBox: {
        marginTop: 30,
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 12,
        elevation: 5,
    },
    buttonRow: {
        flexDirection: 'row',
        marginTop: 40,
        gap: 10
    },
    button: {
        backgroundColor: '#227DBD',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        elevation: 5
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
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
        zIndex: 10000,
    },
    resultModal: {
        backgroundColor: '#fff',
        paddingVertical: 20,
        paddingHorizontal: 30,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 30, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    resultText: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
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
