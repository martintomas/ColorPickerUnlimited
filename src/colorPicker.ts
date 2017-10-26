import * as b from 'bobril';
import * as m from 'bobril-m';

import { ColorPreview } from './components/colorPreview';
import { ColorBar } from './components/colorBar';
import { PredefinedColor } from './components/predefinedColor';
import { rgb, hsv, RGBToHex, HexToRGB, HSVToRGB, RGBToHSV, validateRGBCode, validateHexCode } from './components/graphicServices';

const defaultColor = { r: 50, g: 50, b: 50 };
const marginStyle = b.styleDef({margin: '0 1% 0 1%'});

export interface IColorPickerData {
    predefinedColors?: string[];
    color?: string;
    onSelectColor: (string) => void;
    onClose: () => void;
}

interface IColorPickerCtx extends b.IBobrilCtx{
    data: IColorPickerData;
    activeColor: rgb;
    activeColorHexTemp: string;
    useTempColor: boolean;
    previewHsv: hsv;
}

function getColorPreview(ctx: IColorPickerCtx): b.IBobrilNode {
    return ColorPreview({
        previewHsv: ctx.previewHsv,
        onChange: (color) => {
            ctx.previewHsv = color;
            ctx.activeColor = HSVToRGB(color);
            b.invalidate(ctx);
        }
    });
}

function getColorBar(ctx: IColorPickerCtx): b.IBobrilNode {
    return ColorBar({
        previewHue: ctx.previewHsv.h,
        onChangeColor: (color) => {
            ctx.previewHsv.h = color;
            ctx.activeColor = HSVToRGB(ctx.previewHsv);
            b.invalidate(ctx);
        }
    });
}

function getColorPreviewSimple(ctx: IColorPickerCtx): b.IBobrilNode {
    return b.styledDiv(undefined, {
        height: 20, backgroundColor:  RGBToHex(ctx.activeColor), margin: 5
    });
}

function getColorValues(ctx: IColorPickerCtx): b.IBobrilNode {
    return b.styledDiv([
        getHexTextBox(ctx, '23%'),
        getRGBTextBox(ctx, 'Red:', 'r', '23%'),
        getRGBTextBox(ctx, 'Green:', 'g', '23%'),
        getRGBTextBox(ctx, 'Blue:', 'b', '23%')
    ],{display: 'flex', flexFlow: 'row', justifyContent: 'center', width: '95%', margin: '0px auto 0px auto'});
}

function getRGBTextBox(ctx: IColorPickerCtx, label: string, colorCode: string, width: string) : b.IBobrilNode {
    return b.styledDiv([
        m.TextField({
            labelText: label, 
            value: ctx.activeColor[colorCode].toString(),
            onChange: (value: string) => {
                value = value === '' ? '0' : value;
                if(validateRGBCode(value)) {
                    ctx.activeColor[colorCode] = parseInt(value, 10);
                    ctx.previewHsv = RGBToHSV(ctx.activeColor);
                    b.invalidate(ctx);
                }
            }
        })
    ], marginStyle, {width: width});
}

function getHexTextBox(ctx: IColorPickerCtx, width: string) : b.IBobrilNode {
    // actualize temp color based on new color --> only in case that change was not triggered by this node
    if (!ctx.useTempColor) ctx.activeColorHexTemp = RGBToHex(ctx.activeColor); 
    ctx.useTempColor = false; // reset

    return b.styledDiv([
        m.TextField({
            errorText: validateHexCode(ctx.activeColorHexTemp) ? undefined : '',
            labelText: 'Hex:', 
            value: ctx.activeColorHexTemp,
            onChange: (value: string) => {
                if (validateHexCode(value)) {
                    ctx.activeColor = HexToRGB(value);
                    ctx.previewHsv = RGBToHSV(ctx.activeColor);
                    b.invalidate(ctx);
                }
                ctx.activeColorHexTemp = value;
                ctx.useTempColor = true; // remmember to show temporal value
                b.invalidate(ctx);
            }
        })
    ], marginStyle, {width: width});
}

function getColorButton(ctx: IColorPickerCtx): b.IBobrilNode {
    return b.styledDiv([
        b.styledDiv(m.Button({
            children: 'Select',
            action: () => { ctx.data.onSelectColor( RGBToHex(ctx.activeColor) ); },
            type: m.ButtonType.Raised
        }), marginStyle, {display: 'inline-block'}),
        b.styledDiv(m.Button({
            children: 'Close',
            action: ctx.data.onClose,
            type: m.ButtonType.Raised
        }), marginStyle, {display: 'inline-block'})
    ],{textAlign: 'center'});
}

function getColorPicker(ctx: IColorPickerCtx): b.IBobrilNode {
    return [
        getColorPreview(ctx),
        getColorBar(ctx),
        getColorPreviewSimple(ctx),
        getColorValues(ctx),
        getColorButton(ctx),
    ];
}

export const ColorPicker = b.createComponent<IColorPickerData>({
    init(ctx: IColorPickerCtx) {
        ctx.activeColor = ctx.data.color ? HexToRGB(ctx.data.color) : defaultColor;
        ctx.previewHsv = RGBToHSV(ctx.activeColor);

        ctx.activeColorHexTemp =  ctx.data.color ? ctx.data.color : RGBToHex(defaultColor);
        ctx.useTempColor = false;
    },    
    render(ctx: IColorPickerCtx, me: b.IBobrilNode) {
        let res: b.IBobrilNode;
        if (ctx.data.predefinedColors) {
            res = m.Paper({ zDepth: 1, style: { display: 'flex', flexFlow: 'row' , width: 400, minHeight: 5}}, [
                b.styledDiv(getColorPicker(ctx),{width: '90%', minWidth: 300}),
                b.styledDiv(ctx.data.predefinedColors.map(color =>
                    PredefinedColor({
                        color: color,
                        onSelectColor: (color: string) => {
                            ctx.activeColor = HexToRGB(color);
                            ctx.previewHsv = RGBToHSV(ctx.activeColor);
                            b.invalidate(ctx);
                        }
                    })), { padding: 5, width: '10%', minWidth: 60 })
            ]);
        } else {
            res = m.Paper({ zDepth: 1, style: { width: 300, minHeight: 5, display: 'flex', flexFlow: 'row'}}, [
                b.styledDiv(getColorPicker(ctx),{width: '100%', minWidth: 300}),
            ]);
        }

        me.style = {padding: 5};
        me.children = res;
    }
});