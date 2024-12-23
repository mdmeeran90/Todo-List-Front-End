import React, { useEffect, useState } from 'react'

export default function Todo() {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(-1);

  //Edit
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const apiUrl = "https://todo-list-backend-togu.onrender.com";

  const handleSubmit = () => {
    setError("");
    //Check input values
    if (title.trim() !== '' && description.trim() !== '') {
      fetch(apiUrl + "/todos", {
        method: "POST",
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ title, description })
      }).then((res) => {
        if (res.ok) {
          //Add item to list
          setTodos([...todos, { title, description }]);
          setTitle("");
          setDescription("");
          setMessage("Item added successfully");
          setTimeout(() => {
            setMessage("");
          }, 3000);
        }
        else {
          //Set error
          setError("Unable to create Todo item")
        }
      })
        .catch(() => {
          setError("Unable to create Todo item")
        })
    }
  }

  useEffect(() => {
    getItems()
  }, [])

  const getItems = async() => {
    await fetch(apiUrl + "/todos")
      .then((res) => res.json())
      .then((res) => {
        setTodos(res)
      })
  }

  const handleEdit = (item) => {
    setEditId(item._id);
    setEditTitle(item.title);
    setEditDescription(item.description);
  }

  const handleUpdate = () => {
    setError("")
    //check inputs
    if (editTitle.trim() !== '' && editDescription.trim() !== '') {
      fetch(apiUrl + "/todos/" + editId, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle, description: editDescription })
      }).then((res) => {
        if (res.ok) {
          //Update item to list
          const updatedTodos = todos.map((item) => {
            if (item._id === editId) {
              item.title = editTitle;
              item.description = editDescription;
            }
            return item;
          })

          setTodos(updatedTodos);
          setEditTitle("");
          setEditDescription("");
          setMessage("Item updated successfully");
          setTimeout(() => {
            setMessage("");
          }, 3000);

          setEditId(-1);

        } else {
          //set error
          setError("Unable to create Todo item")
        }
      }).catch(() => {
        setError("Unable to create Todo item")
      })
    }
  }

  const handleEditCancel = () => {
    setEditId(-1)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure want to delete?')) {
      fetch(apiUrl + '/todos/' + id, {
        method: "DELETE"
      })
        .then(() => {
          const updatedTodos = todos.filter((item) => item._id !== id);
          setTodos(updatedTodos)
        })
    }
  }

  return <div style={{ overflowX: 'hidden' }}>
    <div className='row p-3 bg-success text-light'>
      <h1>ToDo Project with Mern stack</h1>
    </div>
    <div className='row'>
      <h3 className='mt-3'>Add Task</h3>
      {message && <p className='text-success text-center'>{message}</p>}
      <div className='form-group d-flex gap-2 px-4 mt-2'>
        <input className='form-control' value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder='Title' />
        <input className='form-control' value={description} onChange={(e) => setDescription(e.target.value)} type="text" placeholder='Description' />
        <button className='btn btn-dark' onClick={handleSubmit}>Submit</button>
      </div>
      {error && <p className='text-danger'>{error}</p>}
    </div>

    <div className='row mt-3 p-3'>
      <h3>Tasks</h3>
      <div className='col-md-6'>
        <ul className="list-group">
          {
            todos.map((item) =>
              <li className='list-group-item bg-info d-flex justify-content-between align-items-center my-2'>
                <div className='d-flex flex-column me-1'>
                  {
                    editId === -1 || editId !== item._id ?
                      <>
                        <span className='fw-bold'>{item.title}</span>
                        <span>{item.description}</span>
                      </> :
                      <>
                        <div className='form-group d-flex gap-2'>
                          <input className='form-control' value={editTitle} onChange={(e) => setEditTitle(e.target.value)} type="text" placeholder='Title' />
                          <input className='form-control' value={editDescription} onChange={(e) => setEditDescription(e.target.value)} type="text" placeholder='Description' />
                        </div>
                      </>
                  }
                </div>
                <div className='d-flex gap-3'>
                  {editId === -1 || editId !== item._id ? <button className="btn btn-warning" onClick={() => handleEdit(item)}>Edit</button> :
                    <button className="btn btn-warning" onClick={handleUpdate} >Update</button>}
                  {editId === -1 || editId !== item._id ? <button className="btn btn-danger" onClick={() => handleDelete(item._id)}>Delete</button> :
                    <button className="btn btn-danger" onClick={handleEditCancel}>Cancel</button>}
                </div>
              </li>
            )
          }
        </ul>
      </div>
    </div>
  </div>
}
