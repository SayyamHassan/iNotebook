import React, { useState } from "react";
import NoteContext from "./noteContext";
//import  { useNavigate } from 'react-router-dom'

const NoteState = (props) => {
 // let navigate = useNavigate(); 
  const host = "http://localhost:5000"; 
  const notesIntial = []
  const [notes, setNotes] = useState(notesIntial);

  const getNotes = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch("http://localhost:5000/api/notes/fetchallnotes", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
  
    // If unauthorized, handle in the component
    if (response.status === 401) {
      return { error: true, message: "Unauthorized" };
    }
  
    const json = await response.json();
    setNotes(json);
    return { error: false };
  };
  

  const addNote = async (title, description, tag) => {
    const token = localStorage.getItem('token');
    const response = await fetch("http://localhost:5000/api/notes/addnote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description, tag }),
    });
  
    if (response.status === 401) {
      return { error: true, message: "Unauthorized" };
    }
  
    const json = await response.json();
    setNotes([...notes, json]); // Add the new note to the state
    return { error: false };
  };
  
  
  
  const deleteNote =async (id) => {
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "Delete",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
         localStorage.getItem('token')
      }
    });
    const json = response.json();
    console.log(json)

    console.log("Deleting the note with id " + id);
    const newNotes = notes.filter((note) => note._id !== id);
    setNotes(newNotes); // Update the state with the filtered notes
  };
  
  const editNote = async (id, title, description, tag) => {
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
         localStorage.getItem('token')
      },
      body: JSON.stringify({title,description,tag}),
    });

    const json = await response.json();
    console.log(json)
    let newNotes=JSON.parse(JSON.stringify(notes))


    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }
      
    }
    setNotes(newNotes);
  };
  return (
    <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote,getNotes }}>
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
