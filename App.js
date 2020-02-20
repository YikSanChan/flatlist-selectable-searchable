import React, { useEffect, useState } from "react";
import { SafeAreaView, FlatList, StyleSheet, View } from "react-native";
import Constants from "expo-constants";
import { Set } from "immutable";
import { Button, Icon, ListItem, SearchBar } from "react-native-elements";
import axios from "axios";

const Item = ({ id, title, avatarUrl, selected, onClick }) => {
  console.log(`rendering item ${id}`);
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

const Items = ({ data, selected, onClick }) => {
  console.log("rendering items");
  const _renderItem = ({ item }) => (
    <Item
      id={item.email}
      title={`${item.name.title} ${item.name.first} ${item.name.last}`}
      avatarUrl={item.picture.thumbnail}
      selected={selected.has(item.email)}
      onClick={onClick}
    />
  );
  return (
    <FlatList
      data={data}
      renderItem={_renderItem}
      keyExtractor={item => item.email}
      extraData={selected}
    />
  );
};

const App = () => {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(Set());
  const [searchKey, setSearchKey] = useState("");
  const [searched, setSearched] = useState([]);
  const [mode, setMode] = useState("search");

  useEffect(() => {
    const fetchData = async () => {
      console.log("fetching data");
      const results = await axios("https://randomuser.me/api/?results=5");
      setItems(results.data.results);
    };
    fetchData();
  }, []);

  const header = {
    search: (
      <SearchBar
        placeholder="Type Here..."
        onChangeText={text => {
          setSearchKey(text);
          setSearched(
            items.filter(item => {
              const name = `${item.name.title} ${item.name.first} ${
                item.name.last
              }`;
              return name.toLowerCase().includes(text.toLowerCase());
            })
          );
        }}
        value={searchKey}
      />
    ),
    select: (
      <View
        style={{ flexDirection: "row", justifyContent: "flex-end", height: 58 }}
      >
        <Icon
          name="printer"
          type="antdesign"
          onPress={() => console.log(`Print ${selected}`)}
        />
        <Icon
          name="delete"
          type="antdesign"
          onPress={() => console.log(`Delete ${selected}`)}
        />
      </View>
    )
  };

  const data = {
    search: searchKey === "" ? items : searched,
    select: items
  };

  const onClick = {
    search: id => console.log(`Press on ${id}`),
    select: React.useCallback(
      id => {
        const newSelected = selected.has(id)
          ? selected.delete(id)
          : selected.add(id);
        setSelected(newSelected);
      },
      [selected]
    )
  };

  const buttonTitle = {
    search: "Select",
    select: "Search"
  };

  const buttonOnPress = {
    search: () => {
      setMode("select");
      setSearched(items);
    },
    select: () => {
      setMode("search");
      setSelected(Set());
    }
  };

  // Perf issue: Every time selected change, Items get re-rendered
  return (
    <SafeAreaView style={styles.container}>
      {header[mode]}
      <Items data={data[mode]} selected={selected} onClick={onClick[mode]} />
      <Button title={buttonTitle[mode]} onPress={buttonOnPress[mode]} />
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
  },
  title: {
    fontSize: 32
  }
});
