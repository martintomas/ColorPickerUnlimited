import * as b from 'bobril';

const predefinedColorStyle = b.styleDef({width: 15, height: 15, border: 'solid 1px black', cursor: 'pointer', 
    display: 'inline-block', marginLeft: 3 });

export interface IPredefinedColor {
    color: string;
    onSelectColor: (string) => void;
}

interface IPredefinedColorContext extends b.IBobrilCtx {
    data: IPredefinedColor;
}

export const PredefinedColor = b.createComponent<IPredefinedColor>({
    render(ctx: IPredefinedColorContext, me: b.IBobrilNode) {
        me.tag = 'span';
        b.style(me, predefinedColorStyle, {
            backgroundColor: ctx.data.color
        });
    },
    onClick(ctx: IPredefinedColorContext): boolean {
        ctx.data.onSelectColor(ctx.data.color);
        return true;
    }
})