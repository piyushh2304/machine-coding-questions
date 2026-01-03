// Implement customMap(arr, fn) without using .map()

function customMap(arr, fn) {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
        result.push(fn(arr[i], i, arr));
    }
    return result
}

const nums = [1, 2, 3, 4];
const squared = customMap(nums, (num) => num * num);

console.log(squared); // [1, 4, 9, 16]
console.log(nums);



// Implement customFilter(arr, fn) without using .filter()
function customFilter(arr, fn) {
    const result = [];

    for (let i = 0; i < arr.length; i++) {
        if (fn(arr[i], i, arr)) {
            result.push(arr[i]);
        }
    }

    return result;
}

// Example usage
const nums2 = [1, 2, 3, 4, 5, 6];
const even = customFilter(nums2, (num) => num % 2 === 0);

console.log(even); // [2, 4, 6]
console.log(nums2); // original remains unchanged

//sumAll(...args) → use rest params, ignore non-numbers

function sumALL(...args) {
    let sum = 0;
    for (let value of args) {
        if (typeof value === "number" && !isNaN(value)) {
            sum += value;
        }
    }
    return sum;
}

console.log(sumALL(1, "hello", 3, null, 5, undefined, 2)); // 17
console.log(sumALL(10, 20, "30", {}, 5)); // 35
console.log(sumALL()); // 0



//Merge 2 arrays using spread ... and return unique sorted values

function mergeUniqueSort(arr1, arr2) {
    const merged = [...arr1, ...arr2];
    const unique = new Set(merged);//unique values
    return [...unique].sort((a, b) => a - b);
}
console.log(mergeUniqueSort([3, 1, 2], [2, 4, 3])); // [1,2,3,4]
console.log(mergeUniqueSort(["b", "a"], ["a", "c"])); // ["a","b","c"]

//countVowels(str) → return {vowels, consonants} using a function

function countVowels(str) {
    const vowels = "aeiouAEIOU";
    let count = { vowels: 0, consonants: 0 };
    for (let char of str) {
        if (vowels.includes(char)) {
            count.vowels++;
        } else if (char.toLowerCase() != " ") {
            count.consonants++;
        }
    }
    return count;
}
console.log(countVowels("hello")); // {vowels:2,consonants:3}


//Intermediate (closure + HOF)

//create counter

function createCounter(init) {
    let count = init;
    return function () {
        count++;
        return count;
    }
}

const counter = createCounter(5);
console.log(counter()); // 6
console.log(counter()); // 7


//blocked code
function counter(n) {
    let count = n;
    count++;
    return count;
}

const countt = counter(5);//this must return a function , but it returns a number
console.log(countt);
console.log(countt());


//debounce logic

function debounce(fn, delay) {
    let timer;

    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn(...args);
        }, delay);
    };
}

// Example usage
const debouncedLog = debounce((msg) => console.log(msg), 300);
debouncedLog("A");
debouncedLog("B");
debouncedLog("C"); // Only "C" will execute after 300ms


//async retry function
async function retry(fn, attempts, delay) {
    for (let i = 1; i <= attempts; i++) {
        try {
            return await fn(); // try executing the promise function
        } catch (error) {
            if (i === attempts) throw error; // if last attempt, throw the error
            await new Promise(res => setTimeout(res, delay)); // wait before retrying
        }
    }
}
const fetchData = () => Promise.reject("Failed");

retry(fetchData, 3, 1000)
    .then(console.log)
    .catch(console.error);


//question : memoization concept : 
function memoize(fn) {
    const cache = {}; // object to store previous results

    return function (...args) {
        const key = JSON.stringify(args); // convert input into unique key

        if (key in cache) {
            return cache[key]; // return stored result if already cached
        }

        const result = fn(...args); // compute result
        cache[key] = result;        // store it in cache
        return result;             // return result
    };
}

// Example usage
function slowSquare(n) {
    console.log("Computing...");
    return n * n;
}

const fastSquare = memoize(slowSquare);

console.log(fastSquare(5)); // Computes and caches → 25
console.log(fastSquare(5)); // Returns from cache, no computing again → 25
console.log(fastSquare(6)); // Computes and caches → 36




//question : Fetch simulation → Create fakeFetch(url) that resolves/rejects randomly & handle errors safely
function fakeFetch(url) {
    return new Promise((resolve, reject) => {
        const success = Math.random() > 0.5; // random true/false

        setTimeout(() => {
            if (success) {
                resolve(`Data from ${url}`);
            } else {
                reject(`Network error at ${url}`);
            }
        }, 500);
    });
}

async function callFetch() {
    try {
        const data = await fakeFetch("users/api")
        console.log("success", data);
    } catch (error) {
        console.error("handled error", error);
    }
}

callFetch()