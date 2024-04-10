import {openDatabase} from "./OpenDB";
import {Alert} from "react-native";

const db = openDatabase();

export function dropTableUsers() {
    db.transaction((tx) => {
        tx.executeSql(
            "DROP TABLE IF EXISTS users;"
        );
    });
    console.log('Таблица users удалена из БД')
}

export function dropTableItems() {
    db.transaction((tx) => {
        tx.executeSql(
            "DROP TABLE IF EXISTS items;"
        );
    });
    console.log('Таблица items удалена из БД')
}

export function createOrSyncTableUsers() {
    db.transaction((tx) => {
        tx.executeSql(
            "create table if not exists users (id integer primary key not null, login text UNIQUE, password text);"
        );
    });
}

export function createOrSyncTableItems() {
    db.transaction((tx) => {
        tx.executeSql(
            "create table if not exists items (id integer primary key not null, done int, value text, achieve text, date text, user text);"
        );
    });
}

export function SignInOrUp(login, password, navigation) {
    db.transaction((tx) => {
        tx.executeSql(
            "SELECT login, password FROM users WHERE login = ?",
            [login],
            (_, results) => {
                if (results.rows.length > 0) {
                    const user = results.rows.item(0);
                    if (user.password === password) {
                        navigation.navigate('UserDesc', {loggedInUser: login});
                    } else {
                        Alert.alert('Ошибка', 'Неправильный пароль, попробуйте снова');
                    }
                } else {
                    db.transaction((tx) => {
                        tx.executeSql(
                            "INSERT INTO users (login, password) VALUES (?, ?)",
                            [login, password],
                            (_, insertResults) => {
                                if (insertResults.rowsAffected > 0) {
                                    Alert.alert('Успешно!', 'Пользователь зарегистрирован');
                                    navigation.navigate('UserDesc', {loggedInUser: login});
                                } else {
                                    Alert.alert('Ошибка', 'Не удалось зарегистрироваться');
                                }
                            }
                        );
                    });
                }
            }
        );
    });
    logAllUsers()
}

export function doneUpdate(loggedInUser, setDoneItemCount) {
    db.transaction((tx) => {
        tx.executeSql(
            `SELECT COUNT(*) AS count FROM items WHERE done = ? AND user = ?;`,
            [1, loggedInUser],
            (_, {rows: {_array}}) => {
                setDoneItemCount(_array[0].count);
            }
        );
    });
    logAllItems()
}

export function AddItemDB(text, date, loggedInUser, forceUpdate) {
    db.transaction(
        (tx) => {
            tx.executeSql(
                "insert into items (done, value, achieve, date, user) values (?, ?, ?, ?, ?)",
                [0, text, '', date.toISOString(), loggedInUser],
                (_, {rowsAffected, insertId}) => {
                    if (rowsAffected > 0) {
                        console.log(`Новая запись в БД: ID ${insertId}; [0, ${text}, '', ${date.toISOString()}, ${loggedInUser}]`);
                    } else {
                        console.log("Ошибка вставки записи.");
                    }
                },
                (_, error) => {
                    console.error("Ошибка вставки записи SQL:", error);
                }
            );
        },
        null,
        forceUpdate
    );
    logAllItems()
}

export function getItemsByDone(doneHeading, loggedInUser, setItems) {
    db.transaction((tx) => {
        tx.executeSql(
            `select * from items where done = ? and user = ? order by date;`,
            [doneHeading ? 1 : 0, loggedInUser],
            (_, {rows: {_array}}) => setItems(_array)
        );
    });
}

export function UndoneItem(selectedItemId, setModalVisible, forceUpdate) {
    db.transaction(
        (tx) => {
            tx.executeSql(`update items set done = 0, achieve = '' where id = ?;`, [
                selectedItemId,
            ]);
        },
        null,
        () => {
            setModalVisible(false);
            forceUpdate();
        }
    );
    logAllItems()
}

export function doneItem(achieve, selectedItemId, setAchieve, setDetailsModalVisible, forceUpdate) {
    db.transaction(
        (tx) => {
            tx.executeSql(`update items set done = 1, achieve = ? where id = ?;`, [achieve, selectedItemId]);
        },
        (e) => {
            console.log(e)
        },
        () => {
            setAchieve(null)
            setDetailsModalVisible(false);
            forceUpdate();
        }
    );
    logAllItems()
}

export function deleteItemDB(selectedItemId, setModalVisible, forceUpdate) {
    db.transaction(
        (tx) => {
            tx.executeSql(`delete from items where id = ?;`, [
                selectedItemId,
            ]);
        },
        null,
        () => {
            setModalVisible(false);
            forceUpdate();
        }
    );
    console.log(`Удалена запись с id ${selectedItemId}`)
    logAllItems()
}

export function logAllItems() {
    db.transaction(
        (tx) => {
            tx.executeSql("select * from items", [], (_, {rows}) =>
                console.log('ТАБЛИЦА items\n\n', JSON.stringify(rows))
            );
        }
    )
}

export function logAllUsers() {
    db.transaction(
        (tx) => {
            tx.executeSql("select * from users", [], (_, {rows}) =>
                console.log('ТАБЛИЦА users\n\n',JSON.stringify(rows))
            );
        }
    )
}