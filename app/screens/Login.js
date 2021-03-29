import React, {useState, useEffect} from 'react';
import {Text, SafeAreaView, View, Button} from 'react-native';
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


  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['email'],
      webClientId:
      '111595640287-rd4lobg73o37ljn63qb92pvo6hl9h5o8.apps.googleusercontent.com'  ,    offlineAccess: true,
    });

    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  });

  function onAuthStateChanged(user) {
    setUser(user);
    if (user) {
      setLoggedIn(true);
    }
  }

  _signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const {accessToken, idToken} = await GoogleSignin.signIn();
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
  };

  return (
    <>
      <SafeAreaView>
        <View
          style={{justifyContent: 'center', alignItems: 'center', height: 500}}>
          {user ? (
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
            </View>
          ) : (
            <View>
              <Text> Please Sign up </Text>
              <GoogleSigninButton
                style={{width: 192, height: 48}}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={this._signIn}
              />
              {/* <LoginButton
                onLoginFinished={(error, result) => {
                  if (error) {
                    console.log('login has error: ' + result.error);
                  } else if (result.isCancelled) {
                    console.log('login is cancelled.');
                  } else {
                    AccessToken.getCurrentAccessToken().then((data) => {
                      console.log(data.accessToken.toString());
                  });
              }
                }}
                onLogoutFinished={() => console.log('logout.')}
              /> */}
            </View>
          )}
        </View>
      </SafeAreaView>
    </>
  );
}
