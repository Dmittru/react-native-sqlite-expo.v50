import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, TextInput, Button, Modal, Platform, Alert} from "react-native";
import {
    addApartsDB,
    createOrSyncTableApartments,
    createOrSyncTableComments,
    createOrSyncTableHotels,
    deleteApartsBooksDB,
    deleteApartsDB,
    deleteHotelDB,
    dropTableApartments,
    dropTableComments,
    dropTableHotels,
    getAllHotelInfo,
    getTableHotels, updateApartsBooksDB
} from "../lib/DatabaseActions/ActionsDB";
import DateTimePicker from "@react-native-community/datetimepicker";

const HotelView = ({route, navigation,}) => {
    const {loggedInUser, hotelId} = route.params;
    const [editAparts, setEditAparts] = useState(false)
    const [apartNum, setApartNum] = useState(0)
    const [apartPrice, setApartPrice] = useState(0)
    const [hotel, setHotel] = useState({hotel: {}, apartments: []})
    const [apartsModal, setApartsModal] = useState(false)
    const [bookDate, setBookDate] = useState(new Date())
    const [apartsBookModal, setApartsBookModal] = useState(false)
    const [apartsDatepickerModal, setApartsDatepickerModal] = useState(false)
    const [selectedAparts, setSelectedAparts] = useState('')

    useEffect(() => {
        // dropTableHotels()
        // dropTableApartments()
        // dropTableComments()
        createOrSyncTableHotels();
        createOrSyncTableComments();
        createOrSyncTableApartments();
        getAllHotelInfo(hotelId, setHotel);
    }, []);
    // console.log(hotel)
    return (
        <View>
            <Text style={styles.heading}>
                Отель {hotel.hotel.title} - {hotel.hotel.stars}⭐️
            </Text>
            <TouchableOpacity
                style={styles.buttonSpace}
                onPress={() => {
                    setEditAparts(prevState => !prevState)
                }}
            >
                <Text style={styles.buttonText}>
                    {editAparts ? 'Скрыть создание апартаментов' : 'Создать апартаменты'}
                </Text>
            </TouchableOpacity>
            {editAparts &&
                <View style={styles.inputList}>
                    <Text style={{fontSize: 22, textAlign: 'center'}}>
                        № Апартаментов
                    </Text>
                    <TextInput
                        onChangeText={(num) => {
                            const Anum = Number(num)
                            if (Anum < 0) {
                                setApartNum(0)
                            } else {
                                setApartNum(Anum)
                            }
                        }}
                        placeholder="Номер апартаментов"
                        keyboardType="numeric"
                        style={styles.input}
                        value={String(apartNum)}
                    />
                    <Text style={{fontSize: 22, textAlign: 'center'}}>
                        Цена за апартаменты
                    </Text>
                    <TextInput
                        onChangeText={(num) => {
                            const price = Number(num)
                            if (price < 0) {
                                setApartPrice(0)
                            } else {
                                setApartPrice(price)
                            }
                        }}
                        placeholder="Цена апартаментов"
                        keyboardType="numeric"
                        style={styles.input}
                        value={String(apartPrice)}
                    />
                    <TouchableOpacity
                        style={styles.buttonSpace}
                        onPress={() => {
                            addApartsDB(apartNum, apartPrice, hotelId);
                            setApartNum(0);
                            setApartPrice(0)
                            getAllHotelInfo(hotelId, setHotel)
                        }}
                    >
                        <Text style={styles.buttonText}>Создать апартаменты</Text>
                    </TouchableOpacity>
                </View>
            }
            <Text style={styles.centeredText}>
                Апартаментов {hotel.apartments.length}
            </Text>
            {
                hotel.apartments.map((apart) => {
                    return (
                        <TouchableOpacity
                            onPress={() => {
                                setSelectedAparts(apart.id)
                                setApartsModal(true)
                            }}
                            key={apart.id}
                            style={styles.apartCard}
                        >
                            <Text style={styles.centeredText}>Апартаменты №{apart.number}</Text>
                            <Text style={styles.centeredText}>Цена - {apart.price}</Text>
                            {/*add apart.date ? =>*/}
                            {apart.dateOfOccupied && apart.dateOfOccupied.length > 0 &&
                                <Text style={styles.centeredText}>ЗАНЯТ ДО - {apart.dateOfOccupied}</Text>
                            }
                        </TouchableOpacity>
                    )
                })
            }
            <Modal
                animationType="slide"
                transparent={true}
                visible={apartsModal}
                onRequestClose={() => {
                    setApartsModal(prevValue => !prevValue);
                    setSelectedAparts('')
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Действие:</Text>
                        <Button color={'#248179'} title="Забронировать до числа" onPress={() => {
                            setApartsBookModal(true)
                        }}/>
                        <Button color={'#248179'} title="Перейти к комментариям" onPress={() => {
                            navigation.navigate('Comments', {loggedInUser: loggedInUser, apartsId: selectedAparts});
                            setApartsModal(false);
                            setSelectedAparts('')
                        }}/>
                        <Button color={'#d70746'} title="Удалить" onPress={() => {
                            setSelectedAparts('')
                            deleteApartsDB(selectedAparts)
                            getAllHotelInfo(hotelId, setHotel);
                            setApartsModal(false);
                        }}/>
                        <Button color={'#b20000'} title="Закрыть" onPress={() => {
                            setSelectedAparts('')
                            setApartsModal(false);
                        }}/>
                    </View>
                </View>
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={apartsBookModal}
                onRequestClose={() => {
                    setApartsBookModal(false);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Выбрать дату до какого забронировано:</Text>
                        <Text>{bookDate.toLocaleString()}</Text>
                        {(Platform.OS === "ios" || Platform.OS === "android") && apartsDatepickerModal && (
                            <DateTimePicker
                                value={bookDate}
                                mode="date"
                                display="spinner"
                                onChange={(e, d) => {
                                    if (new Date(d) < new Date()) {
                                        Alert.alert('Ошибка выбора даты', 'Нельзя забронировать в прошлом')
                                        return;
                                    } else {
                                        setBookDate(d)
                                    }
                                    setApartsDatepickerModal(false)
                                }}
                                style={{flex: 1}}
                            />
                        )}
                        <Button color={'#248179'} disabled={!bookDate || bookDate.length <= 0}
                                title="Перевыбрать дату" onPress={() => {
                            setApartsDatepickerModal(true);
                        }}/>
                        <Button color={'#248179'} disabled={!bookDate || bookDate.length <= 0}
                                title="Забронировать до числа" onPress={() => {
                            updateApartsBooksDB(bookDate, selectedAparts)
                            getAllHotelInfo(hotelId, setHotel);
                            setBookDate(new Date())
                            setApartsBookModal(false);
                        }}/>
                        <Button color={'#d70746'} title="Удалить брони" onPress={() => {
                            updateApartsBooksDB('', selectedAparts)
                            getAllHotelInfo(hotelId, setHotel);
                            setApartsBookModal(false);
                        }}/>
                        <Button color={'#b20000'} title="Закрыть" onPress={() => {
                            setApartsBookModal(false);
                        }}/>
                    </View>
                </View>
            </Modal>
        </View>
    );
};
const styles = StyleSheet.create({
    heading: {
        fontSize: 20,
        textAlign: "center",
        fontWeight: "bold",
    },
    centeredText: {
        fontSize: 20,
        textAlign: "center",
    },
    buttonText: {
        fontSize: 26,
        color: '#1C1C1C',
        textAlign: "center",
        fontWeight: 'bold',
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
    inputList: {
        alignItems: "center",
        flexDirection: "column",
        paddingHorizontal: 20,
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
    apartCard: {
        marginVertical: 10,
        padding: 8,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#000',
        marginHorizontal: 20,
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
})
export default HotelView;