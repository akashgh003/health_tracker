import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { WorkoutFormComponent } from './components/workout-form/workout-form.component';
import { WorkoutListComponent } from './components/workout-list/workout-list.component';
import { StatsViewComponent } from './components/stats-view/stats-view.component';
import { WorkoutService } from './services/workout.service';
import { ThemeService } from './core/theme/theme.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    WorkoutFormComponent,
    WorkoutListComponent,
    StatsViewComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    WorkoutService,
    ThemeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }