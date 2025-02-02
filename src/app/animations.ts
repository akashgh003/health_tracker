import { 
    trigger, 
    transition, 
    style, 
    animate, 
    query, 
    stagger, 
    keyframes 
  } from '@angular/animations';
  
  export const fadeInOut = trigger('fadeInOut', [
    transition(':enter', [
      style({ opacity: 0, transform: 'translateY(10px)' }),
      animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
    ]),
    transition(':leave', [
      animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(10px)' }))
    ])
  ]);
  
  export const listAnimation = trigger('listAnimation', [
    transition('* => *', [
      query(':enter', [
        style({ opacity: 0, transform: 'translateX(-10px)' }),
        stagger('60ms', [
          animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
        ])
      ], { optional: true })
    ])
  ]);
  
  export const slideInOut = trigger('slideInOut', [
    transition(':enter', [
      style({ transform: 'translateX(-100%)' }),
      animate('300ms ease-out', style({ transform: 'translateX(0)' }))
    ]),
    transition(':leave', [
      animate('300ms ease-in', style({ transform: 'translateX(-100%)' }))
    ])
  ]);
  
  export const dropdownAnimation = trigger('dropdownAnimation', [
    transition(':enter', [
      style({ transform: 'translateY(-10px)', opacity: 0 }),
      animate('200ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
    ]),
    transition(':leave', [
      animate('200ms ease-in', style({ transform: 'translateY(-10px)', opacity: 0 }))
    ])
  ]);
  
  export const cardAnimation = trigger('cardAnimation', [
    transition(':enter', [
      style({ transform: 'scale(0.95)', opacity: 0 }),
      animate('300ms ease-out', style({ transform: 'scale(1)', opacity: 1 }))
    ])
  ]);