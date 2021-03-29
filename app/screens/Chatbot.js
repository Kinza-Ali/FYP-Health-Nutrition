import React, {Component} from 'react';
import {View, Text, SafeAreaView} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import {Dialogflow_V2} from 'react-native-dialogflow';
import {dialogflowConfig} from '../env';

import firestore from '@react-native-firebase/firestore';

//Bot Image
const botAvatar = require('../assets/images/bot.png');
//Bot User
const BOT = {
  _id: 2,
  name: 'Mr Bot',
  avatar: botAvatar,
};

class Chatbot extends Component {
  state = {
    messages: [],
    // messages: [
    //   {
    //     _id: 2,
    //     text: 'I am Mr Bot , your automated Nutriguide :)',
    //     createdAt: new Date().getTime(),
    //     user: BOT,
    //   },
    //   {_id: 1, text: 'HI', createdAt: new Date().getTime(), user: BOT},]
    id: 1,
    name: '',
  };
  //.......................

  componentDidMount() {
    Dialogflow_V2.setConfiguration(
      dialogflowConfig.client_email,
      dialogflowConfig.private_key,
      Dialogflow_V2.LANG_ENGLISH_US,
      dialogflowConfig.project_id,
    );
    const {name, id} = this.props.route.params;
    // console.log(this.props);
    firestore()
      .collection('CHATBOT_HISTORY')
      .doc(id)
      .collection('MESSAGES')
      .orderBy('createdAt', 'desc') //stores on the basis of previous date
      .limit(50) //limit for previous messages
      .get()
      .then((snapshot) => {


        let messages = snapshot.docs.map((doc) => {
          const firebaseData = doc.data();
          const data = {
            _id: doc.id,
            text: doc.text,
            createdAt: new Date().getTime(),
            ...firebaseData,
          };
          if (!firebaseData.system) {
            data.user = {
              ...firebaseData.user,
              name: firebaseData.user.name,
            }
          }
          return data;
        });
        if (messages.length > 0) {
          this.setState({name, id, messages});
        } else {
          this.setState({
            name,
            id,
            messages: [
              {
                _id: 2,
                text : `Hello, ${this.props.route.params.name}. I am Mr.Bot,your automated Nutriguide`,
                createdAt: new Date().getTime(),
                user: BOT,
              },
              {
                _id: 1,
                text: 'HI',
                createdAt: new Date().getTime(),
                user: BOT,
              }
            ]
          })
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }
  //...........................

  //handleGoogleResponse to show the response from the bot to the user
  handleGoogleResponse(result) {
    let text = result.queryResult.fulfillmentMessages[0].text.text[0];
    this.sendBotResponse(text);
  }
  //...........................
  sendBotResponse(text) {
    let msg = {
      // _id: this.state.messages.length + 1,
      text,
      createdAt: new Date().getTime(),
      user: BOT,
    };
    const {id} = this.props.route.params;

    firestore()
      .collection('CHATBOT_HISTORY')
      .doc(id)
      .collection('MESSAGES')
      .add(msg);

    msg._id = this.state.messages.length + 1;
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, [msg]),
    }));
  }
  //...........................
  // onSend function
  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
    let text = messages[0].text;
    const {id, name} = this.props.route.params;

    firestore()
      .collection('CHATBOT_HISTORY')
      .doc(id)
      .collection('MESSAGES')
      .add({
        text,
        createdAt: new Date().getTime(),
        user: {
          _id: 1,
          name: name,
        },
      });

    Dialogflow_V2.requestQuery(
      text,
      (result) => this.handleGoogleResponse(result),
      (error) => console.log(error),
    );
  }
  //...............................
  onQuickReply(quickReply) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, quickReply),
    }));
    let message = quickReply[0].value;
    Dialogflow_V2.requestQuery(
      message,
      (result) => this.handleGoogleResponse(result),
      (error) => console.log(error),
    )
  }
  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <GiftedChat
          messages={this.state.messages}
          onSend={(message) => this.onSend(message)}
          onQuickReply={(quickReply) => this.onQuickReply(quickReply)} 
          user={{_id: 1}}
        />
      </View>
    );
  }
}

export default Chatbot;
