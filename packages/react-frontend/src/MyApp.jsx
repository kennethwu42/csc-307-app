// src/MyApp.jsx
import React, {useState, useEffect} from 'react';
import Table from "./Table";
import Form from "./Form";

function MyApp() {

  // state is like a shopping cart. You can add or remove items from it
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => { console.log(error); });
  }, [] );

  return (
    <div className="container">
      <Table 
        characterData={characters} 
        removeCharacter={removeOneCharacter}
      />
      <Form handleSubmit={updateList} />
    </div>
  );

  function updateList(person){ 
    postUser(person)
      .then((res) => res.status == 201 ? res.json() : undefined)
      .then((new_character) => setCharacters([...characters, new_character]))
      .catch((error) => {
        console.log(error);
      })
  }

  function removeOneCharacter(index){
    const character_id = characters[index].id;
    deleteUser(character_id);
    const updated_list = characters.filter((characters, i) => {
      return i !== index;
    });
    setCharacters(updated_list);
  }

  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  } 

  function postUser(person) {
    const promise = fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });

    return promise;
  }
  function deleteUser(id){
    fetch(`http://localhost:8000/users/${id}`, {
      method: "DELETE",
    })
  }
  
}


export default MyApp;