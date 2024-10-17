 // src/MyApp.jsx
import React, {useState, useEffect} from 'react';
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = useState([]);

  function deleteUser(id){
    fetch(`http://localhost:8000/users/${id}`, {
      method: "DELETE",
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

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => {console.log(error);});
  }, []);

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

  function updateList(person){ 
    postUser(person)
      .then((res) => res.status == 201 ? res.json() : undefined)
      .then((new_character) => setCharacters([...characters, new_character]))
      .catch((error) => {
        console.log(error);
      })
  } 


  return (
    <div className="container">
      <Table 
        characterData={characters} 
        removeCharacter={removeOneCharacter}
      />
      <Form handleSubmit={updateList} />
    </div>
  ); 
  
}
export default MyApp;
<<<<<<< HEAD
=======


export default MyApp;
>>>>>>> 01ef4c583a2ecb915a2dbc1dbc73de8a2f14e376
