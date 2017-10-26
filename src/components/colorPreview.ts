import * as b from 'bobril';

import { rgb, hsv, RGBToHex, HSVToRGB, RGBToHSV } from './graphicServices';

import { ColorPointer, riderSize } from './colorPointer';

export interface IColorPreviewData {
    previewHsv: hsv;
    onChange: (string) => void;
}

interface IColorPreviewCtx extends b.IBobrilCtx {
    data: IColorPreviewData;
    width: number;
    height: number;
    touch: boolean;
    pointerId: number;
}

function computeRelativePosition(ctx: IColorPreviewCtx, event: b.IBobrilMouseEvent): [number, number] {
    let offset: [number, number] = b.nodePagePos(ctx.me);
    let res: [number, number] = [(event.x - offset[0]) / ctx.width, (event.y - offset[1]) / ctx.height];

    if(res[0] < 0) res[0] = 0;
    if(res[0] > 1) res[0] = 1;
    if(res[1] < 0) res[1] = 0;
    if(res[1] > 1) res[1] = 1;

    return res;
}

function getLayer(background: string): b.IBobrilNode {
    return b.styledDiv(undefined, {
        background: background,
        position: 'absolute',
        width: '100%',
        height: '100%'
    });
}

function getPreview(ctx: IColorPreviewCtx): b.IBobrilNode {
    return [
        getLayer('linear-gradient(to top, rgb(255, 255, 255), rgba(255, 255, 255, 0))'), // saturation effect
        getLayer('linear-gradient(to left, rgb(0, 0, 0), rgba(0, 0, 0, 0))'), // value effect
        b.styledDiv(
            b.styledDiv(
                ColorPointer({
                    height: ctx.height,
                    color: HSVToRGB(ctx.data.previewHsv),
                    x: (1 - ctx.data.previewHsv.v) * ctx.width,
                    y: (1 - ctx.data.previewHsv.s) * ctx.height,
                }), {position: 'absolute', zIndex: 10, width: '100%', height: '100%'}),
            {position: 'relative', width: '100%', height: '100%'})
    ]
}

export const ColorPreview = b.createComponent<IColorPreviewData>({
    init(ctx: IColorPreviewCtx) {
        ctx.width = 0;
        ctx.height = 0;

    },
    render(ctx: IColorPreviewCtx, me: b.IBobrilNode) {
        me.style = {height: 100, backgroundColor: RGBToHex(HSVToRGB({h: ctx.data.previewHsv.h, s: 1, v: 1})), margin: 5, position: 'relative'}
        me.children = getPreview(ctx);
    },
    postInitDom(ctx: IColorPreviewCtx, me: b.IBobrilCacheNode, element: HTMLElement) {
        ctx.width = element.offsetWidth;
        ctx.height = element.offsetHeight;
    },
    postUpdateDom(ctx: IColorPreviewCtx, me: b.IBobrilCacheNode, element: HTMLElement) {
        ctx.width = element.offsetWidth;
        ctx.height = element.offsetHeight;
    },
    onPointerDown(ctx: IColorPreviewCtx, event: b.IBobrilPointerEvent): boolean {
        if (!ctx.touch) {
            ctx.touch = true;
            let pos: [number, number] = computeRelativePosition(ctx, event);
            ctx.data.onChange({
                h: ctx.data.previewHsv.h, 
                s: 1 - pos[1], 
                v: 1 - pos[0]
            });
            ctx.pointerId = event.id;
            b.registerMouseOwner(ctx);
            b.focus(ctx.me);
            return true;
        }
        return false;
    },
    onPointerMove(ctx: IColorPreviewCtx, event: b.IBobrilPointerEvent): boolean {
        if (ctx.touch && ctx.pointerId === event.id) {
            let pos: [number, number] = computeRelativePosition(ctx, event);
            ctx.data.onChange({
                h: ctx.data.previewHsv.h, 
                s: 1 - pos[1], 
                v: 1 - pos[0]
            });
            return true;
        }
        return false;
    },
    onPointerUp(ctx: IColorPreviewCtx, event: b.IBobrilPointerEvent): boolean {
        if (ctx.touch && ctx.pointerId === event.id) {
            ctx.touch = false;
            b.releaseMouseOwner();
            b.invalidate(ctx);
            return true;
        }
        return false;
    },
    onPointerCancel(ctx: IColorPreviewCtx, event: b.IBobrilPointerEvent): boolean {
        if (ctx.touch && ctx.pointerId === event.id) {
            ctx.touch = false;
            b.releaseMouseOwner();
            b.invalidate(ctx);
        }
        return false;
    }
});