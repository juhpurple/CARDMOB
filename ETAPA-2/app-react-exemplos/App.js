import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Image, TextInput, FlatList, Alert } from 'react-native';

const BASE_URL = 'http://10.81.205.38:5000';

export default function App() {
  const [produtos, setProdutos] = useState([]);
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState(null);
  const [descricao, setDescricao] = useState('');

  const [editProdutoId, setEditProdutoId] = useState(null);
  const [editNome, setEditNome] = useState('');
  const [editPreco, setEditPreco] = useState(null);
  const [editDescricao, setEditDescricao] = useState('');

  const [loading, setLoading] = useState(false);

  // Search
  const fetchCompras = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/catalog?page=1`);
      const data = await response.json();
      setProdutos(data.catalog);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompras();
  }, []);

  // Create
  const addItem = async () => {
    try {
      if (nome.trim() === '' || preco === null || descricao.trim() === '') {
        return;
      }
      const response = await fetch(`${BASE_URL}/api/catalog`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: nome.trim(),
          description: descricao.trim(),
          price: Number(preco),
        }),
      });
      if (response.ok) {
        await fetchCompras();
        setNome('');
        setDescricao('');
        setPreco(null);
      } else {
        console.error('Failed to add item:', response.status);
      }
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  // Update
  const updateItem = async (id) => {
    try {
      if (editNome.trim() === '' || editPreco === null || editDescricao.trim() === '') {
        return;
      }
      const response = await fetch(`${BASE_URL}/api/catalog/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editNome.trim(),
          description: editDescricao.trim(),
          price: Number(editPreco),
        }),
      });
      if (response.ok) {
        await fetchCompras();
        setEditProdutoId(null);
        setEditNome('');
        setEditDescricao('');
        setEditPreco(null);
      } else {
        console.error('Failed to update item:', response.status);
        setEditProdutoId(null);
        setEditNome('');
        setEditDescricao('');
        setEditPreco(null);
      }
    } catch (error) {
      console.error('Error updating item:', error);
      setEditProdutoId(null);
      setEditNome('');
      setEditDescricao('');
      setEditPreco(null);
    }
  };

  // Delete
  const deleteItem = async (id) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this item ?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              const response = await fetch(`${BASE_URL}/api/catalog/${id}`, {
                method: 'DELETE',
              });
              if (response.ok) {
                await fetchCompras();
              } else {
                console.error('Failed to delete item:', response.status);
              }
            } catch (error) {
              console.error('Error deleting item:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Read
  const renderItem = ({ item }) => {
    if (item.id !== editProdutoId) {
      return (
        <View style={styles.item}>
          <Image source={{ uri: item.image }} style={{ width: 200, height: 200 }} />
          <Text style={styles.itemText}>{item.name}</Text>
          <Text style={styles.itemText}>{item.description}</Text>
          <Text style={styles.itemText}>{Number(item.price)}</Text>
          <View style={styles.buttons}>
            <Button
              title="Edit"
              onPress={() => {
                setEditProdutoId(item.id);
                setEditNome(item.name);
                setEditPreco(item.price);
                setEditDescricao(item.description);
              }}
            />
            <Button title="Delete" onPress={() => deleteItem(item.id)} />
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.item}>
          <TextInput style={styles.editInput} onChangeText={setEditNome} value={editNome} />
          <TextInput style={styles.editInput} onChangeText={setEditDescricao} value={editDescricao} />
          <TextInput
            style={styles.editInput}
            keyboardType="numeric"
            onChangeText={(text) => {
              const numericText = text.replace(/[^0-9.]/g, '');
              setEditPreco(numericText);
            }}
            value={editPreco?.toString()}
          />
          <Button title="Update" onPress={() => updateItem(item.id)} />
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Nome" />
      <TextInput style={styles.input} value={descricao} onChangeText={setDescricao} placeholder="Descrição" />
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={preco?.toString()}
        onChangeText={(text) => {
          const numericText = text.replace(/[^0-9]/g, '');
          setPreco(Number(numericText));
        }}
        placeholder="Preço"
      />
      <Button title="Incluir Produto" onPress={addItem} />
      <FlatList data={produtos} renderItem={renderItem} keyExtractor={(item) => item.id} style={styles.list} />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 60,
  },
  text: {
    fontSize: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  list: {
    marginTop: 20,
  },
  item: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  itemText: {
    flex: 1,
    marginRight: 10,
  },
  buttons: {
    flexDirection: 'row',
  },
  editInput: {
    flex: 1,
    marginRight: 10,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
});
