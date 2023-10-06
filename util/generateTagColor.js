export const generateColor = () => {
    let r, g, b;

    do {
        r = Math.floor(Math.random() * 180);
        g = Math.floor(Math.random() * 180);
        b = Math.floor(Math.random() * 180);
    } while (r + g + b >= 390);

    const hexR = r.toString(16).padStart(2, '0');
    const hexG = g.toString(16).padStart(2, '0');
    const hexB = b.toString(16).padStart(2, '0');

    return `#${hexR}${hexG}${hexB}`;
};
