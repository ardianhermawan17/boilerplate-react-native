import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
  TextInput,
  Keyboard,
  SafeAreaView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';
import { withNavigationFocus } from 'react-navigation';
import { connect } from 'react-redux';

import I18n from '../../I18n';
import { addData, deleteData } from '../../redux/actions';
import { LOGO } from '../../configs';
import styles from './styles';

class Home extends Component {
  constructor() {
    super();
    this.state = {
      input: ''
    };
  }

  onClickTrash(item) {
    Alert.alert(I18n.t('delete'), I18n.t('youSure'), [
      { text: I18n.t('no') },
      { text: I18n.t('yes'), onPress: () => this.deleteData(item) }
    ]);
  }

  deleteData(index) {
    this.props.deleteData(index);
  }

  async addData() {
    await this.props.addData(this.state.input);
    this.setState({ input: '' });
    Keyboard.dismiss();
  }

  _renderItem = ({ item, index }) => (
    <View style={styles.row}>
      <Text>{item}</Text>
      <TouchableOpacity onPress={() => this.onClickTrash(index)}>
        <Icon name="delete" size={20} color="#d63031" />
      </TouchableOpacity>
    </View>
  );

  _renderEmptyItem = () => (
    <View style={styles.wrapEmptyData}>
      <Text>{I18n.t('empty')}</Text>
    </View>
  );

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <View style={styles.engine}>
            <Text>{I18n.t('language')}</Text>
            <View style={styles.wrapAuthor}>
              <Text>
                {`Hermes: ${
                  global.HermesInternal == null ? I18n.t('off') : I18n.t('on')
                }`}
              </Text>
              <Text>Arief Yusron</Text>
            </View>
          </View>
          <View style={styles.container}>
            <View style={styles.wrapImage}>
              <Image source={LOGO} style={styles.image} />
            </View>
            <View style={styles.wrapButtonIcon}>
              <TouchableOpacity
                style={styles.buttonIcon}
                onPress={() => this.props.navigation.navigate('Setting')}>
                <Icon name="settings" size={30} />
                <Text>{I18n.t('setting')}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.wrapContent}>
              <View style={styles.content} elevation={5}>
                <View style={styles.header}>
                  <TextInput
                    placeholder={I18n.t('typeHere')}
                    style={styles.input}
                    onChangeText={text => this.setState({ input: text })}
                    value={this.state.input}
                  />
                  <TouchableOpacity
                    onPress={() => this.addData()}
                    disabled={this.state.input === ''}>
                    <Icon
                      name="add-circle-outline"
                      size={20}
                      color={
                        this.state.input === ''
                          ? 'rgba(0, 184, 148, 0.3)'
                          : '#00b894'
                      }
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.body}>
                  <FlatList
                    keyboardShouldPersistTaps="handled"
                    data={this.props.home.data}
                    extraData={I18n.t('empty')}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={this._renderItem}
                    ListEmptyComponent={this._renderEmptyItem}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

Home.propTypes = {
  home: PropTypes.object.isRequired,
  addData: PropTypes.func.isRequired,
  deleteData: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  home: state.home
});

const mapDispatchToProps = {
  addData,
  deleteData
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigationFocus(Home));