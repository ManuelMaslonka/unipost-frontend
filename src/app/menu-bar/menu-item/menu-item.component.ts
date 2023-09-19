import {
  Component,
  Input
} from '@angular/core';
import {MenuItem} from "../menu-item.model";

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.sass']
})
export class MenuItemComponent {

  @Input()
  item?: MenuItem;

}
