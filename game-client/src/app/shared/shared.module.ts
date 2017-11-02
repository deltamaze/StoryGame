import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

 import { PropToArrayPipe } from './prop-to-array.pipe';

@NgModule({
  imports:      [ CommonModule ],
  declarations: [ PropToArrayPipe ],
  exports:      [ PropToArrayPipe,
                  CommonModule, FormsModule, ReactiveFormsModule ]
})

export class SharedModule { }

