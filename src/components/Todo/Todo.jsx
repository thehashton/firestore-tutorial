import { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import './Todo.css';

const Todo = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [editId, setEditId] = useState(null);
    const [editText, setEditText] = useState('');


    // Fetch Todos from Firestore
    useEffect(() => {
        const fetchTodos = async () => {
            const querySnapshot = await getDocs(collection(db, "todos"));
            setTodos(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id})))
        };
        fetchTodos();
    }, []); // Only runs once

    // Add a new Todo
    const addTodo =  async () => {
        if (newTodo.trim() === '') return;
        const docRef = await addDoc(collection(db, "todos"), {
            text: newTodo,
            completed: false
        });
        setTodos([...todos, { text: newTodo, completed: false, id: docRef.id }]);
        setNewTodo('');
    }

    // Delete a Todo
    const deleteTodo = async (id) => {
        await deleteDoc(doc(db, "todos", id));
        setTodos(todos.filter(todo => todo.id !== id));
    }

    // Start editing a todo
    const startEdit = (id, currentText) => {
        setEditId(id);
        setEditText(currentText);
    };

    // Save the edited Todo
    const saveEdit = async (id) => {
        const docRef = doc(db, "todos", id);
        await updateDoc(docRef, {
            text: editText
        });
        setTodos(todos.map(todo => todo.id === id ? { ...todo, text: editText } : todo))
        setEditId(null); // Exiting the edit mode
        setEditText(''); // Clearing the edit text
    }

    return (
        <>
            <div>
                <h1>Todo</h1>
                <input type="text" value={newTodo} onChange={(event) => setNewTodo(event.target.value)} />
                <button onClick={addTodo}>Add Todo</button>
            </div>
            <ul>
                {todos.map(todo => (
                    <li key={todo.id}>
                        {
                            editId === todo.id ? (
                                <>
                                    <input
                                        type="text"
                                        value={editText}
                                        onChange={(event) => setEditText(event.target.value)}
                                    />
                                    <button className='save' onClick={() => saveEdit(editId, editText)}>Save</button>
                                </>
                            ) : (
                                <>
                                    {todo.text}
                                    <button onClick={() => startEdit(todo.id, todo.text)}>Edit</button>
                                    <button className='delete' onClick={() => deleteTodo(todo.id)}>Delete</button>
                                </>
                            )
                        }
                    </li>
                ))}
            </ul>
        </>
    )
}

export default Todo;