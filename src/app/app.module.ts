import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TimeManagementComponent } from './components/time-management/time-management.component';
import { TimeManagementService } from './services/time-management.service';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    TimeManagementComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [TimeManagementService],
  bootstrap: [AppComponent]
})
export class AppModule { }
