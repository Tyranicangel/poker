import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TablelistComponent } from './tablelist/tablelist.component';
import { TableComponent } from './table/table.component';
import { GameComponent } from './game.component';

const routes: Routes = [
	{
		path:'',
		component:GameComponent,
		children:[
			{ path:'',component:TablelistComponent },
			{ path:'table/:id',component:TableComponent },
			{ path:'**', redirectTo:'', pathMatch:'full' }
		]
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class GameRoutingModule { }
