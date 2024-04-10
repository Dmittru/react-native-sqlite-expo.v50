import React from 'react';
import {
    Pressable,
    Text,
    StyleSheet,
} from 'react-native';

const SignButton = (props) => {
    return (
        <Pressable
            hitSlop={{top: 10, bottom: 10, right: 10, left: 10}}
            android_ripple={{color: '#00000050'}}
            onPress={props.onPressFunc}
            style={({pressed}) => [
                {backgroundColor: pressed ? '#47627e' : props.color},
                styles.button,
                {...props.style}
            ]}
        >
            <Text style={styles.text}>
                {props.title}
            </Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    text: {
        margin: 10,
        fontSize: 20,
        color: 'rgba(243,243,243,0.8)',
        textAlign: 'center',
    },
    button: {
        minHeight: 30,
        minWidth: 100,
        margin: 10,
        paddingHorizontal: 5,
        alignItems: 'center',
        borderRadius: 10,
    },
})

export default SignButton;