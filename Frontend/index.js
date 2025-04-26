
const container = document.querySelector('.container')
const addTask = document.querySelector('.add-task')
const add = document.querySelector('.add')
const back = document.querySelector('.back')

add.addEventListener('click',()=>{
    container.style.display = 'none'
    addTask.style.display = 'block'
})

back.addEventListener('click',()=>{
    container.style.display = 'block'
    addTask.style.display = 'none'
})

fetch("http://localhost:5000/")
.then((response)=>{
    if(!response.ok){
        console.log('An error occured')
    }else{
        return response.json()
    }
})

.then((tasks)=>{
    tasks.forEach((task)=>{
        const taskDiv = document.createElement('div')
        taskDiv.className = 'task'

        const checkBox = document.createElement('input') 
        checkBox.type = 'checkbox'

        const iconDiv = document.createElement('div')
        iconDiv.className = 'icon'

        const i = document.createElement('i')
        i.className = 'bx bxs-trash'

        const span = document.createElement('span')
        span.className = 'title'
        span.textContent = task.taskTitle
        // main thing

        const span1 = document.createElement('span')
        span1.className = 'desc'
        span1.textContent = task.taskDescription
        // main thing

        if(task.isDone){
            span.style.textDecoration = 'line-through'
        }else{
            span.style.textDecoration = ''
        }

        const checkSpan = document.createElement('div')
        checkSpan.className = 'task-content'

        container.prepend(taskDiv)
        checkSpan.appendChild(checkBox)
        checkSpan.appendChild(span)
        taskDiv.appendChild(checkSpan)
        taskDiv.appendChild(span1)
        taskDiv.appendChild(iconDiv)
        iconDiv.appendChild(i)
        
        checkBox.checked = task.isDone
        checkBox.addEventListener('change',()=>{
            task.isDone = checkBox.checked
            span.style.textDecoration = task.isDone ? 'line-through' : ''
            fetch(`http://localhost:5000/update/${task._id}`,{
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    taskTitle: task.taskTitle,
                    taskDescription: task.taskDescription,
                    isDone: task.isDone
                })
            }).then((response)=>{
                if(!response.ok){
                    console.log('An error occured')
                }else{
                    return response.json()
                }
            }).then((data)=>{
                console.log(`Data added successfully ${data}`)
            })
            .catch((error)=>{
                console.log("An error occured")
            })
            
        })

        i.addEventListener('click',()=>{
            fetch(`http://localhost:5000/delete/${task._id}`,{
                method: 'DELETE',
            }).then((response)=>{
                if(!response.ok){
                    console.log('An error occured')
                }else{
                    taskDiv.remove()
                }
            }).catch(error=>{
                console.log(error)
            })
        })
    })
})

.catch(error=>{
    console.log('An error occured')
})


document.getElementById('form-add-task').addEventListener('submit',(e)=>{
    e.preventDefault()
    const taskTitle = document.getElementById('taskTitle').value
    const taskDescription = document.getElementById('taskDescription').value
    fetch('http://localhost:5000/add',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            taskTitle,
            taskDescription
        })
    })
    .then((response)=>{
        if(!response.ok){
            console.log('An error occured')
        }else{
            return response.json()
        }
    })

    .then((data)=>{
        document.getElementById('taskTitle').value = ''
        document.getElementById('taskDescription').value = ''
    })

    .catch((error)=>{
        console.log('An error occured')
    })
})
