import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useState } from "react"
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { RootStackParamList } from "../navigations/AppNavigators"
import FeatherIcon from 'react-native-vector-icons/Feather'
import { BannerAd, BannerAdSize, TestIds } from "react-native-google-mobile-ads"
import { useOptionStore } from "../store/optionStore"

const MAX_ITEMS = 6

const HomeScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
    const [items, setItems] = useState(['', ''])    // 기본 2개
    const { setOptions } = useOptionStore()

    const handleAddInput = () => {
        if(items.length >= MAX_ITEMS) {
            Alert.alert('안내', '최대 6개까지 입력할 수 있어요!')
            return
        }
        setItems([...items, ''])
    }

    const handleInputChange = (value: string, index: number) => {
        const updatedItems = [...items]
        updatedItems[index] = value
        setItems(updatedItems)
    }

    const canProceed = items.filter((text) => text.trim() !== '').length >= 2

    const handleNext = () => {
        if(!canProceed) return
        const filtered = items.filter((v) => v.trim())
        setOptions(filtered)
        navigation.navigate('ModeSelect')
    }

    const handleRemoveInput = (index: number) => {
        if(items.length <= 2) return
        const updatedItems = items.filter((_, i) => i !== index)
        setItems(updatedItems)
    }

    return (
        <View style={styles.outer}>
            <View style={styles.topAdBanner}>
                <BannerAd
                    unitId={TestIds.BANNER}
                    // unitId="ca-app-pub-4250906367423857/5759406751"
                    size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                    requestOptions={{
                        requestNonPersonalizedAdsOnly: true
                    }}
                    onAdFailedToLoad={(error) => {
                        console.log('배너 광고 Load 실패 : ', error)
                    }}
                />
            </View>
            <View style={styles.container}>
                <Text style={styles.title}>무엇을 선택할까요?</Text>
                <Text style={styles.guideText}>고민하는 항목 수에 따라 선택 방식이 달라져요!</Text>
                <ScrollView contentContainerStyle={styles.inputList}>
                    {items.map((value, idx) => (
                        <View key={idx} style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                value={value}
                                placeholder={`항목 ${idx + 1}`}
                                onChangeText={(text) => handleInputChange(text, idx)}
                            />
                            {items.length > 2 && idx >= 2 && (
                                <TouchableOpacity onPress={() => handleRemoveInput(idx)} style={styles.clearBtn}>
                                    <FeatherIcon name="x-circle" size={22} color="#FF5C5C" />
                                </TouchableOpacity>
                            )}
                        </View>
                    ))}
                    {items.length < MAX_ITEMS && (
                        <TouchableOpacity style={styles.addBtn} onPress={handleAddInput}>
                            <FeatherIcon name="plus-circle" size={36} color="#227DBD" />
                            {/* <Text style={styles.addText}>항목 추가</Text> */}
                        </TouchableOpacity>
                    )}
                </ScrollView>
                <View style={styles.bottomArea}>
                    <TouchableOpacity
                        style={[styles.nextBtn, !canProceed && styles.nextBtnDisabled]}
                        onPress={handleNext}
                        disabled={!canProceed}
                    >
                        <Text style={styles.nextText}>다음</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.bottomAdBanner}>
                <BannerAd
                    unitId={TestIds.BANNER}
                    // unitId="ca-app-pub-4250906367423857/4963239955"
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

export default HomeScreen

const styles = StyleSheet.create({
    outer: {
        flex: 1,
        backgroundColor: '#FFF',
        justifyContent: 'space-between'
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        marginTop: 50,
        marginBottom: 70
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 24,
    },
    topAdBanner: {
        height: 60,
        top: 0,
        backgroundColor: '#EEE',
        justifyContent: 'center',
        alignItems: 'center'
    },
    guideText: {
        fontSize: 17,
        color: '#666',
        marginBottom: 12,
        textAlign: 'center',
        paddingBottom: 20
    },
    inputList: {
        paddingBottom: 40,
    },
    inputWrapper: {
        position: 'relative',
        marginBottom: 10,
    },
    input: {
        height: 45,
        borderColor: '#CCC',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingRight: 36,
        fontSize: 16,
    },
    clearBtn: {
        position: 'absolute',
        right: 10,
        top: '50%',
        transform: [{ translateY: -10 }],
        zIndex: 10,
    },
    addBtn: {
        marginTop: 12,
        alignSelf: 'center',
    },
    nextBtn: {
        backgroundColor: '#227DBD',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
        width: '90%',
        marginBottom: 8,
    },
    nextBtnDisabled: {
        backgroundColor: '#B0C4DE',
    },
    bottomArea: {
        alignItems: 'center',
        paddingBottom: 8,
        backgroundColor: '#FFF',
    },
    nextText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
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