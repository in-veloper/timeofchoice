import { RouteProp, useRoute } from "@react-navigation/native"
import { View } from "react-native"
import { RootStackParamList } from "../navigations/AppNavigators"
import RouletteResult from "../components/result/RouletteResult"
import CardResult from "../components/result/CardResult"
import CoinResult from "../components/result/CoinResult"
import ListResult from "../components/result/ListResult"
import { useEffect } from "react"
import { useOptionStore } from "../store/optionStore"

const ResultScreen = () => {
    const route = useRoute<RouteProp<RootStackParamList, 'Result'>>()
    const { mode } = route.params
    const { options } = useOptionStore()

    if(mode === 'roulette') return <RouletteResult options={options} />
    if(mode === 'card') return <CardResult options={options} />
    if(mode === 'coin') return <CoinResult options={options} />
    if(mode === 'list') return <ListResult options={options} />

    return (
        <View />
    )
}

export default ResultScreen