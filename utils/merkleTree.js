"use strict";
exports.__esModule = true;
exports.MerkleTree = exports.MiMCSponge = void 0;
var circomlib = require("circomlib");
var mimcsponge = circomlib.mimcsponge;
function MiMCSponge(left, right) {
    return mimcsponge.multiHash([BigInt(left), BigInt(right)]).toString();
}
exports.MiMCSponge = MiMCSponge;
var MerkleTree = /** @class */ (function () {
    function MerkleTree(levels, defaultLeaves, hashLeftRight) {
        var _this = this;
        if (defaultLeaves === void 0) { defaultLeaves = []; }
        if (hashLeftRight === void 0) { hashLeftRight = MiMCSponge; }
        this.zeroValue = "21663839004416932945382355908790599225266501822907911457504978515578255421292";
        this.levels = levels;
        this.hashLeftRight = hashLeftRight;
        this.storage = new Map();
        this.zeros = [];
        this.totalLeaves = 0;
        // build zeros depends on tree levels
        var currentZero = this.zeroValue;
        this.zeros.push(currentZero);
        for (var i = 0; i < levels; i++) {
            currentZero = this.hashLeftRight(currentZero, currentZero);
            this.zeros.push(currentZero);
        }
        if (defaultLeaves.length > 0) {
            this.totalLeaves = defaultLeaves.length;
            // store leaves with key value pair
            var level_1 = 0;
            defaultLeaves.forEach(function (leaf, index) {
                _this.storage.set(MerkleTree.indexToKey(level_1, index), leaf);
            });
            // build tree with initial leaves
            level_1++;
            var numberOfNodesInLevel = Math.ceil(this.totalLeaves / 2);
            for (level_1; level_1 <= this.levels; level_1++) {
                for (var i = 0; i < numberOfNodesInLevel; i++) {
                    var leftKey = MerkleTree.indexToKey(level_1 - 1, 2 * i);
                    var rightKey = MerkleTree.indexToKey(level_1 - 1, 2 * i + 1);
                    var left = this.storage.get(leftKey);
                    var right = this.storage.get(rightKey) || this.zeros[level_1 - 1];
                    if (!left)
                        throw new Error("leftKey not found");
                    var node = this.hashLeftRight(left, right);
                    this.storage.set(MerkleTree.indexToKey(level_1, i), node);
                }
                numberOfNodesInLevel = Math.ceil(numberOfNodesInLevel / 2);
            }
        }
    }
    MerkleTree.indexToKey = function (level, index) {
        return level + "-" + index;
    };
    MerkleTree.prototype.getIndex = function (leaf) {
        for (var _i = 0, _a = this.storage; _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            if (value === leaf) {
                return Number(key.split("-")[1]);
            }
        }
        return -1;
    };
    MerkleTree.prototype.root = function () {
        return this.storage.get(MerkleTree.indexToKey(this.levels, 0)) || this.zeros[this.levels];
    };
    MerkleTree.prototype.proof = function (indexOfLeaf) {
        var _this = this;
        var pathElements = [];
        var pathIndices = [];
        var leaf = this.storage.get(MerkleTree.indexToKey(0, indexOfLeaf));
        if (!leaf)
            throw new Error("leaf not found");
        // store sibling into pathElements and target's indices into pathIndices
        var handleIndex = function (level, currentIndex, siblingIndex) {
            var siblingValue = _this.storage.get(MerkleTree.indexToKey(level, siblingIndex)) || _this.zeros[level];
            pathElements.push(siblingValue);
            pathIndices.push(currentIndex % 2);
        };
        this.traverse(indexOfLeaf, handleIndex);
        return {
            root: this.root(),
            pathElements: pathElements,
            pathIndices: pathIndices,
            leaf: leaf
        };
    };
    MerkleTree.prototype.insert = function (leaf) {
        var index = this.totalLeaves;
        this.update(index, leaf, true);
        this.totalLeaves++;
    };
    MerkleTree.prototype.update = function (index, newLeaf, isInsert) {
        var _this = this;
        if (isInsert === void 0) { isInsert = false; }
        if (!isInsert && index >= this.totalLeaves) {
            throw Error("Use insert method for new elements.");
        }
        else if (isInsert && index < this.totalLeaves) {
            throw Error("Use update method for existing elements.");
        }
        var keyValueToStore = [];
        var currentElement = newLeaf;
        var handleIndex = function (level, currentIndex, siblingIndex) {
            var siblingElement = _this.storage.get(MerkleTree.indexToKey(level, siblingIndex)) || _this.zeros[level];
            var left;
            var right;
            if (currentIndex % 2 === 0) {
                left = currentElement;
                right = siblingElement;
            }
            else {
                left = siblingElement;
                right = currentElement;
            }
            keyValueToStore.push({
                key: MerkleTree.indexToKey(level, currentIndex),
                value: currentElement
            });
            currentElement = _this.hashLeftRight(left, right);
        };
        this.traverse(index, handleIndex);
        // push root to the end
        keyValueToStore.push({
            key: MerkleTree.indexToKey(this.levels, 0),
            value: currentElement
        });
        keyValueToStore.forEach(function (o) {
            _this.storage.set(o.key, o.value);
        });
    };
    // traverse from leaf to root with handler for target node and sibling node
    MerkleTree.prototype.traverse = function (indexOfLeaf, handler) {
        var currentIndex = indexOfLeaf;
        for (var i = 0; i < this.levels; i++) {
            var siblingIndex = void 0;
            if (currentIndex % 2 === 0) {
                siblingIndex = currentIndex + 1;
            }
            else {
                siblingIndex = currentIndex - 1;
            }
            handler(i, currentIndex, siblingIndex);
            currentIndex = Math.floor(currentIndex / 2);
        }
    };
    return MerkleTree;
}());
exports.MerkleTree = MerkleTree;
