import { Component, Injector, Input, computed, effect, inject, signal } from '@angular/core';
import { Task } from 'src/app/models/task.model';

import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  styleUrls: ['./home.component.css'],
  imports: [ReactiveFormsModule]

})
export class HomeComponent {

  taskCtrl =  new FormControl('',{
    nonNullable : true,
    validators:[
      Validators.required,
      Validators.pattern(/^\S.*\S$/)

    ]
  })
  tasks = signal<Task[]>( [])
  filter = signal("all")
  taskByFilter = computed(()=> {
    const filter = this.filter()
    const tasks = this.tasks()
    const pending = tasks.filter((tasks) => !tasks.completed )

    if( filter === "pending"){
      return  pending
    }
    if( filter === "completed"){
      return tasks.filter((tasks) => tasks.completed )
    }
    return tasks

  })
  injector = inject(Injector)

  ngOnInit(){
    const storage = localStorage.getItem('tasks')
    if(storage){
      const task = JSON.parse(storage)
      this.tasks.set(task)
    }
    this.tracktask()
  }

  tracktask(){
    effect(() =>{
      const tasks = this.tasks()
      localStorage.setItem('tasks', JSON.stringify(tasks))
      console.log(localStorage)

    },{
      injector: this.injector
    })
  }

  changeHandler(){
    if(this.taskCtrl.valid){
      const value = this.taskCtrl.value
       this.addTask(value)
       this.taskCtrl.setValue('')
    }

  }

  addTask(tittle: string){
    const newTask = {
      id: Date.now(),
      tittle,
      completed: false
    }
    this.tasks.update((tasks) => [...tasks, newTask])

  }
  completed( index:number){
      this.tasks.update((tasks) => {
        return tasks.map((task, position) =>
        {
          if(position === index){
            return {
              ...task,
              completed: !task.completed
            }
          }return task
        }

        )
      })

  }

  deleteTask(index: number){
      this.tasks.update((tasks) => tasks.filter((task, position) => position !== index))



  }
  editTask(index :number){
    this.tasks.update((tasks) => {
      return tasks.map((task, position) =>
      {
        if(position === index){
          return {
            ...task,
            editing: true,

          }

        }return {
          ...task,
          editing: false
        }
      }

      )
    })

  }
  saveEditTask(index :number, event:Event){
    const input =event.target as HTMLInputElement
    this.tasks.update((tasks) => {
      return tasks.map((task, position) =>
      {
        if(position === index){
          return {
            ...task,
            tittle: input.value,
            editing: false


          }

        }return task

      }

      )
    })

  }

  changeFilter(filter: string){
    this.filter.set(filter)

  }
}
