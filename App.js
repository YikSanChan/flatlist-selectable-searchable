import React from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Text,
  View
} from "react-native";
import Constants from "expo-constants";
import { Set } from "immutable";
import { Button, Icon, SearchBar } from "react-native-elements";

const DATA = [
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    title: "First Item"
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    title: "Second Item"
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    title: "Third Item"
  }
];

const Item = ({ id, title, selected, onClick }) => {
  return (
    <TouchableOpacity
      onPress={() => onClick(id)}
      style={[
        styles.item,
        { backgroundColor: selected ? "#6e3b6e" : "#f9c2ff" }
      ]}
    >
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const Items = ({ data, selected, onClick }) => {
  return (
    <FlatList
      data={data}
      renderItem={({ item }) => (
        <Item
          id={item.id}
          title={item.title}
          selected={!!selected.get(item.id)}
          onClick={onClick}
        />
      )}
      keyExtractor={item => item.id}
      extraData={selected}
    />
  );
};

const App = () => {
  const [selected, setSelected] = React.useState(Set());
  const [searchKey, setSearchKey] = React.useState("");
  const [searched, setSearched] = React.useState(DATA);
  const [mode, setMode] = React.useState("search");

  const header = {
    search: (
      <SearchBar
        placeholder="Type Here..."
        onChangeText={text => {
          setSearchKey(text);
          setSearched(
            DATA.filter(item =>
              item.title.toLowerCase().includes(text.toLowerCase())
            )
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
    search: searched,
    select: DATA
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
      setSearched(DATA);
    },
    select: () => {
      setMode("search");
      setSelected(Set());
    }
  };

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
