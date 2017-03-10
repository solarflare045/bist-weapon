import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Gear } from '../../../../models/gear.model';

export interface IGearWithSlotName extends Gear {
  slotID: string;
  slotName: string;
}

@Component({
  selector: 'app-gear-set',
  templateUrl: './gear-set.html',
})
export class GearSetComponent {
  @Input() canEdit: boolean;
  @Input() gears: IGearWithSlotName[];
  @Input() title: string;
  @Input() updateEnabled: boolean;
  @Input() updating: boolean;

  @Output() edit = new EventEmitter<{ slot: string, gear: Gear}>();
  @Output() update = new EventEmitter();

  editRow(ev: { slot: string, gear: Gear }): void {
    if (!this.canEdit) { return; }
    this.edit.next(ev);
  }
}
