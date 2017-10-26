const regExpHex = new RegExp('^#[a-f0-9]{6}$', 'i');

export declare type rgb = {
    r: number,
    g: number,
    b: number
};

export declare type hsv = {
    h: number,
    s: number,
    v: number
}

export function HexToRGB(hex:string): rgb {
    //console.log('Computing RGB value');

    hex = hex.trim();

    let res = {r: 0, g: 0, b: 0};
    res.r = parseInt(hex.substring(1, 3), 16);
    res.g = parseInt(hex.substring(3, 5), 16);
    res.b = parseInt(hex.substring(5, 7), 16);

    return res;
}

export function RGBToHex(rgb: rgb): string {
    //console.log('Computing HEX value')

    let res: string = '#';
    res += computeHexFromRGB(rgb.r);
    res += computeHexFromRGB(rgb.g);
    res += computeHexFromRGB(rgb.b);

    return res;
}

function computeHexFromRGB(value: number): string {
    let val: string = value.toString(16);
    return val.length > 1 ? val : '0' + val;
}

export function HSVToRGB(hsv: hsv): rgb {
    let r: number, g: number, b: number;
    let i: number, f: number, p: number, q: number, t: number;

    i = Math.floor(hsv.h * 6);
    f = hsv.h * 6 - i;
    p = hsv.v * (1 - hsv.s);
    q = hsv.v * (1 - f * hsv.s);
    t = hsv.v * (1 - (1 - f) * hsv.s);
    switch (i % 6) {
        case 0: r = hsv.v, g = t, b = p; break;
        case 1: r = q, g = hsv.v, b = p; break;
        case 2: r = p, g = hsv.v, b = t; break;
        case 3: r = p, g = q, b = hsv.v; break;
        case 4: r = t, g = p, b = hsv.v; break;
        case 5: r = hsv.v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

export function RGBToHSV(rgb: rgb): hsv {
    let r: number = rgb.r / 255;
    let g: number = rgb.g / 255;
    let b: number = rgb.b / 255;
  
    let max: number = Math.max(r, g, b), min: number = Math.min(r, g, b);
    let h: number, s: number, v: number = max;
  
    let d: number = max - min;
    s = max === 0 ? 0 : d / max;
  
    if (max === min) {
      h = 0; // achromatic
    } else {
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
  
      h /= 6;
    }
  
    return {h: h, s: s, v: v};
}

export function validateHexCode(value: string): boolean {
    //console.log('Validation of hex code');

    value = value.trim();
    return regExpHex.test(value);
}

export function validateRGBCode(value: string): boolean {

    if (!Number(value) && value !== '0') return false;

    let n: number = parseInt(value, 10);
    if (isNaN(n)) return false;
    if (n < 0 || n > 255) return false;

    return true;
}