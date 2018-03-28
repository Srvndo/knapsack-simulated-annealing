//WIll hold each knapsack Item
class Item {
    constructor(w, v, index) {
        this.weight = w; //Weight of the item
        this.value = v; //Weight of the value
        this.index = index //Index of the value
    }

    getItem = () => {
        return {
            weight: this.weight,
            value: this.value,
            index: this.index
        };
    }
}

class Bag {
    constructor(size, dataset) {
        this.size = size
        this.itemSet = []; //Will hold the overall dataset
        this.currentSolution = []; //Will hold the current solution

        for (let i = 0; i < dataset.length; i++) {
            var item = new Item(dataset[i][0], dataset[i][1], i);
            this.itemSet.push(item);
        }

        let temp = getRandomAsInt(0, this.itemSet.length); //Generate a random number
        this.currentSolution.push(this.getItemBasedOnIndex(this.itemSet, temp)); //Pull out an item with that index and push it to Current Solution
    }

   
    /**
    * Get an item from the itemSet provided as and argument based on the index
    */
    getItemBasedOnIndex = (itemSet, index) => {
        let item = null;

        itemSet.map(i => {
            if (i.index === index) {
                item = i;
            }
        });
        return item;
    }

    /**
     * Calculates and return the summation of list of item weights
     */
    getWeightForList = (itemSet) => {
        let sum = 0;

        itemSet.map(item => { sum += item.weight });

        return sum;
    }

    getValueForList = (itemSet) => {
        let sum = 0;

        itemSet.map(item => { sum += item.value });

        return sum;
    }

    /**
     * Checks wether te current selection is overweight or not
     */
    checkOverweight = (itemSet) => {
        if (this.getWeightForList(itemSet) > this.size)
            return true;
        else
            return false;
    }

    /**
     * Returns any random item from the itemset which is not in the currentSolution of the bag
     */
    getRandomItemFormItemSet = () => {
        let temp = getRandomAsInt(0, this.itemSet.length);
        let item = this.getItemBasedOnIndex(this.itemSet, temp);

        while (this.getItemBasedOnIndex(this.currentSolution, temp) != null) {
            temp = getRandomAsInt(0, this.itemSet.length);
            item = this.getItemBasedOnIndex(this.itemSet, temp);
        }

        return item;
    }

    /**
     * Modifies the current Selection
     */
    modifySelection = () => {
        let modified = this.currentSolution.clone();
        let item = this.getRandomItemFormItemSet();
        modified.push(item);
        while (this.checkOverweight(modified)) {
            var dropIndex = getRandomAsInt(0, modified.length);
            modified.removeItem(dropIndex);

            //console.log(dropIndex, modified);
        }

        return modified;
    }

    /**
     * Calculates the remaining space in the bag
     */
    calculateRemainingSpace = (itemSet) => {
        return (this.size - this.getValueForList(itemSet));
    }

    printSolution = (itemSet) => {

        return {
            bestValue: this.getValueForList(itemSet),
            itemSet: itemSet
        };
    }
}

/**
* Returns a random integer between minimum (inclusive) and maximum (exclusive)
*/
function getRandomAsInt(min, max) {
    return Math.floor(Math.random() * (max - min) + + min);
}

Array.prototype.clone = function () {
    return this.slice(0);
};

Array.prototype.removeItem = function (index) {
    var i = 0;
    while (i < this.length) {
        if (i === index) {
            this.splice(i, 1);
        }
        i++;
    }
};

export {Bag, Item};