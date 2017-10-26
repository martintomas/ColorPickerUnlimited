import * as b from 'bobril';

import { ColorPicker } from './src/colorPicker';

let colorsHex = [
    '#ff0000', '#ff4000', '#ff8000', '#ffbf00', '#ffff00', '#bfff00', '#80ff00', '#40ff00', '#00ff00',
    '#00ff40', '#00ff80', '#00ffbf', '#00ffff', '#00bfff', '#00bfff', '#0040ff', '#0000ff', '#4000ff', 
    '#8000ff', '#bf00ff', '#ff00ff', '#ff00bf', '#ff0080', '#ff0040', '#000000', '#ffffff'
];

b.init(() => {
    return [
        b.styledDiv([
            ColorPicker({
                predefinedColors: colorsHex,
                color: '#ffac40',
                onSelectColor: (color: string) => { console.log('Selected color is ' + color); },
                onClose: () => {}
            }),
            ColorPicker({
                color: '#00ffff',
                onSelectColor: (color: string) => { console.log('Selected color is ' + color); },
                onClose: () => {}
            }),
        ],{display: 'flex', width: '100%', justifyContent: 'center', flexFlow: 'row'})
    ];
});