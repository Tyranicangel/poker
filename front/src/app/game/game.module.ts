import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { GameRoutingModule } from './game-routing.module';
import { TablelistComponent } from './tablelist/tablelist.component';
import { TableComponent } from './table/table.component';
import { GameComponent } from './game.component';

@NgModule({
  imports: [
    CommonModule,
    GameRoutingModule,
    FormsModule
  ],
  declarations: [TablelistComponent, TableComponent, GameComponent]
})
export class GameModule { }
