import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useOptionStore } from "../../store/optionStore"
import { useEffect, useState } from "react"
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { RootStackParamList } from "../../navigations/AppNavigators"
import LottieView from "lottie-react-native"
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"

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
        let totalSteps = options.length * 5 + targetIndex

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
            // setCurrentIndex(prev => (prev + 1) % options.length)
            // current++

            // if(current < totalSteps) {
            //     speed += 10                
            //     setTimeout(spin, speed)
            // }else{
            //     setIsSpining(false)
            //     const finalIndex = (current + 1) % options.length

            //     setSelectedIndex(finalIndex)
            //     setTimeout(() => setShowResultModal(true), 1500)
            //     setTimeout(() => setShowResultModal(false), 6500)
            // }
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
                anim.scale.value = withTiming(1.2, { duration: 150 })
                anim.translateY.value = withTiming(-5, { duration: 150 })
            }else{
                anim.scale.value = withTiming(1, { duration: 150 })
                anim.translateY.value = withTiming(0, { duration: 150 })
            }
        })
    }, [currentIndex])

    return (
        <View style={styles.container}>
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
                        <Text style={styles.itemText}>{option}</Text>
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
        backgroundColor: '#fff',
        paddingVertical: 30,
        paddingHorizontal: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 20,
    },
    resultText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
})