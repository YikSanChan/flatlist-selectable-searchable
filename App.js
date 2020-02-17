import React from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Text
} from "react-native";
import Constants from "expo-constants";
import { Set } from "immutable";

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

const Item = ({ id, title, selected, onSelect }) => {
  return (
    <TouchableOpacity
      onPress={() => onSelect(id)}
      style={[
        styles.item,
        { backgroundColor: selected ? "#6e3b6e" : "#f9c2ff" }
      ]}
    >
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const Items = ({ data, selected, onSelect }) => {
  return (
    <FlatList
      data={data}
      renderItem={({ item }) => (
        <Item
          id={item.id}
          title={item.title}
          selected={!!selected.get(item.id)}
          onSelect={onSelect}
        />
      )}
      keyExtractor={item => item.id}
      extraData={selected}
    />
  );
};

const App = () => {
  const [selected, setSelected] = React.useState(Set());

  const onSelect = React.useCallback(
    id => {
      const newSelected = selected.has(id)
        ? selected.delete(id)
        : selected.add(id);
      setSelected(newSelected);
    },
    [selected]
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text>{JSON.stringify(selected, null, 2)}</Text>
      <Items data={DATA} selected={selected} onSelect={onSelect} />
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight
  },
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16
  },
  title: {
    fontSize: 32
  }
});
