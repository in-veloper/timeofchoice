import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useOptionStore } from "../../store/optionStore"
import { useEffect, useState } from "react"
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { RootStackParamList } from "../../navigations/AppNavigators"
import LottieView from "lottie-react-native"
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import { BannerAd, BannerAdSize, TestIds } from "react-native-google-mobile-ads"

interface ListResultProps {
    options: string[]
}

const { width } = Dimensions.get('window')
const size = width * 0.8

const ListResult: React.FC<ListResultProps> = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
    const { options } = useOptionStore()
    const [currentIndex, setCurrentIndex] = useState<number>(0)
    const [isSpining, setIsSpining] = useState<boolean>(false)
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
    const [showResultModal, setShowResultModal] = useState<boolean>(false)

    const startSpin = () => {
        if(isSpining || options.length === 0) return

        setIsSpining(true)

        let spinCount = 0
        let speed = 50
        const targetIndex = Math.floor(Math.random() * options.length)
        let totalSteps = options.length * 7 + targetIndex

        const spin = () => {
            setCurrentIndex(prev => {
                const nextIndex = (prev + 1) % options.length
                spinCount++

                if(spinCount < totalSteps) {
                    speed += 10
                    setTimeout(spin, speed)
                }else{
                    setIsSpining(false)

                    setTimeout(() => {
                        setSelectedIndex(nextIndex)
                        setShowResultModal(true)
                    }, 1500)

                    setTimeout(() => {
                        setShowResultModal(false)
                    }, 6500);
                }

                return nextIndex
            })
        }

        spin()
    }

    const handleGoBack = () => {
        navigation.goBack()
    }

    const animations = options.map(() => ({
        scale: useSharedValue(1),
        translateY: useSharedValue(0)
    }))

    useEffect(() => {
        animations.forEach((anim, idx) => {
            if(idx === currentIndex) {
                anim.scale.value = withTiming(1.05, { duration: 150 })
                anim.translateY.value = withTiming(-5, { duration: 150 })
            }else{
                anim.scale.value = withTiming(1, { duration: 150 })
                anim.translateY.value = withTiming(0, { duration: 150 })
            }
        })
    }, [currentIndex])

    return (
        <View style={styles.container}>
            <View style={styles.topAdBanner}>
                <BannerAd
                    unitId={TestIds.BANNER}
                    // unitId="ca-app-pub-4250906367423857/1604920192"
                    size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                    requestOptions={{
                        requestNonPersonalizedAdsOnly: true
                    }}
                    onAdFailedToLoad={(error) => {
                        console.log('배너 광고 Load 실패 : ', error)
                    }}
                />
            </View>
            {options.map((option, index) => {
                const animatedStyle = useAnimatedStyle(() => ({
                    transform: [
                        { scale: animations[index].scale.value },
                        { translateY: animations[index].translateY.value },
                    ],
                }))

                return (
                    <Animated.View
                        key={index}
                        style={[
                            styles.item,
                            index === currentIndex && styles.highlightedItem,
                            animatedStyle
                        ]}
                    >
                        <Text style={[styles.itemText, index === currentIndex && styles.highlightedItemText]}>{option}</Text>
                    </Animated.View>
                )
            })}

            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.button} onPress={handleGoBack}>
                    <Text style={styles.buttonText}>이전으로</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={startSpin}>
                    <Text style={styles.buttonText}>선택 시작</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.bottomAdBanner}>
                <BannerAd
                    unitId={TestIds.BANNER}
                    // unitId="ca-app-pub-4250906367423857/7639604255"
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
                            height: '100%'
                        }}
                    />
                    <View style={styles.resultModal}>
                        <Text style={styles.resultText}>{selectedIndex !== null ? options[selectedIndex] : ''}</Text>
                    </View>
                </View>
            )}
        </View>
    )
}

export default ListResult

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 20,
        backgroundColor: "#F0F0F0"
    },
    topAdBanner: {
        position: 'absolute',
        height: 60,
        top: 0,
        backgroundColor: '#EEE',
        justifyContent: 'center',
        alignItems: 'center'
    },
    item: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginVertical: 10,
        borderRadius: 8,
        backgroundColor: "#FFF",
        width: size,
        alignItems: "center",
        justifyContent: "center",
        elevation: 3,
    },
    highlightedItem: {
        backgroundColor: "#227DBD", 
    },
    itemText: {
        fontSize: 20,
        color: "#333",
        fontWeight: "bold",
    },
    highlightedItemText: {
        color: '#FFF'
    },
    buttonRow: {
        flexDirection: 'row',
        marginTop: 30,
        gap: 10
    },
    button: {
        backgroundColor: "#227DBD",
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 12,
        elevation: 5,
    },
    buttonText: {
        color: "#FFF",
        fontSize: 18,
        fontWeight: "bold",
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
        backgroundColor: '#FFF',
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
        borderColor: '#DDD',
    },
    resultText: {
        fontSize: 28,
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