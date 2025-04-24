import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useState } from "react"
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { RootStackParamList } from "../navigations/AppNavigators"
import FeatherIcon from 'react-native-vector-icons/Feather'

const MAX_ITEMS = 6

const HomeScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
    const [items, setItems] = useState(['', ''])    // 기본 2개

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
        navigation.navigate('ModeSelect', { options: items.filter((v) => v.trim()) })
    }

    return (
        <View style={styles.container}>
            <Text style={styles.guideText}>고민하는 항목 수에 따라 선택 방식이 달라져요!</Text>
            <ScrollView contentContainerStyle={styles.inputList}>
                {items.map((value, idx) => (
                    <TextInput
                        key={idx}
                        style={styles.input}
                        value={value}
                        placeholder={`항목 ${idx + 1}`}
                        onChangeText={(text) => handleInputChange(text, idx)}
                    />
                ))}
                {items.length < MAX_ITEMS && (
                    <TouchableOpacity style={styles.addBtn} onPress={handleAddInput}>
                        <FeatherIcon name="plus-circle" size={24} color="#227DBD" />
                        <Text style={styles.addText}>항목 추가</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
            <TouchableOpacity
                style={[styles.nextBtn, !canProceed && styles.nextBtnDisabled]}
                onPress={handleNext}
                disabled={!canProceed}
            >
                <Text style={styles.nextText}>다음</Text>
            </TouchableOpacity>
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    guideText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
    },
    inputList: {
        paddingBottom: 40,
    },
    input: {
        height: 45,
        borderColor: '#CCC',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        paddingHorizontal: 12,
        fontSize: 16,
    },
    addBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 4,
    },
    addText: {
        color: '#227DBD',
        fontWeight: 'bold',
    },
    nextBtn: {
        backgroundColor: '#227DBD',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 'auto',
    },
    nextBtnDisabled: {
        backgroundColor: '#B0C4DE',
    },
    nextText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
})