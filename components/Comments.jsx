import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, TextInput, Button, Modal} from "react-native";
import {
    addApartsDB, addCommentDB, deleteApartsDB, deleteCommentDB,
    getAllCommentsByApartsInfo, getAllHotelInfo

} from "../lib/DatabaseActions/ActionsDB";

const Comments = ({route, navigation,}) => {
    const {loggedInUser, apartsId} = route.params;
    const [editComms, setEditComms] = useState(false)
    const [commentComms, setCommentComms] = useState('')
    const [comments, setComments] = useState({apartments: {}, comments: []})
    const [commentsModal, setCommentsModal] = useState(false)
    const [selectedComm, setSelectedComm] = useState('')

    useEffect(() => {
        getAllCommentsByApartsInfo(apartsId, setComments);
    }, []);
    console.log(comments)
    return (
        <View style={{paddingHorizontal:20}}>
            <Text style={styles.heading}>
                Апартаменты №{comments.apartments.number}
            </Text>
            <TouchableOpacity
                style={styles.buttonSpace}
                onPress={() => {
                    setEditComms(prevState => !prevState)
                }}
            >
                <Text style={styles.buttonText}>
                    {editComms ? 'Скрыть создание комментариев' : 'Создать комментарий'}
                </Text>
            </TouchableOpacity>
            {editComms &&
                <View style={styles.inputList}>
                    <TextInput
                        onChangeText={(txt) => {
                            setCommentComms(txt)
                        }}
                        placeholder="Комментарий"
                        style={styles.input}
                        value={commentComms}
                    />
                    <TouchableOpacity
                        style={styles.buttonSpace}
                        onPress={() => {
                            addCommentDB(apartsId, loggedInUser, commentComms);
                            setCommentComms('');
                            getAllCommentsByApartsInfo(apartsId, setComments);
                        }}
                    >
                        <Text style={styles.buttonText}>Создать комментарий</Text>
                    </TouchableOpacity>
                </View>
            }
            {
                comments.comments.map((comm) => {
                    return (
                        <TouchableOpacity
                            onPress={() => {
                                setSelectedComm(comm.id)
                                setCommentsModal(true)
                            }}
                            key={comm.id}
                            style={styles.apartCard}
                        >
                            <Text style={styles.centeredText}>Комментарий от: {comm.user} </Text>
                            <Text style={styles.centeredLowText}>{comm.date}</Text>
                            <Text style={styles.centeredText}>{comm.comment}</Text>
                        </TouchableOpacity>
                    )
                })
            }
            <Modal
                animationType="slide"
                transparent={true}
                visible={commentsModal}
                onRequestClose={() => {
                    setCommentsModal(prevValue => !prevValue);
                    setSelectedComm('')
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Действие:</Text>
                        <Button color={'#d70746'} title="Удалить" onPress={() => {
                            setSelectedComm('')
                            deleteCommentDB(selectedComm)
                            getAllCommentsByApartsInfo(apartsId, setComments);
                            setCommentsModal(false);
                        }}/>
                        <Button color={'#b20000'} title="Закрыть" onPress={() => {
                            setSelectedComm('')
                            setCommentsModal(false);
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
    centeredLowText: {
        fontSize: 12,
        textAlign: "center",
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

export default Comments;