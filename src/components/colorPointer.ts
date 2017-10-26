import * as b from 'bobril';

import { rgb } from './graphicServices';

export const riderSize = 11;
export const riderBorder = 1;
const innerRadius = riderSize / 2 - 1;
const outerRadius = 5;

export interface IColorPointerData {
    x: number;
    y: number;
    height: number;
    color?: rgb
}

interface IColorPointerCtx extends b.IBobrilCtx {
    data: IColorPointerData;
}

function colorToString(color: { [colorType: string]: number }) {
    return 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
}

export const ColorPointer = b.createComponent<IColorPointerData>({
    render(ctx: IColorPointerCtx, me: b.IBobrilNode) {
        me.children = {
            tag: 'svg',
            style: {
                width: '100%',
                height: ctx.data.height,
            },
            children: [
                {
                    tag: 'circle',
                    attrs: {
                        cx: ctx.data.x || 0,
                        cy: ctx.data.y || 0,
                        r: outerRadius,
                        fill: 'transparent',
                        stroke: 'black',
                        'stroke-width': riderSize / 2
                    }
                },
                {
                    tag: 'circle',
                    attrs: {
                        cx: ctx.data.x || 0,
                        cy: ctx.data.y || 0,
                        r: innerRadius,
                        fill: ctx.data.color ? colorToString(ctx.data.color) : 'black',
                        stroke: 'black',
                        'stroke-width': riderBorder
                    }
                }
            ]
        };
    }
});