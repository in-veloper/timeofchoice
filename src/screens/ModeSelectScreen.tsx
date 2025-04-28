import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { RootStackParamList } from "../navigations/AppNavigators"
import { BannerAd, BannerAdSize, TestIds } from "react-native-google-mobile-ads"

const icons = {
    roulette: require('../../assets/icons/roulette.png'),
    cards: require('../../assets/icons/cards.png'),
    coin: require('../../assets/icons/coin.png'),
    list: require('../../assets/icons/list.png')
}

const selectionModes = [
    { key: 'roulette', label: '룰렛', image: icons.roulette },
    { key: 'card', label: '카드', image: icons.cards },
    { key: 'coin', label: '동전', image: icons.coin },
    { key: 'list', label: '리스트', image: icons.list }
]

const ModeSelectScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
    const route = useRoute<RouteProp<RootStackParamList, 'ModeSelect'>>()
    const { options } = route.params

    const handleSelect = (mode: 'roulette' | 'card' | 'coin' | 'list') => {
        navigation.navigate('Result', { options, mode })
    }

    return (
        <View style={styles.outer}>
            <View style={styles.topAdBanner}>
                <BannerAd
                    unitId={TestIds.BANNER}
                    // unitId="ca-app-pub-4250906367423857/1897087321"
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
                <Text style={styles.title}>어떻게 선택할까요?</Text>
                <FlatList 
                    data={selectionModes}
                    keyExtractor={(item) => item.key}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => handleSelect(item.key as any)}
                        >
                            <Image source={item.image} style={styles.iconImage} resizeMode="contain"/>
                            <Text style={styles.label}>{item.label}</Text>
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={styles.list}
                />
                <View style={styles.bottomArea}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Text style={styles.backButtonText}>이전</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.bottomAdBanner}>
                <BannerAd
                    unitId={TestIds.BANNER}
                    // unitId="ca-app-pub-4250906367423857/8071854680"
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

export default ModeSelectScreen

const styles = StyleSheet.create({
    outer: {
        flex: 1,
        backgroundColor: '#FFF',
        justifyContent: 'space-between',
    },
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        padding: 20,
        paddingTop: 40,
        marginBottom: 70
    },
    topAdBanner: {
        height: 60,
        top: 0,
        backgroundColor: '#EEE',
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 24,
    },
    list: {
        justifyContent: 'center',
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    card: {
        flex: 1,
        backgroundColor: '#F0F8FF',
        borderRadius: 12,
        paddingVertical: 30,
        alignItems: 'center',
        marginHorizontal: 6,
        elevation: 3,
    },
    iconImage: {
        width: 60,
        height: 60,
        // marginBottom: 8,
    },
    label: {
        marginTop: 12,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#227DBD',
    },
    bottomArea: {
        alignItems: 'center',
        paddingBottom: 8,
        backgroundColor: '#FFF',
    },
    backButton: {
        backgroundColor: '#227DBD',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
        width: '90%',
        marginBottom: 8,
    },
    backButtonText: {
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