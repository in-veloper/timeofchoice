import { useEffect, useState } from 'react'
import { Alert, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import Svg, { Circle, G, Path, Text as SvgText } from 'react-native-svg'
import LottieView from 'lottie-react-native'
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../navigations/AppNavigators'
import { useOptionStore } from '../../store/optionStore'

interface RouletteResultProps {
    options: string[]
}

const { width } = Dimensions.get('window')
const size = width * 0.8
const radius = size / 2
const center = { x: radius, y: radius }
const colors = ['#FF6B6B', '#4ECDC4', '#5567DC', '#7D5A9D', '#FF9F1C', '#2A9D8F']

const degreesPerOption = (count: number) => 360 / count

const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0
    return {
        x: centerX + radius * Math.cos(angleInRadians),
        y: centerY + radius * Math.sin(angleInRadians)
    }
}

const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle)
    const end = polarToCartesian(x, y, radius, startAngle)
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'
  
    return [
        `M ${x} ${y}`,
        `L ${start.x} ${start.y}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
        'Z'
    ].join(' ')
}

const RouletteResult: React.FC<RouletteResultProps> = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
    const { options } = useOptionStore()
    const rotation = useSharedValue(0)
    const sliceAngle = degreesPerOption(options.length)
    const [selectedLabel, setSelectedLabel] = useState('')
    const [showResultModal, setShowResultModal] = useState(false)

    const animatedStyle = useAnimatedStyle(() => {
        'worklet'
        return {
            transform: [{ rotateZ: `${rotation.value}deg` }]
        }
    })

    const spin = () => {
        const rounds = 5
        const randomRotation = Math.random() * 360
        const nextRotation = rotation.value + 360 * rounds + randomRotation

        rotation.value = withTiming(nextRotation, {
            duration: 5000,
            easing: Easing.bezier(0.25, 1, 0.5, 1)
        }, (isFinished) => {
            if (isFinished) {
                const finalRotation = nextRotation % 360
                const adjustedRotation = (360 - finalRotation) % 360
                const sliceIndex = Math.floor(adjustedRotation / sliceAngle) % options.length
          
                runOnJS(setSelectedLabel)(options[sliceIndex])
                runOnJS(startShowResultModal)()
            }
        })
    }

    const startShowResultModal = () => {
        setShowResultModal(true)
        setTimeout(() => {
            setShowResultModal(false)
        }, 5000);
    }

    const handleGoBack = () => {
        navigation.goBack()
    }

    return (
        <View style={styles.container}>
            <View style={styles.topAdBanner}>
                <BannerAd
                    unitId={TestIds.BANNER}
                    // unitId="ca-app-pub-4250906367423857/4132609676"
                    size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                    requestOptions={{
                        requestNonPersonalizedAdsOnly: true
                    }}
                    onAdFailedToLoad={(error) => {
                        console.log('배너 광고 Load 실패 : ', error)
                    }}
                />
            </View>
            <View style={styles.wheelWrapper}>
                <Svg width={size + 60} height={size + 60} style={styles.fixedSvg}>
                    <G>
                        <Circle
                            cx={(size + 60) / 2}
                            cy={(size + 60) / 2}
                            r={(size + 60) / 2}
                            fill="#1F2C3A"
                        />
                        {[...Array(12)].map((_, i) => {
                            const angle = (360 / 12) * i
                            const pos = polarToCartesian((size + 60) / 2, (size + 60) / 2, (size + 60) / 2 - 17, angle)
                            return (
                                <Circle
                                    key={i}
                                    cx={pos.x}
                                    cy={pos.y}
                                    r={5}
                                    fill="#FFF"
                                />
                            )
                        })}
                    </G>
                </Svg>
                <Image source={require('../../../assets/icons/pin.png')} style={styles.pinIcon} />
                <View style={styles.centerDisplay} pointerEvents="none">
                    <Text style={styles.centerText}>{selectedLabel || 'START'}</Text>
                </View>
                <View style={styles.outerRim} />
                <Animated.View renderToHardwareTextureAndroid={true} style={[styles.wheelContainer, animatedStyle]}>
                    <Svg width={size} height={size}>
                        <G origin={`${center.x}, ${center.y}`}>
                            {options.map((label, i) => {
                                const startAngle = i * sliceAngle
                                const endAngle = (i + 1) * sliceAngle
                                const path = describeArc(center.x, center.y, radius, startAngle, endAngle)
                                const textAngle = (startAngle + endAngle) / 2
                                const textPos = polarToCartesian(center.x, center.y, radius * 0.65, textAngle)

                                return (
                                    <G key={`slice-${i}`}>
                                        <Path d={path} fill={colors[i % colors.length]} stroke="#f5f5f5" strokeWidth={1.5} />
                                        <SvgText
                                            x={textPos.x}
                                            y={textPos.y}
                                            fill="#FFF"
                                            fontSize="16"
                                            fontWeight="bold"
                                            textAnchor="middle"
                                            alignmentBaseline="middle"
                                        >
                                            {label}
                                        </SvgText>
                                    </G>
                                )
                            })}
                        </G>
                    </Svg>
                </Animated.View>
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.button} onPress={handleGoBack}>
                        <Text style={styles.buttonText}>이전으로</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={spin}>
                        <Text style={styles.buttonText}>룰렛 돌리기</Text>
                    </TouchableOpacity>
                </View>
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
                        <Text style={styles.resultText}>{selectedLabel}</Text>
                    </View>
                </View>
            )}
            <View style={styles.bottomAdBanner}>
                <BannerAd
                    unitId={TestIds.BANNER}
                    // unitId="ca-app-pub-4250906367423857/2819528005"
                    size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                    requestOptions={{
                        requestNonPersonalizedAdsOnly: true
                    }}
                    onAdFailedToLoad={(error) => {
                        console.log('배너 광고 Load 실패 : ', error)
                    }}
                />
            </View>
        </View>
    )
}

export default RouletteResult

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EEF2F5',
    },
    topAdBanner: {
        position: 'absolute',
        height: 60,
        top: 0,
        backgroundColor: '#EEE',
        justifyContent: 'center',
        alignItems: 'center'
    },
    backgroundRim: {
        position: 'absolute',
        top: 128,
        width: size + 35,
        height: size + 35,
        borderRadius: (size + 120) / 2,
        backgroundColor: '#1F2C3A',
        zIndex: 0,
    },
    wheelWrapper: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    fixedSvg: {
        position: 'absolute',
        top: -30,
        zIndex: 1,
    },
    outerRim: {
        position: 'absolute',
        width: size + 120,
        height: size + 120,
        borderRadius: (size + 60) / 2,
        backgroundColor: '#1F2C3A',
        zIndex: -2,
    },
    pinIcon: {
        position: 'absolute',
        width: 50,
        height: 50,
        top: -30,
        zIndex: 200,
        resizeMode: 'contain'
    },
    wheelContainer: {
        width: size,
        height: size,
        borderRadius: radius,
        overflow: 'hidden',
        backgroundColor: '#f5f5f5',
        elevation: 6,
        borderWidth: 4,
        borderColor: '#222',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100
    },
    centerDisplay: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#F96112',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 10,
        borderWidth: 7,
        borderColor: '#FFF',
        zIndex: 999,
        top: radius - 50,
        left: radius - 50,
    },
    centerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
    },
    buttonRow: {
        flexDirection: 'row',
        marginTop: 60,
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
        color: '#fff',
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
