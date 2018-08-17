import React, { Component } from "react";
import { View, TouchableOpacity, KeyboardAvoidingView } from "react-native";
import { FormLabel, FormInput, Text } from "react-native-elements";
import { connect } from "react-redux";
import { updatingUser } from "../store/userReducer";

class EditUserProfile extends Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentWillMount() {
    const userData = this.props.user;
    this.setState(userData);
  }

  async handleSubmit(event, userData) {
    event.preventDefault();
    this.props.updateUser(userData);
  }

  render() {
    const { navigation } = this.props;
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
        keyboardVerticalOffset={200}
      >
        <Text style={styles.titleText}>Edit Profile</Text>
        <View style={styles.formContainer}>
          <FormLabel>First Name</FormLabel>
          <FormInput
            value={this.state.firstName}
            onChangeText={firstName => this.setState({ firstName })}
          />
          <FormLabel>Last Name</FormLabel>
          <FormInput
            value={this.state.lastName}
            onChangeText={lastName => this.setState({ lastName })}
          />
          <FormLabel>Email</FormLabel>
          <FormInput
            value={this.state.email}
            onChangeText={email => this.setState({ email })}
          />
          <FormLabel>Password</FormLabel>
          <FormInput
            value={this.state.password}
            onChangeText={password => this.setState({ password })}
            autoCapitalize="none"
            secureTextEntry={true}
          />
        </View>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={event => this.handleSubmit(event, this.state)}
        >
          Save
        </TouchableOpacity>
      </KeyboardAvoidingView>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    alignItems: `center`,
    backgroundColor: "#FFF"
  },
  titleText: {
    top: "15%",
    fontWeight: "800",
    fontSize: 36,
    color: "#FF5858"
  },
  formContainer: {
    top: "20%",
    width: 290,
    marginBottom: 0,
    paddingBottom: 0
  },
  buttonContainer: {
    top: "40%"
  },
  button: {
    backgroundColor: "#ff5858",
    padding: 10,
    margin: 5,
    borderRadius: 5,
    width: 250
  },
  buttonText: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center"
  }
};

const mapStateToProps = state => {
  return {
    user: state.users.user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateUser: userData => dispatch(updatingUser(userData))
  };
};

const ArtPostForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(EditUserProfile);

export default ArtPostForm;
