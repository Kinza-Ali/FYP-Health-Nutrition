import React, {useState, useEffect} from 'react';
import {Text, SafeAreaView, View, Button, TextInput, TouchableOpacity,  ActivityIndicator,StyleSheet
} from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';
import auth from '@react-native-firebase/auth';

//facebook import
// import {LoginButton, AccessToken} from 'react-native-fbsdk';

export default function Login({navigation}) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState([]);
  const[userName, setUserName] = useState([]);
  const [email,setEmail] = useState([]);
  const [password,setPassword] = useState([]);
  // const users :[ {
  //   name: userName,
  //   email: email,
  //   password: password,
  // }]
  //   console.log (users);
  


  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['email'],
      webClientId:
        '111595640287-rd4lobg73o37ljn63qb92pvo6hl9h5o8.apps.googleusercontent.com',
      offlineAccess: true,
    });

    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  });

  //--------------------------------
  createUser = () => {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        console.log('User account created & signed in!');
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }
        console.error(error);
      });
    setLoggedIn(true);
    setUser(user);
    // const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    // return subscriber;
  };
  // console.log(email, passw1ord);
  //-------------------------------------
  signInUser = () => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        console.log('User account signed in!');
      })
      .catch((error) => {
        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }
        console.error(error);
      });
    setLoggedIn(true);
  };
  //-------------------------------------

  function onAuthStateChanged(user) {
    setUser(user);
    console.log(user);
    if (user) {
      setLoggedIn(true);

    }
  }

  _signIn = async () => {
    try {
      // async (email, password) => {
      //   try {
      //     const login = await auth().createUserWithEmailAndPassword(
      //       setEmail(email),
      //       setPassword(password),
      //     );
      //   } catch (e) {
      //     console.log(e);
      //   }
      // };
      await GoogleSignin.hasPlayServices();
      const {accessToken, idToken} = await GoogleSignin.signIn();
      // const userInfo = await GoogleSignin.signIn();
      setLoggedIn(true);

      const credential = auth.GoogleAuthProvider.credential(
        idToken,
        accessToken,
      );
      await auth().signInWithCredential(credential);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        alert('cancel');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        alert('Signin in Progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        alert('Play Services not available');
      }
    }
  };

  signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      auth()
        .signOut()
        .then(() => alert('You are signed Out! '));
      setLoggedIn(false);
    } catch (error) {
      console.log(error);
    }
    setUserName(null);
  };
  const textInputchange = (email) => {
    if (email.length !== 0) {
      setEmail(email);
    }
  }
    const displayName = (username) => {
      if (username.length !== 0) {
        setUserName(username);
      }
    // else{
    //   setData({
    //     ...data,
    //     email: val,
    //     check_textInputChange : false
    // });
};
  const handllePasswordChange = (password) => {
    setPassword(password);
}
  return (
    <>
      <SafeAreaView>
        <View
          style={{justifyContent: 'center', alignItems: 'center', height: 500}}>
          {user ? (
            userName ? (
              <View style={{alignItems: 'center'}}>
              <Text> Welcome {userName}</Text>
              <Button
                title="Go to NutriGuide"
                onPress={() =>
                  navigation.navigate('Chatbot', {
                    name: userName,
                    id: user.uid,
                  })
                }
              />
              <Button title="Logout" onPress={this.signOut} color="red" />
            </View>
            ) :
            (
            <View style={{alignItems: 'center'}}>
              <Text> Welcome {user.displayName}</Text>
              <Button
                title="Go to NutriGuide"
                onPress={() =>
                  navigation.navigate('Chatbot', {
                    name: user.displayName,
                    id: user.uid,
                  })
                }
              />
              <Button title="Logout" onPress={this.signOut} color="red" />
            </View> )
          ) : (
            <View>
              <Text> Please Sign up </Text>
              <TextInput
                placeholder="Enter User Nmae"
                autoCapitalize="none"
                onChangeText={(username) => displayName(username)}
              />
             
              <Text> Email </Text>
              <TextInput
                placeholder="Your Email"
                autoCapitalize="none"
                onChangeText={(email) => textInputchange(email)}
              />
              <TextInput
                placeholder="Your Password" autoCapitalize ="none" 
                onChangeText={(password) => handllePasswordChange(password)}
              />
             <TouchableOpacity onPress = {this.createUser}>
                <Text>  Sign Up </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress = {this.signInUser}>
                <Text>  Login </Text>
              </TouchableOpacity>
             
               <GoogleSigninButton
                style={{width: 192, height: 48}}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={this._signIn}
              />
              
            </View>
          )}
        </View>
      </SafeAreaView>
    </>
  );
}