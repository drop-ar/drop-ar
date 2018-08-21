import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  PanResponder,
  Animated,
  Alert,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import axios from 'axios';
import Expo, { AR, takeSnapshotAsync } from 'expo';
import * as THREE from 'three';
import ExpoTHREE from 'expo-three';
import { Button } from 'react-native-elements';
import { ColorWheel } from 'react-native-color-wheel';
var hsl = require('hsl-to-hex');
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import * as firebase from 'firebase';

export default class CameraViewCollaboration extends Component {
  constructor() {
    super();
    this.state = {
      color: { h: 0, s: 0, v: 100 },
      hexColor: '#ff00000',
      latitude: null,
      longitude: null,
      shape: 'cube',
      size: 'small',
      texture: 'color',
      hideButtons: true,
      coverPhoto: null,
    };
    this.model = null;
    this.graffitiObjects = [];
    this.objectKeys = [];
    this.timer = null;
    this.findColor = this.findColor.bind(this);
    this.findShape = this.findShape.bind(this);
    this.generateLighting.bind(this);
    this.findSize = this.findSize.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addShapeWithSize = this.addShapeWithSize.bind(this);

    this.findCustomMaterial = this.findCustomMaterial.bind(this);
    this.hideAllButtons = this.hideAllButtons.bind(this);
    this.undo = this.undo.bind(this);
    // this.undoAll = this.undoAll.bind(this);
    this.takeScreenshot = this.takeScreenshot.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
    this.storeItems = this.storeItems.bind(this);
    this.ItemElementsListener = this.ItemElementsListener.bind(this);
    this.addItem = this.addItem.bind(this);
  }

  stopTimer() {
    clearTimeout(this.timer);
  }

  // Menu
  _menu = {};
  setMenuRef = (ref, type) => {
    this._menu[type] = ref;
  };
  hideMenu = type => {
    this._menu[type].hide();
  };
  showMenu = type => {
    this._menu[type].show();
  };

  async takeScreenshot() {
    let result = await takeSnapshotAsync(this._glView, {
      format: 'jpg',
      result: 'file',
      quality: 1.0,
    });

    const file = {
      uri: result,
      type: 'image/jpeg',
    };
    if (file) {
      this.showImageSave();
      this.setState({ coverPhoto: file });
    } else {
      this.showFailToSave();
    }
  }

  async componentWillUnmount() {
    console.log('COMPONENT DID UNMOUNT');
    cancelAnimationFrame(this.gameRequest);
    try {
      this.arSession = await this._glView.stopARSessionAsync();
    } catch (err) {
      console.log(err);
    }
  }

  async handleSubmit(evt) {
    // navigator.geolocation.getCurrentPosition(
    //   position => {
    //     this.setState({
    //       latitude: position.coords.latitude,
    //       longitude: position.coords.longitude,
    //       error: null,
    //     });
    //   },
    //   error => this.setState({ error: error.message }),
    //   { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    // );
    // if (this.state.latitude === null || this.state.longitude === null) {
    //   this.showFailAlert();
    // } else {
    //   const locationToSave = [this.state.latitude, this.state.longitude];
    try {
      const artPiece = this.scene.toJSON();
      const coverPhoto = this.state.coverPhoto;
      const artObj = {
        // location: locationToSave,
        artPiece: artPiece,
        title: '',
        description: '',
        likes: 0,
        coverPhoto: coverPhoto,
      };
      // console.log('SUCCESS');
      // this.showAlert();
      if (this.state.coverPhoto === null) {
        this.pleaseSaveImageAlert();
      } else {
        this.props.navigation.navigate(`ArtPostForm`, { artObj: artObj });
      }
    } catch (err) {
      console.log(err);
      this.showFailAlert();
    }
  }

  undo() {
    if (this.scene.children.length > 3) {
      this.scene.remove(this.scene.children[this.scene.children.length - 1]);
      this.timer = setTimeout(this.undo, 100);
    }
  }

  // undoAll() {
  //   while (this.scene.children.length > 0) {
  //     this.undo();
  //   }
  // }

  showImageSave = () => {
    Alert.alert(
      'Cover Photo Set!',
      'Cool!',
      [{ text: 'Success', onPress: () => console.log('Image Loaded') }],

      { cancelable: false }
    );
  };

  // Message to user when post fails
  showFailToSave = () => {
    Alert.alert(
      'Failed To Add Photo!',
      'Error!',
      [
        {
          text: 'Please Try Again',
          onPress: () => console.log('Error'),
        },
      ],
      { cancelable: false }
    );
  };

  showAlert = () => {
    Alert.alert(
      'Posted!',
      'Awesome!',
      [{ text: ':)', onPress: () => console.log('Posted') }],
      { cancelable: false }
    );
  };

  pleaseSaveImageAlert = () => {
    Alert.alert(
      'Error!',
      'No Image! Please Set One',
      [{ text: 'Okay', onPress: () => console.log('Posted') }],
      { cancelable: false }
    );
  };

  // Message to user when post fails
  showFailAlert = () => {
    Alert.alert(
      'Failed To Add!',
      'Error!',
      [
        {
          text: 'Please Try Again',
          onPress: () => console.log('Error'),
        },
      ],
      { cancelable: false }
    );
  };

  findColor() {
    const colorHex = hsl(
      Math.round(this.state.color.h),
      Math.round(this.state.color.s),
      Math.round(this.state.color.v / 2)
    );
    this.setState({ colorHex: colorHex });
    return colorHex;
  }

  findSize() {
    if (this.state.size === 'medium') {
      return 0.04;
    } else if (this.state.size === 'large') {
      return 0.06;
    } else {
      return 0.02;
    }
  }

  findShape(sizeToUse) {
    if (this.state.shape === 'sphere') {
      return new THREE.SphereGeometry(sizeToUse, 32, 32);
    } else if (this.state.shape === 'pyramid') {
      return new THREE.TetrahedronBufferGeometry(sizeToUse, 0);
    } else if (this.state.shape === 'icosahedron') {
      return new THREE.IcosahedronGeometry(sizeToUse, 0);
    } else if (this.state.shape === 'octahedron') {
      return new THREE.OctahedronGeometry(sizeToUse, 0);
    } else if (this.state.shape === 'ring') {
      return new THREE.TorusGeometry(
        sizeToUse,
        sizeToUse / 4,
        sizeToUse / 2,
        100
      );
    } else if (this.state.shape === 'knot') {
      return new THREE.TorusKnotBufferGeometry(
        sizeToUse,
        sizeToUse / 3,
        100,
        sizeToUse * 8
      );
    } else {
      return new THREE.BoxGeometry(sizeToUse, sizeToUse, sizeToUse);
    }
  }

  async findCustomMaterial() {
    switch (this.state.texture) {
      case 'glass':
        return (material = new THREE.MeshBasicMaterial({
          map: await ExpoTHREE.createTextureAsync({
            asset: Expo.Asset.fromModule(
              require('../public/textures/Glass.jpg')
            ),
          }),
          transparent: true,
          opacity: 0.7,
        }));
      case 'water':
        return (material = new THREE.MeshBasicMaterial({
          map: await ExpoTHREE.createTextureAsync({
            asset: Expo.Asset.fromModule(
              require('../public/textures/Water.jpg')
            ),
          }),
          transparent: true,
          opacity: 0.7,
        }));
      case 'fire':
        return (material = new THREE.MeshBasicMaterial({
          map: await ExpoTHREE.createTextureAsync({
            asset: Expo.Asset.fromModule(
              require('../public/textures/Fire.jpg')
            ),
          }),
          transparent: true,
        }));
      case 'leaves':
        return (material = new THREE.MeshBasicMaterial({
          map: await ExpoTHREE.createTextureAsync({
            asset: Expo.Asset.fromModule(
              require('../public/textures/Leaves.jpg')
            ),
          }),
          transparent: true,
        }));
      case 'snow':
        return (material = new THREE.MeshBasicMaterial({
          map: await ExpoTHREE.createTextureAsync({
            asset: Expo.Asset.fromModule(
              require('../public/textures/Snow.jpg')
            ),
          }),
          transparent: true,
        }));
      case 'wood':
        return (material = new THREE.MeshBasicMaterial({
          map: await ExpoTHREE.createTextureAsync({
            asset: Expo.Asset.fromModule(
              require('../public/textures/Wood.jpg')
            ),
          }),
          transparent: true,
        }));
      case 'minecraft':
        return (material = new THREE.MeshBasicMaterial({
          map: await ExpoTHREE.createTextureAsync({
            asset: Expo.Asset.fromModule(
              require('../public/textures/Minecraft.jpg')
            ),
          }),
          transparent: true,
        }));
      case 'bricks':
        return (material = new THREE.MeshBasicMaterial({
          map: await ExpoTHREE.createTextureAsync({
            asset: Expo.Asset.fromModule(
              require('../public/textures/Bricks.jpg')
            ),
          }),
          transparent: true,
        }));
      case 'snow':
        return (material = new THREE.MeshBasicMaterial({
          map: await ExpoTHREE.createTextureAsync({
            asset: Expo.Asset.fromModule(
              require('../public/textures/Snow.jpg')
            ),
          }),
          transparent: true,
          opacity: 0.7,
        }));
      default:
        return (material = new THREE.MeshBasicMaterial({
          map: await ExpoTHREE.createTextureAsync({
            asset: Expo.Asset.fromModule(
              require('../public/textures/Glass.jpg')
            ),
          }),
          transparent: true,
          opacity: 0.7,
        }));
    }
  }

  hideAllButtons() {
    this.setState({ hideButtons: !this.state.hideButtons });
  }

  generateLighting(scene) {
    const leftLight = new THREE.DirectionalLight(0xffffff);
    const rightLight = new THREE.DirectionalLight(0xffffff);
    // const frontLight = new THREE.DirectionalLight(0xffffff);
    // leftLight.position.set(-3, 5, 0).normalize();
    // rightLight.position.set(3, 5, 0).normalize();
    // frontLight.position.set(0, 0, 0).normalize();
    this.scene.add(leftLight);
    this.scene.add(rightLight);
    // this.scene.add(frontLight);
    const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
    this.scene.add(new THREE.AmbientLight(0x404040));
    this.scene.add(light);
    var plight = new THREE.PointLight(0x000000, 1, 100);
    plight.position.set(50, 50, 50);
    this.scene.add(plight);
  }

  storeItems(sizeToUse, colorToUse, matrixWorld, shape) {
    // console.log('sizeToUse',sizeToUse,
    //   'matrixWorld', matrixWorld,
    //   'colorToUse', colorToUse)
    firebase
      .database()
      .ref('itemList/')
      .push({
        sizeToUse: sizeToUse,
        colorToUse: colorToUse,
        matrixWorld: matrixWorld,
        shape: shape,
      });
  }

  ItemElementsListener() {
    firebase
      .database()
      .ref('itemList/')
      .on('value', ItemListObj => {
        ItemListObj.forEach(item => {
          if (!this.objectKeys.includes(item.key)) {
            this.addItem(
              item.key,
              item.child('sizeToUse').val(),
              item.child('colorToUse').val(),
              item.child('matrixWorld').val(),
              item.child('shape').val()
            );
          }
        });
      });
  }

  async addShapeWithSize() {
    const sizeToUse = this.findSize();
    const colorToUse = this.findColor();

    const matrixWorld = this.camera.matrixWorld;
    // await this.ItemElementsListener();
    this.storeItems(sizeToUse, colorToUse, matrixWorld, this.state.shape);
  }
  async addItem(itemKey, sizeToUse, colorToUse, matrixWorld, shape) {
    this.objectKeys.push(itemKey);
    const objectToRender = this.findShape(sizeToUse, shape);

    let material = '';
    if (this.state.texture === 'color') {
      material = new THREE.MeshPhongMaterial({
        color: colorToUse,
        // transparent: true,
        specular: 0x555555,
        opacity: 1.0,
        shininess: 100,
      });
    } else {
      material = await this.findCustomMaterial();
    }
    const mesh = new THREE.Mesh(objectToRender, material);
    // const newItem = setModelPos(mesh, this.camera.position);
    // this.camera.matrixWorldInverse.getInverse(this.camera.matrixWorld);
    // newItem.position.z -= 0.2;
    // newItem.position.x -= 0.01;
    // newItem.position.y += 0.01;
    // newItem.applyMatrix4(this.camera.matrixWorldInverse);
    var pLocal = new THREE.Vector3(0, 0, -0.2);
    var target = pLocal.applyMatrix4(matrixWorld);
    mesh.position.copy(target);
    // mesh.lookAt(this.camera.position);
    mesh.rotator = 0.025;
    this.scene.add(mesh);
    this.graffitiObjects.push(mesh);
    // this.timer = setTimeout(this.addShapeWithSize, 50);
  }

  render() {
    this.ItemElementsListener();
    const { navigation } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <StatusBar hidden={true} />
        <Expo.GLView
          ref={ref => (this._glView = ref)}
          style={{ flex: 1 }}
          onContextCreate={this._onGLContextCreate}
        />
        {this.state.hideButtons === true ? null : (
          <View style={styles.colorPicker}>
            <ColorWheel
              onColorChange={color => this.setState({ color })}
              style={{
                height: 100,
                width: 100,
                position: 'absolute',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            />
          </View>
        )}
        {this.state.hideButtons === true ? null : (
          <View style={styles.drop}>
            {/* Pick shape from list menu */}
            <Menu
              ref={ref => this.setMenuRef(ref, 'shape')}
              button={
                <Button
                  raised
                  rounded
                  title="Shape"
                  onPress={() => this.showMenu('shape')}
                  buttonStyle={{
                    backgroundColor: 'red',
                    opacity: 0.5,
                    width: 'auto',
                    height: 50,
                  }}
                />
              }
            >
              <MenuItem onPress={() => this.setState({ shape: 'cube' })}>
                Cube
              </MenuItem>
              <MenuItem onPress={() => this.setState({ shape: 'sphere' })}>
                Sphere
              </MenuItem>
              <MenuItem onPress={() => this.setState({ shape: 'pyramid' })}>
                Pyramid
              </MenuItem>
              <MenuItem onPress={() => this.setState({ shape: 'icosahedron' })}>
                Icosahedron
              </MenuItem>
              <MenuItem onPress={() => this.setState({ shape: 'octahedron' })}>
                Octahedron
              </MenuItem>
              <MenuItem onPress={() => this.setState({ shape: 'ring' })}>
                Ring
              </MenuItem>
            </Menu>
          </View>
        )}
        {this.state.hideButtons === true ? null : (
          <View style={styles.size}>
            <Menu
              ref={ref => this.setMenuRef(ref, 'size')}
              button={
                <Button
                  raised
                  rounded
                  title="Size"
                  onPress={() => this.showMenu('size')}
                  buttonStyle={{
                    backgroundColor: 'purple',
                    opacity: 0.5,
                    width: 85,
                    height: 50,
                  }}
                />
              }
            >
              <MenuItem onPress={() => this.setState({ size: 'small' })}>
                Small
              </MenuItem>
              <MenuItem onPress={() => this.setState({ size: 'medium' })}>
                Medium
              </MenuItem>
              <MenuItem onPress={() => this.setState({ size: 'large' })}>
                Large
              </MenuItem>
            </Menu>
            <Menu
              ref={ref => this.setMenuRef(ref, 'texture')}
              button={
                <Button
                  raised
                  rounded
                  title="Texture"
                  onPress={() => this.showMenu('texture')}
                  buttonStyle={{
                    backgroundColor: 'green',
                    opacity: 0.5,
                    width: 'auto',
                    height: 50,
                  }}
                />
              }
            >
              <MenuItem onPress={() => this.setState({ texture: 'glass' })}>
                Glass
              </MenuItem>
              <MenuItem onPress={() => this.setState({ texture: 'fire' })}>
                Fire
              </MenuItem>
              <MenuItem onPress={() => this.setState({ texture: 'snow' })}>
                Snow
              </MenuItem>
              <MenuItem onPress={() => this.setState({ texture: 'leaves' })}>
                Leaves
              </MenuItem>
              <MenuItem onPress={() => this.setState({ texture: 'wood' })}>
                Wood
              </MenuItem>
              <MenuItem onPress={() => this.setState({ texture: 'minecraft' })}>
                Minecraft
              </MenuItem>
              <MenuItem onPress={() => this.setState({ texture: 'water' })}>
                Water
              </MenuItem>
              <MenuItem onPress={() => this.setState({ texture: 'bricks' })}>
                Brick
              </MenuItem>
              <MenuItem onPress={() => this.setState({ texture: 'color' })}>
                Color
              </MenuItem>
            </Menu>
            <TouchableOpacity
              onPressIn={this.undo}
              onPressOut={this.stopTimer}
              style={styles.undoButton}
            >
              <Image
                style={{ width: 40, height: 40 }}
                source={{
                  uri:
                    'https://flaticons.net/icons/Mobile%20Application/Command-Undo.png',
                }}
              />
            </TouchableOpacity>

            {/* <Button
              raised
              rounded
              title="Clear"
              onPress={this.undoAll}
              buttonStyle={{
                backgroundColor: 'purple',
                opacity: 0.5,
                width: 85,
                height: 50,
              }}
            /> */}
          </View>
        )}
        <View style={styles.takePhoto}>
          {this.state.hideButtons === false ? null : (
            <Button
              raised
              rounded
              title=" Photo"
              onPress={this.takeScreenshot}
              buttonStyle={{
                backgroundColor: 'blue',
                opacity: 0.3,
                width: 'auto',
                height: 50,
              }}
            />
          )}
          {this.state.hideButtons === true ? null : (
            <Button
              raised
              rounded
              title="Next"
              onPress={this.handleSubmit}
              buttonStyle={{
                backgroundColor: 'black',
                opacity: 0.5,
                width: 85,
                height: 50,
              }}
            />
          )}
          <TouchableOpacity onPress={this.hideAllButtons}>
            <Image
              style={styles.optionButton}
              source={require('./../public/menu.png')}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.draw}>
          <TouchableOpacity
            onPressIn={this.addShapeWithSize}
            onPressOut={this.stopTimer}
          >
            <Image
              style={styles.optionButton}
              source={require('./../public/add.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  _onGLContextCreate = async gl => {
    const width = gl.drawingBufferWidth;
    const height = gl.drawingBufferHeight;

    this.arSession = await this._glView.startARSessionAsync();

    this.scene = new THREE.Scene();
    this.camera = ExpoTHREE.createARCamera(
      this.arSession,
      width,
      height,
      0.01,
      1000
    );
    const renderer = ExpoTHREE.createRenderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

    // Create ambient light and add to scene.
    var light = new THREE.AmbientLight(0x404040); // soft white light
    this.scene.add(light);

    // Create directional light and add to scene.
    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(1, 1, 1).normalize();
    this.scene.add(directionalLight);

    this.scene.background = ExpoTHREE.createARBackgroundTexture(
      this.arSession,
      renderer
    );
    const cameraPosition = this.camera.position;
    this.generateLighting(this.scene);
    var helper = new THREE.CameraHelper(this.camera);
    this.scene.add(helper);

    const animate = () => {
      this.gameRequest = requestAnimationFrame(animate);
      this.camera.position.setFromMatrixPosition(this.camera.matrixWorld);
      const cameraPos = new THREE.Vector3(0, 0, 0);
      cameraPos.applyMatrix4(this.camera.matrixWorld);

      this.graffitiObjects.forEach(art => {
        art.castShadow = true;
        // Fire objects like a gun lol ==>
        // setModelPos(art, this.camera.position);
        // art.position.z -= 0.01;
        // if (art.position.z === -1) {
        //   this.scene.remove(art);
        // }
        // Animates items for live movement
        // art.rotation.x += art.rotator;
        // art.rotation.y += art.rotator;
      });

      renderer.render(this.scene, this.camera);
      gl.endFrameEXP();
    };

    animate();
  };
}

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
  drop: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: height - 700,
    left: width / 2 + 100,
  },
  size: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: height - 650,
    left: width / 2 + 100,
  },
  takePhoto: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: height - 150,
    left: width / 2 + 90,
  },
  draw: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: height - 100,
    left: width / 2 - 25,
  },
  dropView: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: height - 200,
    left: width / 2 - 200,
  },
  colorPicker: {
    position: 'absolute',
    top: height - 80,
    left: width / 2 - 130,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: 17,
    left: 10,
  },
  items: {
    position: 'absolute',
    top: 60,
    left: 25,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 8,
    marginRight: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
  drawButton: {
    backgroundColor: 'black',
    opacity: 0.4,
    width: 100,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  optionButton: {
    opacity: 0.6,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  undoButton: {
    opacity: 0.6,
    width: 100,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
});

function setModelPos(model, dropPos) {
  const item = model.clone();
  item.position.x = dropPos.x;
  item.position.y = dropPos.y;
  item.position.z = dropPos.z;
  item.rotator = 0.2;
  return item;
}
