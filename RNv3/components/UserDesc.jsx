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
import DateTimePicker from "@react-native-community/datetimepicker";
import {openDatabase} from "../lib/DatabaseActions/OpenDB";
import {
    AddItemDB,
    createOrSyncTableItems,
    deleteItemDB,
    doneItem, doneUpdate, dropTableItems,
    getItemsByDone,
    UndoneItem
} from "../lib/DatabaseActions/ActionsDB";

const db = openDatabase();

function Items({done: doneHeading, onPressItem, forceUpdate, loggedInUser}) {
    const [items, setItems] = useState(null);
    const [achieve, setAchieve] = useState(null)
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [selectedItemDone, setSelectedItemDone] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [detailsModalVisible, setDetailsModalVisible] = useState(false);

    useEffect(() => {
        getItemsByDone(doneHeading, loggedInUser, setItems)
    }, [modalVisible]);


    const heading = doneHeading ? "Завершённые" : "Задания";

    const handleItemPress = (id, done) => {
        setSelectedItemId(id);
        setSelectedItemDone(done)
        setModalVisible(true);
    };

    const markAsUndone = () => {
        UndoneItem(selectedItemId, setModalVisible, forceUpdate)
    };
    const markAsDone = (achieve) => {
        if (!achieve && typeof achieve !== 'string') {
            return;
        }
        console.log(achieve)
        doneItem(achieve, selectedItemId, setAchieve, setDetailsModalVisible, forceUpdate)
    };

    const deleteItem = () => {
        deleteItemDB(selectedItemId, setModalVisible, forceUpdate)
    };

    if (items === null || items.length === 0) {
        return null;
    }

    const groupedItems = items.reduce((acc, item) => {
        const dateKey = new Date(item.date).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
        });
        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }
        acc[dateKey].push(item);
        return acc;
    }, {});

    return (
        <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeading}>{heading}</Text>
            {Object.entries(groupedItems).map(([date, tasks]) => (
                <View key={date}>
                    <Text style={styles.headingSigns}>{date}</Text>
                    {tasks.map(({id, done, value, date, achieve}) => (
                        <TouchableOpacity
                            key={id}
                            onPress={() => handleItemPress(id, done)}
                            style={{
                                backgroundColor: done ? "#6a87a5" : "#fff",
                                borderColor: "#000",
                                borderWidth: 1,
                                padding: 8,
                                flexDirection: "column",
                            }}
                        >
                            <Text style={{color: done ? "#fff" : "#000", fontSize:18}}>
                                {value}
                            </Text>
                            {achieve && achieve.length > 0 &&
                                <Text style={{color: done ? "#fff" : "#000",fontSize:18}}>
                                    Комментарий: {achieve}
                                </Text>
                            }
                        </TouchableOpacity>
                    ))}
                </View>
            ))}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Действие:</Text>
                        {selectedItemDone ?
                            <Button title="Пометить невыполненным" onPress={markAsUndone}/> :
                            <Button title="Пометить выполненным" onPress={() => {
                                setModalVisible(false)
                                setDetailsModalVisible(true)
                            }}/>
                        }
                        <Button color={'#ff2525'} title="Удалить" onPress={deleteItem}/>
                        <Button color={'#ff0000'} title="Закрыть" onPress={() => {
                            setModalVisible(false);
                        }}/>
                    </View>
                </View>
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={detailsModalVisible}
                onRequestClose={() => {
                    setDetailsModalVisible(!detailsModalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Отметьте результаты:</Text>
                        <TextInput
                            onChangeText={(text) => setAchieve(text)}
                            placeholder="Введите..."
                            // style={styles.input}
                            value={achieve}
                        />
                        <Button color={'#2c87ee'} title="Готово" onPress={() => {
                            markAsDone(achieve);
                        }}/>
                        <Button color={'#ff0000'} title="Закрыть" onPress={() => {
                            setDetailsModalVisible(false);
                        }}/>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

export default function UserDesc({route}) {
    const {loggedInUser} = route.params;
    const [text, setText] = useState(null);
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [forceUpdate, forceUpdateId] = useForceUpdate();
    const [doneItemCount, setDoneItemCount] = useState(0); // State to store the count of done items

    useEffect(() => {
        doneUpdate(loggedInUser, setDoneItemCount);
    }, [forceUpdate]);

    useEffect(() => {
        // dropTableItems();
        createOrSyncTableItems();
    }, []);

    const add = (text, date, loggedInUser) => {
        if (!text || text === "" || !date || date === "") {
            Alert.alert('Ошибка', 'Неверно введены значения для добавления новых записей')
            return false;
        }
        console.log(text, date.toISOString());
        AddItemDB(text, date, loggedInUser, forceUpdate)
    };


    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === "ios");
        setDate(currentDate);
    };

    return (
        <View style={styles.container}>
            {Platform.OS === "web" ? (
                <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                    <Text style={styles.heading}>Expo SQlite не поддерживается в веб версии!</Text>
                </View>
            ) : (
                <>
                    <View style={styles.inputList}>
                        <TextInput
                            onChangeText={(text) => setText(text)}
                            placeholder="Добавить задание"
                            style={styles.input}
                            value={text}
                        />
                        <TouchableOpacity
                            style={styles.datePickerSpace}
                            onPress={() => setShowDatePicker((prevState) => !prevState)}
                        >
                            <Text>Выбрать дату: </Text>
                            <Text>
                                {date ? date.toLocaleString('ru-RU', {
                                    year: 'numeric',
                                    month: 'numeric',
                                    day: 'numeric'
                                }) : ''}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.buttonSpace}
                            onPress={() => {
                                add(text, date, loggedInUser);
                                setText("");
                                setDate(new Date());
                            }}
                        >
                            <Text style={styles.buttonText}>Добавить</Text>
                        </TouchableOpacity>
                    </View>
                    {Platform.OS === "ios" && showDatePicker && (
                        <View style={{flex: 1}}>
                            <DateTimePicker
                                value={date}
                                mode="date"
                                display="spinner"
                                onChange={handleDateChange}
                                style={{flex: 1}}
                            />
                        </View>
                    )}
                    {Platform.OS === "android" && showDatePicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display="spinner"
                            onChange={handleDateChange}
                            style={{flex: 1}}
                        />
                    )}
                    {JSON.stringify(doneItemCount) > 0 &&
                        <Text style={styles.sectionHeadingCounter}>Выполнено
                            заданий: {JSON.stringify(doneItemCount)}</Text>
                    }
                    <ScrollView style={styles.listArea}>
                        <Items
                            key={`forceupdate-todo-${forceUpdateId}`}
                            done={false}
                            loggedInUser={loggedInUser}
                            onPressItem={(id) =>
                                db.transaction(
                                    (tx) => {
                                        tx.executeSql(`update items set done = 1 where id = ?;`, [id]);
                                    },
                                    null,
                                    forceUpdate
                                )
                            }
                            forceUpdate={forceUpdate}
                        />
                        <Items
                            done
                            key={`forceupdate-done-${forceUpdateId}`}
                            loggedInUser={loggedInUser}
                            onPressItem={(id) =>
                                db.transaction(
                                    (tx) => {
                                        tx.executeSql(`delete from items where id = ?;`, [id]);
                                    },
                                    null,
                                    forceUpdate
                                )
                            }
                            forceUpdate={forceUpdate}
                        />
                    </ScrollView>
                </>
            )}
        </View>
    );
}

function useForceUpdate() {
    const [value, setValue] = useState(0);
    return [() => setValue(value + 1), value];
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#ffffff",
        flex: 1,
        paddingTop: Constants.statusBarHeight,
        width: "100%",
    },
    heading: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
    },
    flexRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    inputList: {
        flexDirection: "column",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    input: {
        width: '100%',
        borderColor: "rgba(75,113,152,0.8)",
        marginBottom: 10,
        borderRadius: 4,
        borderWidth: 1,
        marginHorizontal: 16,
        padding: 8,
        fontSize: 28,
    },
    listArea: {
        backgroundColor: "#ffffff",
        flex: 1,
        paddingTop: 16,
    },
    sectionContainer: {
        marginBottom: 16,
        marginHorizontal: 16,
        backgroundColor: "rgb(75,113,152)",
        borderTopStartRadius: 20,
        borderTopEndRadius: 20,
    },
    sectionHeading: {
        fontSize: 28,
        marginVertical: 8,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#f3f3f3',
    },
    sectionHeadingCounter: {
        fontSize: 18,
        marginVertical: 8,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    headingSigns: {
        padding: 5,
        fontWeight: "bold",
        textAlign: 'center',
        color: '#f3f3f3',
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
    },
    datePickerSpace: {
        width: '100%',
        borderColor: "rgba(75,113,152,0.8)",
        marginBottom: 10,
        borderRadius: 4,
        borderWidth: 1,
        marginHorizontal: 16,
        padding: 8,
        justifyContent: 'space-between',
        flexDirection: "row",
    },
    buttonSpace: {
        width: '100%',
        borderColor: "rgba(75,113,152,0.8)",
        borderRadius: 5,
        borderWidth: 1,
        padding: 2,
        backgroundColor: "#6a87a5",
    },
    buttonText: {
        textAlign: "center",
        fontSize: 24,
        color: '#f3f3f3',
        fontWeight: 'bold',
    }
});