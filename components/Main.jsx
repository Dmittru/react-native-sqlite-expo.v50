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
    AddHotelDB, AddResortDB,
    createOrSyncTableHotels,
    createOrSyncTableResorts,
    deleteHotelDB, deleteResortDB,
    dropTableHotels,
    dropTableResorts,
    getTableHotels, getTableResorts,
} from "../lib/DatabaseActions/ActionsDB";
import {Picker} from "@react-native-picker/picker";

export default function Main({route, navigation}) {
    const {loggedInUser} = route.params;
    const [title, setTitle] = useState('');
    const [stars, setStars] = useState(0);
    const [hotelResort, setHotelResort] = useState('')
    const [showCreateHotel, setShowCreateHotel] = useState(false);
    const [hotels, setHotels] = useState([])
    const [hotelModal, setHotelModal] = useState(false)
    const [selectedHotel, setSelectedHotel] = useState('')
    const [showCreateResort, setShowCreateResort] = useState(false);
    const [resortName, setResortName] = useState('')
    const [resortPlace, setResortPlace] = useState('')
    const [resortServices, setResortServices] = useState('')
    const [resorts, setResorts] = useState([])
    const [selectedResort, setSelectedResort] = useState('')
    const [resortModal, setResortModal] = useState(false)

    useEffect(() => {
        // dropTableHotels();
        // dropTableResorts();
        createOrSyncTableHotels();
        createOrSyncTableResorts();
        getTableHotels(setHotels);
        getTableResorts(setResorts);
    }, []);

    const add = (ititle, istars, resId) => {
        if (!title || title === "" || !stars || stars <= 0 || stars > 5 || !resId || resId === "") {
            Alert.alert('Ошибка', 'Неверно введены значения для добавления новых записей. Звёзд должно быть от 1 до 5')
            return false;
        }
        AddHotelDB(ititle, istars, resId)
        getTableHotels(setHotels);
    };
    const addResort = (name, place, services) => {
        if (!name || name === "" || !place || place === "" || !services || services === "") {
            Alert.alert('Ошибка', 'Не все поля заполнены')
            return false;
        }
        AddResortDB(resortPlace, resortName, resortServices)
        getTableResorts(setResorts);
    };

    return (
        <View style={styles.container}>
            {Platform.OS === "web" ? (
                <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                    <Text style={styles.heading}>Expo SQlite не поддерживается в веб версии!</Text>
                </View>
            ) : (
                <ScrollView>
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
                            <View style={{width: 300, height: 50}}>
                                <Picker
                                    selectedValue={hotelResort}
                                    onValueChange={(itemValue, itemIndex) =>
                                        setHotelResort(itemValue)
                                    }
                                    style={{flex: 1, position: 'absolute', left: 0, right: 0}}
                                >
                                    {resorts.length > 0 && resorts.map((resort) => {
                                        return (
                                            <Picker.Item label={`${resort.name}`} value={`${resort.id}`}/>
                                        )
                                    })}
                                </Picker>
                            </View>
                            <TouchableOpacity
                                style={styles.buttonSpace}
                                onPress={() => {
                                    add(title, stars, hotelResort);
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
                            setShowCreateResort(prevState => !prevState)
                        }}
                    >
                        <Text
                            style={styles.buttonText}>{showCreateHotel ? 'Скрыть создание курорта' : 'Создать курорт'}</Text>
                    </TouchableOpacity>
                    {showCreateResort &&
                        <View style={styles.inputList}>
                            <TextInput
                                onChangeText={(text) => setResortPlace(text)}
                                placeholder="Место курорта"
                                style={styles.input}
                                value={resortPlace}
                            />
                            <TextInput
                                onChangeText={(text) => setResortName(text)}
                                placeholder="Название курорта"
                                style={styles.input}
                                value={resortName}
                            />
                            <TextInput
                                onChangeText={(text) => setResortServices(text)}
                                placeholder="Услуги курорта"
                                style={styles.input}
                                value={resortServices}
                            />
                            <TouchableOpacity
                                style={styles.buttonSpace}
                                onPress={() => {
                                    addResort(resortPlace, resortName, resortServices);
                                    setResortName("");
                                    setResortPlace("");
                                    setResortServices("");
                                    getTableResorts(setResorts);
                                }}
                            >
                                <Text style={styles.buttonText}>Создать новый курорт</Text>
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
                                        <Text style={styles.buttonText}>Отель</Text>
                                        <Text style={styles.buttonLowText}>Название: {hotel.title}</Text>
                                        <Text style={styles.buttonLowText}>⭐️{hotel.stars}</Text>
                                        <Text style={styles.buttonLowText}>Курорт: {hotel.resort_name}</Text>
                                    </TouchableOpacity>
                                </View>
                            )
                        }) :
                        <Text style={styles.sectionHeading}>
                            Нет ни одного отеля
                        </Text>
                    }
                    {resorts && resorts.length > 0 ? resorts.map((resort) => {
                            return (
                                <View style={styles.hotelCard} key={resort.id}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setSelectedResort(resort.id)
                                            setResortModal(true)
                                        }}
                                    >
                                        <Text style={styles.buttonText}>Курорт</Text>
                                        <Text style={styles.buttonLowText}>Место: {resort.place}</Text>
                                        <Text style={styles.buttonLowText}>️Название: {resort.name}</Text>
                                        <Text style={styles.buttonLowText}>️Услуги: {resort.services}</Text>
                                    </TouchableOpacity>
                                </View>
                            )
                        }) :
                        <Text style={styles.sectionHeading}>
                            Нет ни одного курорта
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
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={resortModal}
                        onRequestClose={() => {
                            setResortModal(prevValue => !prevValue);
                            setSelectedResort('')
                        }}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Text style={styles.modalText}>Действие:</Text>
                                <Button color={'#d70746'} title="Удалить" onPress={() => {
                                    setSelectedResort('')
                                    deleteResortDB(selectedResort)
                                    getTableResorts(setResorts)
                                    setResortModal(false);
                                }}/>
                                <Button color={'#b20000'} title="Закрыть" onPress={() => {
                                    setSelectedResort('')
                                    setResortModal(false);
                                }}/>
                            </View>
                        </View>
                    </Modal>
                </ScrollView>
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
    buttonLowText: {
        fontSize: 18,
        color: '#1C1C1C',
        textAlign: "center",
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