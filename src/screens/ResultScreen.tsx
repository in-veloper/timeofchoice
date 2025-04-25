import { RouteProp, useRoute } from "@react-navigation/native"
import { View } from "react-native"
import { RootStackParamList } from "../navigations/AppNavigators"
import RouletteResult from "../components/result/RouletteResult"
import CardResult from "../components/result/CardResult"
import CoinResult from "../components/result/CoinResult"
import ListResult from "../components/result/ListResult"

const ResultScreen = () => {
    const route = useRoute<RouteProp<RootStackParamList, 'Result'>>()
    const { options, mode } = route.params

    if(mode === 'roulette') return <RouletteResult options={options} />
    if(mode === 'card') return <CardResult options={options} />
    if(mode === 'coin') return <CoinResult options={options} />
    if(mode === 'list') return <ListResult options={options} />

    return (
        <View>

        </View>
    )
}

export default ResultScreen