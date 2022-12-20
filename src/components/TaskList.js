import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Task from './Task'
import TaskForm from './TaskForm'
import axios from 'axios'
import loadingImg from '../assets/loader.gif'
import { URL } from '../App'

function TaskList () {
  const [completedTasks, setCompletedTasks] = useState([])
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [taskId, setTaskId] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    completed: false
  })
  const { name } = formData

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const getTasks = async () => {
    setIsLoading(true)
    try {
      const { data } = await axios.get(`${URL}/api/tasks/`)
      setTasks(data)
      setIsLoading(false)
    } catch (error) {
      toast.error(error.message)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getTasks()
  }, [])

  const createTask = async (e) => {
    e.preventDefault()
    if (name === '') {
      return toast.error('Input field cannot be empty')
    }

    try {
      await axios.post(`${URL}/api/tasks/`, formData)
      toast.success('Task added successfully')
      setFormData({ ...formData, name: '' })
      getTasks()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${URL}/api/tasks/${id}`)
      getTasks()
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    const cTasks = tasks.filter(task => task.completed === true)
    setCompletedTasks(cTasks)
  }, [tasks])

  const getSingleTask = async (task) => {
    setFormData({
      name: task.name,
      completed: false
    })
    setTaskId(task._id)
    setIsEditing(true)
  }

  const updateTask = async (e) => {
    e.preventDefault()
    if (name === '') {
      return toast.error('Input field cannot be empty')
    }
    try {
      await axios.put(`${URL}/api/tasks/${taskId}`, formData)
      setFormData({ ...formData, name: '' })
      setIsEditing(false)
      getTasks()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const setToComplete = async (task) => {
    const newFormData = {
      name: task.name,
      completed: true
    }
    try {
      await axios.put(`${URL}/api/tasks/${task._id}`, newFormData)
      toast.success('Task updated successfully')
      getTasks()
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div>
      <h2>Sparx MERN Tasks Manager</h2>
      <p>Special thanks to <i>Ewomazino Akpareva (Zino)</i> for the awesome course.</p>
      <TaskForm
        createTask={createTask}
        handleInputChange={handleInputChange}
        name={name}
        isEditing={isEditing}
        updateTask={updateTask}
      />
      {tasks.length > 0 && (
        <div className='--flex-between --pb'>
          <p>
            <b>Total Tasks:</b> {tasks.length}
          </p>
          <p>
            <b>Completed Tasks:</b> {completedTasks.length}
          </p>
        </div>
      )}
      <hr />
      {
        isLoading && (
          <div className='--flex-center'>
            <img src={loadingImg} alt='loading' />
          </div>
        )
      }
      {
        !isLoading && tasks.length === 0
          ? (
            <p className='--py'>No tasks added.</p>
            )
          : (
            <>
              {tasks.map((task, index) => {
                return (
                  <Task
                    key={task._id}
                    task={task}
                    index={index}
                    deleteTask={deleteTask}
                    getSingleTask={getSingleTask}
                    setToComplete={setToComplete}
                  />
                )
              })}
            </>
            )
      }
    </div>
  )
}

export default TaskList
