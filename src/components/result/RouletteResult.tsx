import { useEffect, useState } from 'react'
import { Alert, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import Svg, { Circle, G, Path, Text as SvgText } from 'react-native-svg'

interface RouletteResultProps {
    options: string[]
}

const { width } = Dimensions.get('window')
const size = width * 0.8
const radius = size / 2
const center = { x: radius, y: radius }
const colors = ['#2D9C8B', '#EAC67A', '#F4A261', '#E76F51', '#D9A5B3', '#2A4D59']

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

const RouletteResult: React.FC<RouletteResultProps> = ({ options }) => {
    const rotation = useSharedValue(0)
    const sliceAngle = degreesPerOption(options.length)
    const [selectedLabel, setSelectedLabel] = useState('')

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
        }, () => {
            const finalRotation = nextRotation % 360
            // 여기에서: 0도(화살표) 기준, 원판이 얼마나 돌아갔는지 계산
            const adjustedRotation = (360 - finalRotation) % 360
            const sliceIndex = Math.floor(adjustedRotation / sliceAngle) % options.length
            runOnJS(setSelectedLabel)(options[sliceIndex])
        })
    }

    useEffect(() => {
        if (!options || options.length < 2) {
            Alert.alert('경고', '최소 2개 이상의 항목이 필요합니다.')
            return
        }

        spin()
    }, [])

    return (
        <View style={styles.container}>
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
                                    r={6}
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
                                            fontSize="14"
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
                <TouchableOpacity style={styles.button} onPress={spin}>
                    <Text style={styles.buttonText}>다시 돌리기</Text>
                </TouchableOpacity>
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
        backgroundColor: '#FFF',
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
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
    },
    button: {
        marginTop: 60,
        backgroundColor: '#227DBD',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
})
