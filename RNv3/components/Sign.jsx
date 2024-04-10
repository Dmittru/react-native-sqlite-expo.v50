import React, {useEffect, useState} from 'react';
import {Text, StyleSheet, View, TextInput, Alert} from "react-native";
import {createOrSyncTable, createOrSyncTableUsers, dropTableUsers, SignInOrUp} from "../lib/DatabaseActions/ActionsDB";
import SignButton from "./SignButton";
const Sign = ({ navigation }) => {
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')

    useEffect(() => {
        // dropTableUsers()
        createOrSyncTableUsers();
    }, []);

    const signAction = async () => {
        if (login.length === 0 || password.length === 0) {
            Alert.alert('Данные не введены', 'Нужен логин и пароль для регистрации или входа.')
        } else {
            try {
                SignInOrUp(login, password, navigation)
            } catch (error) {
                console.log(error);
            }
        }
    }


    return (
        <View style={styles.body} >
            <Text style={styles.text}>
                Дневник Спортсмена
            </Text>
            <TextInput
                style={styles.input}
                placeholder='Логин'
                placeholderTextColor='rgba(236,236,236,0.75)'
                onChangeText={(value) => setLogin(value)}
            />
            <TextInput
                style={styles.input}
                placeholder='Пароль'
                placeholderTextColor='rgba(236,236,236,0.75)'
                onChangeText={(value) => setPassword(value)}
            />
            <SignButton
                title='Вход или Регистрация'
                onPressFunc={signAction}
                color='#6a87a5'
            />
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#abc1d1',
    },
    text: {
        textAlign: 'center',
        fontSize: 52,
        color: '#1f3954',
        marginTop: 200,
        marginBottom: 20,
        fontWeight: 'bold',
        lineHeight:52,
    },
    input: {
        width: 300,
        borderWidth: 1,
        color: '#f3f3f3',
        textAlign: 'center',
        fontSize: 28,
        paddingVertical: 5,
        marginBottom: 10,
        borderRadius: 20,
        backgroundColor: '#6a87a5',
        borderColor: 'rgba(75,113,152,0.8)',
    }
})

export default Sign;