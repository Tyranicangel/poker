import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { GameRoutingModule } from './game-routing.module';
import { TablelistComponent } from './tablelist/tablelist.component';
import { TableComponent } from './table/table.component';
import { GameComponent } from './game.component';
import { Angular2AutoScroll } from 'angular2-auto-scroll/lib/angular2-auto-scroll.directive';

@NgModule({
  imports: [
    CommonModule,
    GameRoutingModule,
    FormsModule
  ],
  declarations: [TablelistComponent, TableComponent, GameComponent, Angular2AutoScroll]
})
export class GameModule { }
