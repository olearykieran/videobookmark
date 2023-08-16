import ShareExtension from 'react-native-share-extension';
import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

class MyShareExtension extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: '',
      value: ''
    };
  }

  componentDidMount() {
    ShareExtension.data().then(({ type, value }) => {
      this.setState({ type, value });
    });
  }

  onClose = () => {
    ShareExtension.close();
  };

  render() {
    return (
      <View>
        <Text>{this.state.value}</Text>
        <TouchableOpacity onPress={this.onClose}>
          <Text>Close</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default MyShareExtension;