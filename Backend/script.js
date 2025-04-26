const express = require('express')
const mongoose = require('mongoose')
const Task = require('./model/task.model')
const app = express()
const cors = require('cors')
app.use(express.json())
app.use(cors())
require('dotenv').config()
const PORT =  process.env.PORT

mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser: true,  useUnifiedTopology: true})
.then(()=>{
    console.log("Connected to db")
    app.listen(PORT,()=>{
        console.log(`Listening on port ${PORT}`)
    })
})
.catch((error)=>{
    console.log(`An error occured ${error}`)
})

app.get("/",async(req,res)=>{
    try {
        const tasks = await Task.find({})
        res.json(tasks)
    } catch (error) {
        res.status(500).json({message: `An error occured ${error}`})
    }
})

app.post('/add',async(req,res)=>{
    try {
        const {taskTitle,taskDescription} = req.body
        const newTask = await Task.create({
            taskTitle,
            taskDescription
        })
        res.status(200).json(newTask)
    } catch (error) {
        res.status(500).json({message: error})
    }
})

app.put('/update/:id',async(req,res)=>{
    try {
        const { id } = req.params
        const updateUser = await Task.findByIdAndUpdate(id,req.body, {new: true})
        res.status(200).json(updateUser)
    } catch (error) {
        res.status(500).json({message: 'An error occured'})
    }
})

app.delete('/delete/:id',async(req,res)=>{
    try {
        const  { id } = req.params
        await Task.findByIdAndDelete(id)
        res.status(200).json('Delete successfully')
    } catch (error) {
        res.status(500).json({message: error})
    }
})