'use strict'

function manageFolders(commands) {
    const root = {};

    for (let i = 0; i < commands.length; i++) {
        const task = commands[i].split(' ')[0];
        const args = commands[i].split(' ')[1];
        const extraArg = commands[i].split(' ')[2];

        switch (task) {
            case 'CREATE': {
                createPath(root, args);
                break;
            }
            case 'LIST': {
                showPaths(root, 0);
                console.log('\n');
                break;
            }
            case 'REMOVE': {
                removeFolder(root, args);
                break;
            }
            case 'MOVE': {
                moveFolder(root, args, extraArg);
                break;
            }
            default: return;
        }
    }
}

function createPath(root, args) {
    const argsList = args.split('/');

    if (!argsList.length) {
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
        return;
    }

    const mainFolders = Object.keys(root);
    const identationStr = new Array(identation).join(' ');

    for (let i = 0; i < mainFolders.length; i++) {
        console.log(`${identationStr}${mainFolders[i]}`);
        showPaths(root[mainFolders[i]], identation + 2);
    }
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
        console.log(error);
    }
}

function moveFolder(root, folderPath, destiny) {
    const validOrigin = validatePath(root, folderPath);
    const validDestiny = validatePath(root, destiny);
    const folder = folderPath.split('/').pop();

    if (!validOrigin || !validDestiny) {
        console.log(
            `Cannot move ${folder} - ${validOrigin ? folderPath : destiny} does not exist`,
        );
    }

    removeFolder(root, folderPath);
    createPath(root, `${destiny}/${folder}`);
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

const arg = [
    'CREATE fruits/mongose/poma',
    'CREATE vegetables',
    'CREATE vegetables/potato',
    'CREATE fruits/apples',
    'CREATE fruits/apples/fuji',
    'REMOVE fruits/apples/fuji',
    'CREATE fruits/onion',
    'LIST',
    'CREATE vegetables/potato/yellow',
    'CREATE vegetables/potato/chinese',
    'MOVE fruits/onion vegetables',
    'LIST',
    'REMOVE vegetables/potato/chinese',
    'LIST'
];

manageFolders(arg);
