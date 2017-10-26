import * as b from 'bobril';

import { ColorPointer, riderSize } from './colorPointer';
import { HSVToRGB } from './graphicServices';

const colorBarMainStylye = b.styleDef({
    height: 8,
    marginTop: riderSize/2,
    marginBottom: 5,
    marginLeft: riderSize/2,
    marginRight: riderSize/2,
    background: 'linear-gradient(to right, rgb(255, 0, 0) 0%, rgb(255, 255, 0) 17%, rgb(0, 255, 0) 33%, rgb(0, 255, 255) 50%, rgb(0, 0, 255) 67%, rgb(255, 0, 255) 83%, rgb(255, 0, 0) 100%)'
});

export interface IColorBarData {
    previewHue: number;
    onChangeColor: (number) => void;
}

interface IColorBarCtx extends b.IBobrilCtx {
    data: IColorBarData;
    width: number;
    touch: boolean;
    pointerId: number;
}

function getRelativePosition(ctx: IColorBarCtx, event: b.IBobrilMouseEvent): number {
    return (event.x - b.nodePagePos(ctx.me)[0]) / ctx.width;
}

function isPositionValid(ctx: IColorBarCtx, event: b.IBobrilMouseEvent): boolean {
    return !(ctx.width - riderSize/2 < event.x - b.nodePagePos(ctx.me)[0]) &&
    !(riderSize/2 > event.x - b.nodePagePos(ctx.me)[0])
}

export const ColorBar = b.createComponent<IColorBarData>({
    init(ctx: IColorBarCtx) {
        ctx.width = 0;
    },
    render(ctx: IColorBarCtx, me: b.IBobrilNode) {
        me.children = b.styledDiv([
            b.styledDiv(undefined, colorBarMainStylye),
            b.styledDiv(ColorPointer({
                color: HSVToRGB({h: ctx.data.previewHue, s: 1, v: 1}),
                height: 20,
                x: ctx.data.previewHue * (ctx.width),
                y: riderSize,
            }), {height: 11, position: 'absolute', zIndex: 10, top: -5.5, width: '100%'}),
        ],{position: 'relative', height: 12, marginBottom: 5});
    },
    postInitDom(ctx: IColorBarCtx, me: b.IBobrilCacheNode, element: HTMLElement) {
        ctx.width = element.offsetWidth;
        b.invalidate(ctx);
    },
    postUpdateDom(ctx: IColorBarCtx, me: b.IBobrilCacheNode, element: HTMLElement) {
        ctx.width = element.offsetWidth;
    },
    onPointerDown(ctx: IColorBarCtx, event: b.IBobrilPointerEvent): boolean {
        if (!isPositionValid(ctx, event))
            return false;

        if (!ctx.touch) {
            ctx.touch = true;
            ctx.data.onChangeColor(getRelativePosition(ctx, event));
            ctx.pointerId = event.id;
            b.registerMouseOwner(ctx);
            b.focus(ctx.me);
            return true;
        }
        return false;
    },
    onPointerMove(ctx: IColorBarCtx, event: b.IBobrilPointerEvent): boolean {
        if (!isPositionValid(ctx, event))
            return false;

        if (ctx.touch && ctx.pointerId == event.id) {
            ctx.data.onChangeColor(getRelativePosition(ctx, event));
            return true;
        }
        return false;
    },
    onPointerUp(ctx: IColorBarCtx, event: b.IBobrilPointerEvent): boolean {
        if (ctx.touch && ctx.pointerId == event.id) {
            ctx.touch = false;
            b.releaseMouseOwner();
            b.invalidate(ctx);
            return true;
        }
        return false;
    },
    onPointerCancel(ctx: IColorBarCtx, event: b.IBobrilPointerEvent): boolean {
        if (ctx.touch && ctx.pointerId == event.id) {
            ctx.touch = false;
            b.releaseMouseOwner();
            b.invalidate(ctx);
        }
        return false;
    }
});