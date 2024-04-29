export const strAttr = (name, value, depth = 0) => {
    let response = '';
    for (let i = 0; i <= depth; ++i) {
        response += '  ';
    }
    return response + name + ': ' + value + ';\n';
};
