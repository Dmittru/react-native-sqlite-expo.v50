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

export function dropTableHotels() {
    db.transaction((tx) => {
        tx.executeSql(
            "DROP TABLE IF EXISTS hotels;"
        );
    });
    console.log('Таблица hotels удалена из БД')
}
export function dropTableResorts() {
    db.transaction((tx) => {
        tx.executeSql(
            "DROP TABLE IF EXISTS resorts;"
        );
    });
    console.log('Таблица resorts удалена из БД')
}

export function dropTableApartments() {
    db.transaction((tx) => {
        tx.executeSql(
            "DROP TABLE IF EXISTS apartments;"
        );
    });
    console.log('Таблица apartments удалена из БД')
}

export function dropTableComments() {
    db.transaction((tx) => {
        tx.executeSql(
            "DROP TABLE IF EXISTS comments;"
        );
    });
    console.log('Таблица comments удалена из БД')
}

export function getTableUsers(setter) {
    db.transaction(
        (tx) => {
            tx.executeSql("SELECT * FROM users", [], (_, {rows}) => {
                setter(rows._array)
            });
        },
        (error) => {
            console.error('Error fetching users:', error);
        }
    );
}

export function getTableHotels(setter) {
    db.transaction(
        (tx) => {
            tx.executeSql("SELECT hotels.*, resorts.name as resort_name FROM hotels JOIN resorts ON hotels.resortId = resorts.id", [], (_, {rows}) => {
                setter(rows._array)
            });
        },
        (error) => {
            console.error('Error fetching hotels:', error);
        }
    );
}
export function getTableResorts(setter) {
    db.transaction(
        (tx) => {
            tx.executeSql("SELECT * FROM resorts", [], (_, {rows}) => {
                setter(rows._array)
            });
        },
        (error) => {
            console.error('Error fetching resorts:', error);
        }
    );
}

export function getTableApartments(setter) {
    db.transaction(
        (tx) => {
            tx.executeSql("SELECT * FROM apartments", [], (_, {rows}) => {
                setter(rows._array)
            });
        },
        (error) => {
            console.error('Error fetching apartments:', error);
        }
    );
}

export function getTableComments(setter) {
    db.transaction(
        (tx) => {
            tx.executeSql("SELECT * FROM comments", [], (_, {rows}) => {
                setter(rows._array)
            });
        },
        (error) => {
            console.error('Error fetching comments:', error);
        }
    );
}


export function createOrSyncTableUsers() {
    console.log('sync users')
    db.transaction((tx) => {
        tx.executeSql(
            "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY NOT NULL, login TEXT, password TEXT);"
        );
    });
}

export function createOrSyncTableHotels() {
    db.transaction((tx) => {
        tx.executeSql(
            "create table if not exists hotels (id integer primary key not null, title text, stars text, resortId text, FOREIGN KEY(resortId) REFERENCES resorts(id));"
        );
    });
}

export function createOrSyncTableApartments() {
    db.transaction((tx) => {
        tx.executeSql(
            "CREATE TABLE IF NOT EXISTS apartments (id INTEGER PRIMARY KEY NOT NULL, number TEXT, dateOfOccupied TEXT, price REAL, hotelId INTEGER, FOREIGN KEY(hotelId) REFERENCES hotels(id));"
        );
    });
}
export function createOrSyncTableResorts() {
    db.transaction((tx) => {
        tx.executeSql(
            "CREATE TABLE IF NOT EXISTS resorts (id INTEGER PRIMARY KEY NOT NULL, place TEXT, name TEXT, services TEXT);"
        );
    });
}

export function createOrSyncTableComments() {
    db.transaction((tx) => {
        tx.executeSql(
            "CREATE TABLE IF NOT EXISTS comments (id INTEGER PRIMARY KEY NOT NULL, apartmentId INTEGER, user TEXT, date TEXT, comment TEXT, FOREIGN KEY(apartmentId) REFERENCES apartments(id));"
        );
    });
}
export function getAllHotelInfo(hotelId, setter) {
    let hotelInfo = {
        hotel: {},
        apartments: [],
    };

    db.transaction((tx) => {
        tx.executeSql(
            "SELECT * FROM hotels WHERE id = ?",
            [hotelId],
            (_, results) => {
                if (results.rows.length > 0) {
                    hotelInfo.hotel = results.rows.item(0);
                    tx.executeSql(
                        "SELECT * FROM apartments WHERE hotelId = ?",
                        [hotelId],
                        (_, apartmentResults) => {
                            for (let i = 0; i < apartmentResults.rows.length; i++) {
                                let apartment = apartmentResults.rows.item(i);
                                hotelInfo.apartments.push(apartment);
                            }
                            setter(hotelInfo);
                        }
                    );
                } else {
                    Alert.alert('Ошибка', 'Произошла непредвиденная ошибка. Информации по отелю не найдено');
                }
            }
        );
    });
}
export function getAllCommentsByApartsInfo(apartsId, setter) {
    let ApartsInfo = {
        apartments: {},
        comments: [],
    };

    db.transaction((tx) => {
        tx.executeSql(
            "SELECT * FROM apartments WHERE id = ?",
            [apartsId],
            (_, results) => {
                if (results.rows.length > 0) {
                    ApartsInfo.apartments = results.rows.item(0);
                    tx.executeSql(
                        "SELECT * FROM comments WHERE apartmentId = ?",
                        [apartsId],
                        (_, commentsResults) => {
                            for (let i = 0; i < commentsResults.rows.length; i++) {
                                let comment = commentsResults.rows.item(i);
                                ApartsInfo.comments.push(comment);
                            }
                            setter(ApartsInfo);
                        }
                    );
                } else {
                    Alert.alert('Ошибка', 'Произошла непредвиденная ошибка. Информации по отелю не найдено');
                }
            }
        );
    });
}

export function LoginOrRegister(login, password, navigation) {
    db.transaction((tx) => {
        tx.executeSql(
            "SELECT login, password FROM users WHERE login = ?",
            [login],
            (_, results) => {
                if (results.rows.length > 0) {
                    const user = results.rows.item(0);
                    if (user.password === password) {
                        console.log(4)
                        navigation.navigate('Main', {loggedInUser: login});
                    } else {
                        Alert.alert('Неправильный пароль', 'Введите заного');
                    }
                } else {
                    db.transaction((tx) => {
                        tx.executeSql(
                            "INSERT INTO users (login, password) VALUES (?, ?)",
                            [login, password],
                            (_, insertResults) => {
                                if (insertResults.rowsAffected > 0) {
                                    Alert.alert('Регистрация успешна', 'Инициализация входа в аккаунт');
                                    navigation.navigate('Main', {loggedInUser: login});
                                } else {
                                    Alert.alert('Не зарегистрирован', 'Произошла непредвиденная ошибка');
                                }
                            }
                        );
                    });
                }
            }
        );
    });
}

export function AddHotelDB(title, stars, resId) {
    db.transaction(
        (tx) => {
            tx.executeSql(
                "insert into hotels (title, stars, resortId) values (?, ?, ?)",
                [title, stars, resId],
                (_, {rowsAffected, insertId}) => {
                    if (rowsAffected > 0) {
                        console.log(`Новая запись в БД: ID ${insertId}; [${title}, ${stars}, ${resId}]`);
                    } else {
                        console.log("Ошибка вставки записи.");
                    }
                },
                (_, error) => {
                    console.error("Ошибка вставки записи SQL:", error);
                }
            );
        },
    );
}

export function AddResortDB(place, name, services) {
    db.transaction(
        (tx) => {
            tx.executeSql(
                "insert into resorts (place, name, services) values (?, ?, ?)",
                [place, name, services],
                (_, {rowsAffected, insertId}) => {
                    if (rowsAffected > 0) {
                        console.log(`Новая запись в БД: ID ${insertId}; [${place}, ${name}, ${services}]`);
                    } else {
                        console.log("Ошибка вставки записи.");
                    }
                },
                (_, error) => {
                    console.error("Ошибка вставки записи SQL:", error);
                }
            );
        },
    );
}

export function addApartsDB(num, price, hotel) {
    db.transaction(
        (tx) => {
            tx.executeSql(
                "insert into apartments (number, dateOfOccupied, price, hotelId) values (?, ?, ?, ?)",
                [num, '', price, hotel],
                (_, {rowsAffected, insertId}) => {
                    if (rowsAffected > 0) {
                        console.log(`Новая запись в БД: ID ${insertId}; [${num}, '', ${price}, ${hotel}]`);
                    } else {
                        console.log("Ошибка вставки записи.");
                    }
                },
                (_, error) => {
                    console.error("Ошибка вставки записи SQL:", error);
                }
            );
        },
    );
}
export function addCommentDB(apartmentId, user, comment) {
    const newDate = new Date();
    db.transaction(
        (tx) => {
            tx.executeSql(
                "insert into comments (apartmentId, user, date, comment) values (?, ?, ?, ?)",
                [apartmentId, user, String(newDate), comment],
                (_, {rowsAffected, insertId}) => {
                    if (rowsAffected > 0) {
                        console.log(`Новая запись в БД: ID ${insertId}; [${apartmentId}, ${user}, ${String(newDate)}, ${comment}]`);
                    } else {
                        console.log("Ошибка вставки записи.");
                    }
                },
                (_, error) => {
                    console.error("Ошибка вставки записи SQL:", error);
                }
            );
        },
    );
}

export function deleteHotelDB(selectedHotelId) {
    db.transaction(
        (tx) => {
            tx.executeSql(`delete from hotels where id = ?;`, [
                selectedHotelId,
            ]);
        }
    );
    console.log(`Удалена запись с id ${selectedHotelId}`)
}
export function deleteResortDB(selectedResortId) {
    db.transaction(
        (tx) => {
            tx.executeSql(`delete from resorts where id = ?;`, [
                selectedResortId,
            ]);
        }
    );
    console.log(`Удалена запись с id ${selectedResortId}`)
}
export function deleteCommentDB(commentId) {
    db.transaction(
        (tx) => {
            tx.executeSql(`delete from comments where id = ?;`, [
                commentId,
            ]);
        }
    );
    console.log(`Удалена запись с id ${commentId}`)
}
export function deleteApartsDB(selectedApartsId) {
    db.transaction(
        (tx) => {
            tx.executeSql(`delete from apartments where id = ?;`, [
                selectedApartsId,
            ]);
        }
    );
    console.log(`Удалена запись с id ${selectedApartsId}`)
}

export function updateApartsBooksDB(bookDate, selectedApartsId) {
    console.log(bookDate)
    db.transaction(
        (tx) => {
            tx.executeSql(`update apartments set dateOfOccupied = ? where id = ?;`, [
                String(bookDate), selectedApartsId,
            ]);
        },
    );
}