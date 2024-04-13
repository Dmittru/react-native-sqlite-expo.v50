import React, {useEffect, useState} from 'react';
import {Text, StyleSheet, View, TextInput, Alert, Pressable} from "react-native";
import {createOrSyncTableUsers, dropTableUsers, LoginOrRegister} from "../lib/DatabaseActions/ActionsDB";

const Loggin = ({navigation}) => {
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')

    useEffect(() => {
        // dropTableUsers()
        createOrSyncTableUsers();
    }, []);

    const signAction = async () => {
        if (login.length === 0 || password.length === 0) {
            Alert.alert('Нет данных', 'Не указан логин или пароль.')
        } else {
            try {
                LoginOrRegister(login, password, navigation)
            } catch (error) {
                console.log(error);
            }
        }
    }


    return (
        <View style={styles.body}>
            <Text style={styles.text}>
                Гостиницы
            </Text>
            <TextInput
                style={styles.input}
                placeholder='Логин'
                placeholderTextColor='rgba(28,28,28,0.8)'
                onChangeText={(value) => setLogin(value)}
            />
            <TextInput
                style={styles.input}
                placeholder='Пароль'
                placeholderTextColor='rgba(28,28,28,0.8)'
                onChangeText={(value) => setPassword(value)}
            />
            <Pressable
                android_ripple={{color: 'rgba(0,0,0,0.1)'}}
                hitSlop={{top: 10, bottom: 10, right: 10, left: 10}}
                onPress={() => {
                    signAction()
                }}
                style={styles.btn}
            >
                <Text style={styles.textBtn}>
                    Вход / Регистрация
                </Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: '#D6DAC8',
        alignItems: 'center',
    },
    text: {
        marginTop: 190,
        marginBottom: 25,
        fontSize: 60,
        lineHeight: 60,
        textAlign: 'center',
        fontWeight: 'bold',
        letterSpacing: 1.3,
        color: '#9CAFAA',
        textShadowColor: '#384843',
        textShadowOffset: {width: 0, height: 3},
        textShadowRadius: 2,
    },
    input: {
        paddingVertical: 5,
        marginBottom: 10,
        borderRadius: 20,
        width: 320,
        color: 'rgba(28,28,28,0.8)',
        textAlign: 'center',
        fontSize: 28,
        borderWidth: 1,
        backgroundColor: '#FBF3D5',
        borderColor: 'rgba(251,243,213,0.8)',
    },
    textBtn: {
        color: 'rgba(28,28,28,0.8)',
        margin: 10,
        textAlign: 'center',
        fontSize: 20,
    },
    btn: {
        alignItems: 'center',
        margin: 10,
        paddingHorizontal: 5,
        minWidth: 110,
        borderRadius: 10,
        minHeight: 30,
        backgroundColor: '#FBF3D5',
    },
})

export default Loggin;