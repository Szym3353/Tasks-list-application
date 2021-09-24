<template>
  <div class="py-12 px-6 lg:px-20 flex-wrap-reverse font-sans flex justify-center md:justify-between bg-gradient-to-r from-indigo-600 to-blue-500 min-h-screen">
    <div class="max-w-lg mt-20">
      <h3 class="text-5xl font-extrabold text-white antialiased mb-12">Plan Your Week!</h3>
      <p class="text-gray-300 text-lg indent-4">Plan Your Week is simple application where You can make a list of things you need to do. Select one day of the week and add task.<br/><br/>You can set task as <span class="text-red-300">important</span> which will mark it with <span class="text-red-300">red</span> color or set is as <span class="text-green-300">done</span> when you finished.<br/><br/>All data is stored only in <span class="font-bold">Your current browser*</span> which mean that You can't view Your tasks list on any other device or even browser.</p>
      <p class="text-xs text-gray-300 mt-12">* Data is stored in browser Local Storage, nobody can get it, nobody can see it.</p>
    </div>
    <div class="max-w-md w-full bg-gradient-to-br from-white to-gray-300 rounded-lg filter drop-shadow-2xl py-10 px-4">
      <h3 class="py-2 text-black font-bold text-2xl">{{todayMessage}} <span class="font-extrabold text-indigo-600">{{today}}</span></h3>
      <div class="flex justify-between">
        <button @click="moveDayBy(-1)">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <p class="text-xs text-center py-3 text-gray-500">{{todaysDate}}</p>
        <button @click="moveDayBy(1)">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <div class="flex my-10 filter drop-shadow-md">
        <input class="focus:outline-none border border-blue-600 w-full p-2" v-model="input">
        <button @click="addTask" class="bg-gradient-to-r from-blue-600 to-indigo-700 px-2 text-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>
      <p class="bg-gradient-to-r from-indigo-600 to-blue-500 filter drop-shadow-md text-center text-white mt-10">Your tasks ({{todaysTasksDone}}/{{todaysTasks.length}})</p>
      <ul class="overflow-y-auto max-h-80 scrollbar">
        <li v-for="(task, key) in todaysTasks" :key="key" class="break-words bg-white filter drop-shadow-md my-2 p-2 pb-0" :class="{'border-l-2': task.done, 'border-green-600': task.done}">
          <span :class="{'bg-red-200': task.important}">{{task.task}}</span>
          <br/>
          <button @click="markAsDone(key)" class="px-1 py-1 my-2 text-gray-400 font-bold" :class="{'text-green-800': task.done}">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </button><button @click="markAsImportant(key)" class="px-1 py-1 text-gray-400 font-bold" :class="{'text-red-800': task.important}">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
            </svg>
          </button><button @click="deleteTask(key)" class="px-1 py-1 text-gray-400 font-bold">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      today: '',
      moveDay: 0,
      todaysDate: '',
      currentDateFull: null,
      todaysTasks: [],
      todaysTasksDone: 0,
      todayMessage: `Today is`,
      input: '',
    }
  },
  mounted(){
    const date = new Date()
    this.todaysDate = `${this.checkIfZero(date.getDate())} - ${this.checkIfZero(date.getMonth())} - ${date.getFullYear()}`
    this.setTasksList()
    this.getWeekDay(date.getDay())
    this.currentDateFull = date
  },
  methods:{
    setTasksList(){
      this.todaysTasksDone = 0
      this.$store.state.tasks.forEach(element => {
        let elementFullDate = new Date(element.date)
        let elementDate = `${this.checkIfZero(elementFullDate.getDate())} - ${this.checkIfZero(elementFullDate.getMonth())} - ${elementFullDate.getFullYear()}`
        if(elementDate == this.todaysDate) {
          if(element.done == true) this.todaysTasksDone+=1
          this.todaysTasks.push({task: element.task, date: element.date, important: element.important, done: element.done})
        }
      })

    },
    checkIfZero(number){
      if(number < 10) return `0${number}`
      return number
    },
    getWeekDay(value){
      switch(value){
        case 1:
          this.today = 'Monday'
          break;
        case 2:
          this.today = 'Tuesday'
          break;
        case 3:
          this.today = 'Wednesday'
          break;
        case 4:
          this.today = 'Thursday'
          break;
        case 5:
          this.today = 'Friday'
          break;
        case 6:
          this.today = 'Saturday'
          break;
        case 0:
          this.today = 'Sunday'
          break;
      }
    },
    moveDayBy(number){
      this.moveDay+=number
      this.todaysTasks = []


      //Why if spam? https://stackoverflow.com/questions/6665997/switch-statement-for-greater-than-less-than - It should be the fastest
      if(this.moveDay == 0) this.todayMessage = 'Today is'
      if(this.moveDay == 1) this.todayMessage = 'Tomorrow will be'
      if(this.moveDay == -1) this.todayMessage = 'Yesterday was'
      if(this.moveDay < -1) this.todayMessage = `${this.moveDay * -1} Days ago was`
      if(this.moveDay > 1) this.todayMessage = `In ${this.moveDay} Days will be`
      
      
      
      
      let previousDate = new Date()
      let currentDate = new Date(previousDate)
      currentDate.setDate(previousDate.getDate() + this.moveDay)
      this.currentDateFull = currentDate
      this.todaysDate = `${this.checkIfZero(currentDate.getDate())} - ${this.checkIfZero(currentDate.getMonth())} - ${currentDate.getFullYear()}`
      this.setTasksList()
      this.getWeekDay(currentDate.getDay())
      
    },
    addTask(){
      let date = this.currentDateFull
      if(!this.input) return
      this.$store.commit('addTask', {task: this.input, date: date.toString(), done: false, important: false})
      this.todaysTasks.push({task: this.input, date: date.toString(), done: false, important: false})
      this.input = null
    },
    markAsDone(index){
      this.todaysTasks[index].done = !this.todaysTasks[index].done
      this.todaysTasks[index].done ? this.todaysTasksDone+=1 : this.todaysTasksDone+=-1
      this.$store.commit('markAsDone', this.todaysTasks[index])
    },
    markAsImportant(index){
      this.todaysTasks[index].important = !this.todaysTasks[index].important
      this.$store.commit('markAsImportant', this.todaysTasks[index])
    },
    deleteTask(index){
      this.$store.commit('deleteTask', this.todaysTasks[index])
      if(this.todaysTasks[index].done) this.todaysTasksDone+=-1
      this.todaysTasks.splice(index, 1)
    }
  }
}
</script>
<style>
  .scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

/* Track */
.scrollbar::-webkit-scrollbar-track {
  border-radius: 100vh;
  background: #edf2f7;
}

/* Handle */
.scrollbar::-webkit-scrollbar-thumb {
  background: rgb(187, 198, 228);
  border-radius: 100vh;
}

/* Handle on hover */
.scrollbar::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}
</style>