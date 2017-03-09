import * as _ from 'lodash';

export interface SlotInfo {
  id: string;
  name: string;
}

export const SLOT_INFOS: SlotInfo[] = [
  { id: 'mainHand', name: 'Main Hand' },
  { id: 'offHand' , name: 'Off Hand'  },
  { id: 'head'    , name: 'Head'      },
  { id: 'neck'    , name: 'Neck'      },
  { id: 'shoulder', name: 'Shoulder'  },
  { id: 'back'    , name: 'Back'      },
  { id: 'chest'   , name: 'Chest'     },
  { id: 'wrist'   , name: 'Wrist'     },
  { id: 'hands'   , name: 'Hands'     },
  { id: 'waist'   , name: 'Waist'     },
  { id: 'legs'    , name: 'Legs'      },
  { id: 'feet'    , name: 'Feet'      },
  { id: 'finger1' , name: 'Finger 1'  },
  { id: 'finger2' , name: 'Finger 2'  },
  { id: 'trinket1', name: 'Trinket 1' },
  { id: 'trinket2', name: 'Trinket 2' },
];

export const SLOTS = _.map(SLOT_INFOS, (slot) => slot.id);
