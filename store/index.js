export const state = () => ({
    tasks: [],
})

export const mutations = {
    addTask(state, task){
        state.tasks.push(task)
    },
    markAsDone(state, arrayElement){
        let foundArrayElement = state.tasks.find(element => element.date == arrayElement.date && element.task == arrayElement.task)
        foundArrayElement.done = !foundArrayElement.done
    },
    markAsImportant(state, arrayElement){
        let foundArrayElement = state.tasks.find(element => element.date == arrayElement.date && element.task == arrayElement.task)
        foundArrayElement.important = !foundArrayElement.important
    },
    deleteTask(state, arrayElement){
        let filterTasksArray = state.tasks.filter(element => {
            return element.date != arrayElement.date && element.task != arrayElement.task
        })
        state.tasks = filterTasksArray
    },
}