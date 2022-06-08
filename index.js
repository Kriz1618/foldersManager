'use strict'

const lineReader = require('line-reader');

function manageFolders(command, path) {
    const root = path || {};

    const task = command.split(' ')[0]?.toUpperCase();
    const args = command.split(' ')[1];
    const extraArg = command.split(' ')[2];

    switch (task) {
        case 'CREATE': {
            createPath(root, args);
            break;
        }
        case 'MOVE': {
            return moveFolder(root, args, extraArg);
        }
        case 'DELETE': {
            return removeFolder(root, args);
        }
        case 'LIST': {
            return showPaths(root, 0);
        }
        default:
            return 'Invalid task';
    }
}

function createPath(root, args) {
    const argsList = args?.split('/');

    if (!argsList?.length) {
        return '';
    }
    if (argsList.length > 1) {
        const mainPath = root[argsList[0]] || {};
        root[argsList[0]] = createPath(mainPath, argsList.slice(1).join('/'));
        return root;
    }
    
    root[argsList[0]] = '';
    return root;
}

function showPaths(root, identation) {
    if (!root || typeof root !== 'object') {
        return '';
    }

    let result = '';
    const mainFolders = Object.keys(root);
    const identationStr = new Array(identation).join(' ');

    for (let i = 0; i < mainFolders.length; i++) {
        result += `${identationStr}${mainFolders[i]}\n`;
        result += showPaths(root[mainFolders[i]], identation + 2);
    }

    return result;
}

function removeFolder(root, folderPath) {
    const paths = folderPath.split('/');
    const folder = paths.at(-1);
    let lastPath = root;
    let error = `Cannot delete ${folderPath} - ${folder} does not exist`;
    let deleted = false;
    
    for (const path of paths) {
        if (lastPath.hasOwnProperty(folder)) {
            delete lastPath[folder];
            deleted = true;
            break;
        }
        if (!lastPath[path]) {
            error = `Cannot delete ${folderPath} - ${path} does not exist`;
            break;
        }

        lastPath = lastPath[path];
    }

    if (!deleted) {
        return error;
    }

    return '';
}

function moveFolder(root, folderPath, destiny) {
    const validOrigin = validatePath(root, folderPath);
    const validDestiny = validatePath(root, destiny);
    const folder = folderPath.split('/').pop();
    const error = `Cannot move ${folder} - `;
    
    if (!validOrigin || !validDestiny) {
        return `${error}${!validOrigin ? folderPath : destiny} does not exist`;
    }

    removeFolder(root, folderPath);
    createPath(root, `${destiny}/${folder}`);
    return '';
}

function validatePath(root, path) {
    const folders = path.split('/');
    let subPath = root;

    for (const folder of folders) {
        if (!subPath.hasOwnProperty(folder)) {
            return false;
        }
        subPath = subPath[folder];
    }

    return true;
}

/* istanbul ignore next */
(function main() {
    if (process.argv[2] !== 'main') {
        return;
    }

    const root = {};
    lineReader.eachLine('entryFile.txt', (task) => {
        const result = manageFolders(task, root) || '';
        console.log(task);
        console.log(result);
    });
})();

module.exports = { manageFolders };