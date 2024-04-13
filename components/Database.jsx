import React, {useState} from 'react';
import {View, Text, StyleSheet, FlatList} from "react-native";
import {getTableApartments, getTableComments, getTableHotels, getTableUsers} from "../lib/DatabaseActions/ActionsDB";

const Database = () => {
    const [users, setUsers] = useState([])
    const [hotels, setHotels] = useState([])
    const [apartments, setApartments] = useState([])
    const [comments, setComments] = useState([])
    getTableUsers(setUsers)
    getTableHotels(setHotels)
    getTableApartments(setApartments)
    getTableComments(setComments)
    const renderItemUser = ({ item }) => (
        <View style={styles.row}>
            <Text style={styles.cell}>{item.id}</Text>
            <Text style={styles.cell}>{item.login}</Text>
            <Text style={styles.cell}>{item.password}</Text>
        </View>
    );
    const renderItemHotels = ({ item }) => (
        <View style={styles.row}>
            <Text style={styles.cell}>{item.id}</Text>
            <Text style={styles.cell}>{item.title}</Text>
            <Text style={styles.cell}>{item.stars}</Text>
        </View>
    );
    const renderItemApartments = ({ item }) => (
        <View style={styles.row}>
            <Text style={styles.cell}>{item.id}</Text>
            <Text style={styles.cell}>{item.number}</Text>
            <Text style={styles.cell}>{item.dateOfOccupied}</Text>
            <Text style={styles.cell}>{item.price}</Text>
            <Text style={styles.cell}>{item.hotelId}</Text>
        </View>
    );
    const renderItemComments = ({ item }) => (
        <View style={styles.row}>
            <Text style={styles.cell}>{item.id}</Text>
            <Text style={styles.cell}>{item.apartmentId}</Text>
            <Text style={styles.cell}>{item.user}</Text>
            <Text style={styles.cell}>{item.date}</Text>
            <Text style={styles.cell}>{item.comment}</Text>
        </View>
    );
    return (
        <View>
            <Text style={styles.sectionHeadingCounter}>
                Пользователи
            </Text>
            <View style={styles.container}>
                <View style={styles.headerRow}>
                    <Text style={[styles.cell, styles.headerCell]}>ID</Text>
                    <Text style={[styles.cell, styles.headerCell]}>Login</Text>
                    <Text style={[styles.cell, styles.headerCell]}>Password</Text>
                </View>
                <FlatList
                    data={users}
                    renderItem={renderItemUser}
                    keyExtractor={item => item.id.toString()}
                />
            </View>
            <Text style={styles.sectionHeadingCounter}>
                Отели
            </Text>
            <View style={styles.container}>
                <View style={styles.headerRow}>
                    <Text style={[styles.cell, styles.headerCell]}>ID</Text>
                    <Text style={[styles.cell, styles.headerCell]}>Title</Text>
                    <Text style={[styles.cell, styles.headerCell]}>Stars</Text>
                </View>
                <FlatList
                    data={hotels}
                    renderItem={renderItemHotels}
                    keyExtractor={item => item.id.toString()}
                />
            </View>
            <Text style={styles.sectionHeadingCounter}>
                Апартаменты
            </Text>
            <View style={styles.container}>
                <View style={styles.headerRow}>
                    <Text style={[styles.cell, styles.headerCell]}>ID</Text>
                    <Text style={[styles.cell, styles.headerCell]}>Number</Text>
                    <Text style={[styles.cell, styles.headerCell]}>dateOfOccupied</Text>
                    <Text style={[styles.cell, styles.headerCell]}>Price</Text>
                    <Text style={[styles.cell, styles.headerCell]}>HotelId</Text>
                </View>
                <FlatList
                    data={apartments}
                    renderItem={renderItemApartments}
                    keyExtractor={item => item.id.toString()}
                />
            </View>
            <Text style={styles.sectionHeadingCounter}>
                Комментарии
            </Text>
            <View style={styles.container}>
                <View style={styles.headerRow}>
                    <Text style={[styles.cell, styles.headerCell]}>ID</Text>
                    <Text style={[styles.cell, styles.headerCell]}>apartmentId</Text>
                    <Text style={[styles.cell, styles.headerCell]}>user</Text>
                    <Text style={[styles.cell, styles.headerCell]}>date</Text>
                    <Text style={[styles.cell, styles.headerCell]}>comments</Text>
                </View>
                <FlatList
                    data={comments}
                    renderItem={renderItemComments}
                    keyExtractor={item => item.id.toString()}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    sectionHeadingCounter: {
        fontSize: 32,
        textAlign: 'center',
        fontWeight: 'bold',
        marginVertical: 8,
    },
    container: {
        paddingTop: 22,
    },
    row: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    headerRow: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 2,
        borderBottomColor: 'black',
        backgroundColor: '#f2f2f2',
    },
    cell: {
        flex: 1,
        textAlign: 'center',
    },
    headerCell: {
        fontWeight: 'bold',
    },
});

export default Database;