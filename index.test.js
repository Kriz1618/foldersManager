const manager = require('./index.js');

describe("Folders Manager Test", () => {
    let path = {};

    beforeEach(() => {
        path = {};
    });

    describe("Create folders", () => {
        it("Invalid task", () => {
            const result = manager.manageFolders('UPDATE', path);

            expect(result).toEqual('Invalid task');
            expect(path).toEqual({});
        });
        
        it("Shouldn't create a new folder", () => {
            const result = manager.manageFolders('CREATE', path);

            expect(result).toEqual(undefined);
            expect(path).toEqual({});
        });
        
        it("Should create a new folder", () => {
            const result = manager.manageFolders('CREATE toys/dolls', path);

            expect(result).toEqual(undefined);
            expect(path).toEqual({ "toys": { "dolls": "" } });
        });
        
        it("Should create a new sub folder", () => {
            path["food"] = "";
            const result = manager.manageFolders('CREATE food/vegetables', path);
            expect(result).toEqual(undefined);
            expect(path).toEqual({ "food": { "vegetables": "" } });
        });
    });

    describe("Move folders", () => {
        it("Shouldn't move a folder to invalid destiny", () => {
            path = { food: { fruits: "" } };
            const result = manager.manageFolders('MOVE toys/dolls cars', path);

            expect(result).toEqual("Cannot move dolls - toys/dolls does not exist");
            expect(path).toEqual({ food: { fruits: "" } });
        });

        it("Shouldn't move a folder from invalid origin", () => {
            path = { food: { fruits: { onion: "" }, vegetables: "" } };
            const result = manager.manageFolders('MOVE food/vegetables toys/cars', path);

            expect(result).toEqual("Cannot move vegetables - toys/cars does not exist");
            expect(path).toEqual({ food: { fruits: { onion: "" }, vegetables: "" } });
        });

        it("Should move a folder", () => {
            path = { food: { fruits: { onion: "" }, vegetables: "" } };
            const result = manager.manageFolders('MOVE food/fruits/onion food/vegetables', path);

            expect(result).toEqual("");
            expect(path).toEqual({ food: { fruits: {}, vegetables: { onion: "" } } });
        });
    });
   
    describe("Delete folders", () => {
        it("Shouldn't remove a folder", () => {
            path = { food: { fruits: "" } };
            const result = manager.manageFolders('DELETE food/dolls', path);

            expect(result).toEqual("Cannot delete food/dolls - dolls does not exist");
            expect(path).toEqual({ food: { fruits: "" } });
        });

        it("Should remove a folder", () => {
            path = { food: { fruits: { onion: "" } } };
            const result = manager.manageFolders('delete food/fruits/onion', path);

            expect(result).toEqual("");
            expect(path).toEqual({ food: { fruits: {} } });
        });
    });

    describe("List folders", () => {
        it("Shouldn't list folders", () => {
            const result = manager.manageFolders('LIST', null);

            expect(result).toEqual("");
        });

        it("Should remove a folder", () => {
            const result1 = manager.manageFolders('create food/fruits/lemon', path);
            const result2 = manager.manageFolders('create food/vegetables/onion', path);
            const result = manager.manageFolders('List', path);

            expect(result1).toEqual(undefined);
            expect(result2).toEqual(undefined);
            expect(result).toEqual("food\n fruits\n   lemon\n vegetables\n   onion\n");
            expect(path).toEqual({ food: { fruits: { lemon: "" }, vegetables: { onion: "" } } });
        });
    });    
});