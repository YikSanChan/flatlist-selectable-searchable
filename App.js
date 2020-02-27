import React, { memo, useEffect, useState } from "react";
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

const MemoizedItem = memo(Item);

const PAGE_SIZE = 10;

// With pagination support to avoid wasting resource in loading unseen rows
const Items = ({ data, selected, onClick }) => {
  const [seenData, setSeenData] = useState([]);
  const [page, setPage] = useState(0); // load 1 page for the first time
  const maxPage = Math.floor((data.length - 1) / PAGE_SIZE) + 1;

  useEffect(
    () => {
      console.log("side effect on new page");
      setSeenData(data.slice(0, page * PAGE_SIZE));
    },
    [page]
  );

  useEffect(
    () => {
      console.log("side effect on new data")
      setPage(1);
      setSeenData(data.slice(0, PAGE_SIZE)); // Cannot move it to above effect
    },
    [data]
  );

  function handleEndReached() {
    console.log("handle end...");
    if (page < maxPage) setPage(page + 1);
  }

  console.log("rendering items");
  console.log(
    `data=${data.length}, seenData=${
      seenData.length
    }, page=${page}, maxPage=${maxPage}`
  );
  const _renderItem = ({ item }) => (
    <MemoizedItem
      id={item.email}
      title={`${item.name.title} ${item.name.first} ${item.name.last}`}
      avatarUrl={item.picture.thumbnail}
      selected={selected.has(item.email)}
      onClick={onClick}
    />
  );
  // TODO: onEndReached triggered twice.
  // Possible fix: https://github.com/facebook/react-native/issues/14015#issuecomment-310675650
  return (
    <FlatList
      data={seenData}
      renderItem={_renderItem}
      keyExtractor={item => item.email}
      extraData={selected}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0}
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
      const results = await axios("https://randomuser.me/api/?results=50");
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
    select: React.useCallback(id => {
      setSelected(
        selected => (selected.has(id) ? selected.delete(id) : selected.add(id))
      );
    }, [])
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

  console.log("rendering app");

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
