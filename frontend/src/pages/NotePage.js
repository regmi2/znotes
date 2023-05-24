import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ReactComponent as ArrowLeft } from '../assets/arrow-left.svg'

const NotePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);

  useEffect(() => {
    getNote();
  }, [id]);

  const getNote = async () => {
    if (id === 'new') return;

    try {
      const response = await fetch(`/api/notes/${id}/`);
      const data = await response.json();
      setNote(data);
    } catch (error) {
      console.error('Error fetching note:', error);
    }
  };

  const getCookie = (name) => {
    const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return cookieValue ? cookieValue.pop() : '';
  };

  const createNote = async () => {
    try {
      const csrftoken = getCookie('csrftoken'); // Function to retrieve the CSRF token from the cookie
  
      const response = await fetch(`/api/notes/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken, // Include the CSRF token in the request headers
        },
        body: JSON.stringify(note),
      });
  
      if (response.ok) {
        console.log('Note created successfully');
      } else {
        console.error('Failed to create note:', response.status);
      }
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const updateNote = async () => {
    try {
      const csrftoken = getCookie('csrftoken'); // Function to retrieve the CSRF token from the cookie, you can implement it separately
  
      const response = await fetch(`/api/notes/${id}/update/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken, // Include the CSRF token in the request headers
        },
        body: JSON.stringify(note),
      });
  
      if (response.ok) {
        console.log('Note updated successfully');
      } else {
        console.error('Failed to update note:', response.status);
      }
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const deleteNote = async () => {
    try {
      const csrftoken = getCookie('csrftoken'); // Function to retrieve the CSRF token from the cookie, you can implement it separately
  
      const response = await fetch(`/api/notes/${id}/delete/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken, // Include the CSRF token in the request headers
        },
      });
  
      if (response.ok) {
        console.log('Note deleted successfully');
        navigate('/')

      } else {
        console.error('Failed to delete note:', response.status);
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  

  const handleSubmit = () => {
    if (id !== 'new' && note.body == '') {
      console.log('id does not equal new')
        deleteNote()
    } 
    else if(id !=='new'){
        updateNote()
    } else if(id === 'new' && note.body !== null) {
        createNote()
    }

    navigate('/');
  };

  const handleChange = (value) => {
    setNote(note => ({ ...note, 'body': value }))
}

  return (
    <div className='note'>
      <div className="note-header">
        <h3>
          <Link to="/">
          <ArrowLeft onClick={handleSubmit} />

        </Link>
       </h3>
       
       {
        
        id !== 'new' ? (
            <button onClick={deleteNote}>
            Delete
          </button>
        ) : (
            <button onClick={handleSubmit}>Done</button>
        )

       }
       
      </div>
      <textarea 
        onChange={(e) => { handleChange(e.target.value) }}
        value={note?.body}
      >


      </textarea>
    </div>
  );
};

export default NotePage;