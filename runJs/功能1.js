function quickSort(arr, low, high) {
    if (low < high) {
        // pi is partitioning index, arr[pi] is now at right place
        var pi = partition(arr, low, high);

        // Recursively sort elements before and after partition
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

function partition(arr, low, high) {
    var pivot = arr[high];
    var i = (low - 1); // Index of smaller element

    for (var j = low; j < high; j++) {
        // If current element is smaller than or equal to pivot
        if (arr[j] <= pivot) {
            i++;

            // Swap arr[i] and arr[j]
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }

    // Swap arr[i+1] and arr[high] (or pivot)
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];

    return i + 1;
}

// Utility function to print the array

// Example usage
var arr = [10, 7, 8, 9, 1, 5];
console.log("快速排序前:");
console.log(arr);
quickSort(arr, 0, arr.length - 1);
console.log("快速排序后:");
console.log(arr);
