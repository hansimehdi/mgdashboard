import {
    trigger, state, style, transition,
    animate, group, query, stagger, keyframes
  } from '@angular/animations';
  export const SlideInOutAnimation = [
    trigger('slideInOut', [
        state('in', style({
            'max-height': 'auto',
            'opacity': '1',
            'visibility': 'visible'
        })),
        state('out', style({
            'max-height': '0px',
            'opacity': '0',
            'visibility': 'hidden'
        })),
        transition('in => out', [group([
            animate('400ms ease-in-out', style({
                'transform': 'translateX(50px)',
                'opacity': '0'
            })),
            animate('600ms ease-in-out', style({
                'transform': 'translateX(50px)',
                'max-height': '0px'
            })),
            animate('700ms ease-in-out', style({
                'transform': 'translateX(50px)',
                'visibility': 'hidden'
            }))
        ]
        )]),
        transition('out => in', [group([
            animate('1ms ease-in-out', style({
                'transform': 'translateX(50px)',
                'visibility': 'visible'
            })),
            animate('600ms ease-in-out', style({
                'transform': 'translateX(50px)',
                'max-height': 'auto'
            })),
            animate('800ms ease-in-out', style({
                'transform': 'translateX(50px)',
                'opacity': '1'
            }))
        ]
        )])
    ]),
];
