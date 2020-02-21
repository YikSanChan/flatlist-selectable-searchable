import React, { memo, useEffect, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet } from "react-native";
import Constants from "expo-constants";
import { Set } from "immutable";
import { Button, ListItem } from "react-native-elements";
import axios from "axios";

const Item = ({ id, title, avatarUrl, selected, onClick }) => {
  console.log(`rendering item id=${id}, selected=${selected}`);
  return (
    <ListItem
      title={title}
      leftAvatar={{ source: { uri: avatarUrl } }}
      containerStyle={[
        styles.item,
        { backgroundColor: selected ? "#6e3b6e" : "#f9c2ff" }
      ]}
      underlayColor="transparent"
      onPress={() => onClick(id)}
    />
  );
};

const MemoizedItem = memo(Item);

const Items = ({ data, selectedItems, onClick }) => {
  console.log("rendering items");
  const _renderItem = ({ item }) => (
    <MemoizedItem
      id={item.email}
      title={`${item.name.title} ${item.name.first} ${item.name.last}`}
      avatarUrl={item.picture.thumbnail}
      selected={selectedItems.has(item.email)}
      onClick={onClick}
    />
  );
  return (
    <FlatList
      data={data}
      renderItem={_renderItem}
      keyExtractor={item => item.email}
      extraData={selectedItems}
    />
  );
};

const App = () => {
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState(Set());

  useEffect(() => {
    const fetchData = async () => {
      console.log("fetching data");
      // Read 5 random users back
      // Each user is like this:
      // {
      //   "gender":"male",
      //     "name":{
      //   "title":"Mr",
      //       "first":"Harley",
      //       "last":"Zhang"
      // },
      //   "location":{
      //   "street":{
      //     "number":6470,
      //         "name":"Buckleys Road"
      //   },
      //   "city":"Palmerston North",
      //       "state":"Manawatu-Wanganui",
      //       "country":"New Zealand",
      //       "postcode":90911,
      //       "coordinates":{
      //     "latitude":"66.2907",
      //         "longitude":"-18.0881"
      //   },
      //   "timezone":{
      //     "offset":"+8:00",
      //         "description":"Beijing, Perth, Singapore, Hong Kong"
      //   }
      // },
      //   "email":"harley.zhang@example.com",
      //     "login":{
      //   "uuid":"6fda195e-3e63-476c-84d0-7c577c7b74f9",
      //       "username":"smallbear541",
      //       "password":"daisy1",
      //       "salt":"p6AmByUq",
      //       "md5":"0358f2385a9936369adc89b9233f037b",
      //       "sha1":"8decc817cf32ca6e58814502bb3e54152208c5b5",
      //       "sha256":"96ff7627348250646edd31238504271840a0cb6aaac293782f7eec1a6f884c07"
      // },
      //   "dob":{
      //   "date":"1987-12-07T13:00:15.244Z",
      //       "age":33
      // },
      //   "registered":{
      //   "date":"2008-01-23T19:33:01.672Z",
      //       "age":12
      // },
      //   "phone":"(474)-743-9612",
      //     "cell":"(539)-021-1315",
      //     "id":{
      //   "name":"",
      //       "value":null
      // },
      //   "picture":{
      //   "large":"https://randomuser.me/api/portraits/men/49.jpg",
      //       "medium":"https://randomuser.me/api/portraits/med/men/49.jpg",
      //       "thumbnail":"https://randomuser.me/api/portraits/thumb/men/49.jpg"
      // },
      //   "nat":"NZ"
      // }
      const results = await axios("https://randomuser.me/api/?results=5");
      setItems(results.data.results);
    };
    fetchData();
  }, []);

  const onClickUseCallBack = React.useCallback(id => {
    setSelectedItems(selectedItems => {
      return selectedItems.has(id)
        ? selectedItems.delete(id)
        : selectedItems.add(id);
    });
  }, []);

  console.log("rendering app")

  return (
    <SafeAreaView style={styles.container}>
      <Items
        data={items}
        selectedItems={selectedItems}
        onClick={onClickUseCallBack}
      />
      <Button
        title="Print"
        onPress={() => console.log(`Printing selected items ${selectedItems}`)}
      />
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
    marginHorizontal: 16
  },
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8
  }
});
