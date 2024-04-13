import React, {useState, useEffect} from "react";
import {
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Modal,
    Button, Alert,
} from "react-native";
import Constants from "expo-constants";
import {
    AddHotelDB, createOrSyncTableHotels, deleteHotelDB, dropTableHotels, getTableHotels,
} from "../lib/DatabaseActions/ActionsDB";

export default function Main({route, navigation}) {
    const {loggedInUser} = route.params;
    const [title, setTitle] = useState('');
    const [stars, setStars] = useState(0);
    const [showCreateHotel, setShowCreateHotel] = useState(false);
    const [hotels, setHotels] = useState([])
    const [hotelModal, setHotelModal] = useState(false)
    const [selectedHotel, setSelectedHotel] = useState('')

    useEffect(() => {
        // dropTableHotels();
        createOrSyncTableHotels();
        getTableHotels(setHotels)
    }, []);

    const add = (ititle, istars) => {
        if (!title || title === "" || !stars || stars <= 0 || stars > 5) {
            Alert.alert('Ошибка', 'Неверно введены значения для добавления новых записей. Звёзд должно быть от 1 до 5')
            return false;
        }
        AddHotelDB(ititle, istars)
        getTableHotels(setHotels);
    };

    return (
        <View style={styles.container}>
            {Platform.OS === "web" ? (
                <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                    <Text style={styles.heading}>Expo SQlite не поддерживается в веб версии!</Text>
                </View>
            ) : (
                <>
                    <TouchableOpacity
                        style={styles.buttonSpace}
                        onPress={() => {
                            setShowCreateHotel(prevState => !prevState)
                        }}
                    >
                        <Text
                            style={styles.buttonText}>{showCreateHotel ? 'Скрыть создание отеля' : 'Создать отель'}</Text>
                    </TouchableOpacity>
                    {showCreateHotel &&
                        <View style={styles.inputList}>
                            <TextInput
                                onChangeText={(text) => setTitle(text)}
                                placeholder="Название отеля"
                                style={styles.input}
                                value={title}
                            />
                            <Text style={{fontSize: 22, textAlign: 'center'}}>
                                Звёзды (от 1 до 5)
                            </Text>
                            <TextInput
                                onChangeText={(num) => {
                                    const star = Number(num)
                                    setStars(num)
                                }}
                                placeholder="Звёзды (от 1 до 5)"
                                keyboardType="numeric"
                                style={styles.input}
                                value={String(stars)}
                            />
                            <TouchableOpacity
                                style={styles.buttonSpace}
                                onPress={() => {
                                    add(title, stars);
                                    setTitle("");
                                    setStars(0)
                                }}
                            >
                                <Text style={styles.buttonText}>Создать новый отель</Text>
                            </TouchableOpacity>
                        </View>
                    }
                    <TouchableOpacity
                        style={styles.buttonSpace}
                        onPress={() => {
                            navigation.navigate('Database')
                        }}
                    >
                        <Text style={styles.buttonText}>Посмотреть БД</Text>
                    </TouchableOpacity>
                    {hotels && hotels.length > 0 ? hotels.map((hotel) => {
                            return (
                                <View style={styles.hotelCard} key={hotel.id}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setSelectedHotel(hotel.id)
                                            setHotelModal(true)
                                        }}
                                    >
                                        <Text style={styles.buttonText}>{hotel.title}</Text>
                                        <Text style={styles.buttonText}>⭐️{hotel.stars}</Text>
                                    </TouchableOpacity>
                                </View>
                            )
                        }) :
                        <Text style={styles.sectionHeading}>
                            Нет ни одного отеля
                        </Text>
                    }
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={hotelModal}
                        onRequestClose={() => {
                            setHotelModal(prevValue => !prevValue);
                            setSelectedHotel('')
                        }}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Text style={styles.modalText}>Действие:</Text>
                                <Button color={'#248179'} title="Перейти" onPress={() => {
                                    navigation.navigate('Hotel', {loggedInUser: loggedInUser, hotelId: selectedHotel});
                                    setHotelModal(false);
                                    setSelectedHotel('')
                                }}/>
                                <Button color={'#d70746'} title="Удалить" onPress={() => {
                                    setSelectedHotel('')
                                    deleteHotelDB(selectedHotel)
                                    getTableHotels(setHotels)
                                    setHotelModal(false);
                                }}/>
                                <Button color={'#b20000'} title="Закрыть" onPress={() => {
                                    setSelectedHotel('')
                                    setHotelModal(false);
                                }}/>
                            </View>
                        </View>
                    </Modal>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#ffffff",
        paddingTop: Constants.statusBarHeight,
        flex: 1,
        width: "100%",
        paddingHorizontal: 20,
    },
    heading: {
        fontSize: 20,
        textAlign: "center",
        fontWeight: "bold",
    },
    inputList: {
        alignItems: "center",
        flexDirection: "column",
        paddingHorizontal: 20,
    },
    input: {
        textAlign: 'center',
        width: '100%',
        marginBottom: 10,
        borderRadius: 20,
        borderColor: "#8d8f84",
        marginHorizontal: 16,
        backgroundColor: '#D6DAC8',
        borderWidth: 1,
        padding: 8,
        fontSize: 28,
    },
    sectionHeading: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 28,
        marginVertical: 8,
        color: '#343434',
    },
    centeredView: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        shadowColor: "#000",
        padding: 35,
        borderRadius: 20,
        backgroundColor: "white",
        alignItems: "center",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowRadius: 4,
        shadowOpacity: 0.25,
        elevation: 5,
    },
    modalText: {
        textAlign: "center",
        marginBottom: 15,
    },
    buttonSpace: {
        borderColor: "#9d9d9d",
        borderWidth: 1,
        padding: 2,
        width: '100%',
        borderRadius: 20,
        backgroundColor: "#f3f3f3",
        marginBottom: 5,
    },
    buttonText: {
        fontSize: 26,
        color: '#1C1C1C',
        textAlign: "center",
        fontWeight: 'bold',
    },
    hotelCard: {
        width: '100%',
        borderRadius: 20,
        borderColor: '#9d9d9d',
        borderWidth: 1,
        padding: 8,
        marginVertical: 10,
    }
});