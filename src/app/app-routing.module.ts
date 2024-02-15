import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from './pages/home/home.component'
import {LabsComponent} from './pages/labs/labs.component'

const routes: Routes = [

  { path: 'home',
   component: HomeComponent },
  { path: 'labs',
   component: LabsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
