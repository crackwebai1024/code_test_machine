let fs = require("fs");
let inputData = fs.readFileSync("input.txt").toString().split("\n");

// group the input data array as chunk for each test case
const getEachTestCase = (data) => {
  let chunks = [];
  let chunk = [];
  for (let item of data) {
    if (item !== "") {
      chunk.push(item);
    } else {
      chunks.push(chunk);
      chunk = [];
    }
  }
  return chunks;
};

// check the input data format is valid or not, if valid returns true
const checkInputValid = (data) => {
  //total test case
  let testCaseNum = Number(data[0]);

  //check if the number of total testcase is equal to total number
  if (data.length !== testCaseNum + 1) return false;

  //check if each testcase format is valid
  for (let i = 1; i < data.length; i++) {
    let n = Number(data[i][0].split(" ")[0]);
    let m = Number(data[i][0].split(" ")[1]);
    if (data[i].length !== n + 1) return false;
    for (let j = 1; j < data[i].length; j++) {
      if (data[i][j].length !== m) return false;
    }
  }
  return true;
};

//calc metrics for each pixel
const calcPixelMetric = (i, j, arr, flag) => {
  let metric = -1;
  let deep = 0;
  let nodes = [[i, j]];
  flag[i + 1][j + 1] = 1;
  while (metric === -1) {
    let tempNode = [];
    for (let node of nodes) {
      if (arr[node[0]][node[1]] == 1) {
        metric = deep;
      }
      if (!flag[node[0]][node[1] + 1]) {
        tempNode.push([node[0] - 1, node[1]]);
        flag[node[0]][node[1] + 1] = 1;
      }
      if (!flag[node[0] + 2][node[1] + 1]) {
        flag[node[0] + 2][node[1] + 1] = 1;
        tempNode.push([node[0] + 1, node[1]]);
      }
      if (!flag[node[0] + 1][node[1]]) {
        flag[node[0] + 1][node[1]] = 1;
        tempNode.push([node[0], node[1] - 1]);
      }
      if (!flag[node[0] + 1][node[1] + 2]) {
        flag[node[0] + 1][node[1] + 2] = 1;
        tempNode.push([node[0], node[1] + 1]);
      }
    }
    nodes = tempNode;
    deep++;
  }
  return metric;
};

// create flag array
const createFlagArr = (m, n) => {
  let flag = [];
  for (let i = 0; i <= m + 1; i++) {
    let flagRow = [];
    for (let j = 0; j <= n + 1; j++) {
      if (i === 0 || i === m + 1) {
        flagRow.push(1);
        continue;
      }
      if (j === 0 || j === n + 1) flagRow.push(1);
      else flagRow.push(0);
    }
    flag.push(flagRow);
  }
  return flag;
};

//calculate metric for each test case
const calculateMetricArr = (arr) => {
  let n = Number(arr[0].split(" ")[0]);
  let m = Number(arr[0].split(" ")[1]);
  arr.shift();
  let meter = [];
  for (let i = 0; i < n; i++) {
    let metricRow = [];
    for (let j = 0; j < m; j++) {
      let flag = createFlagArr(n, m);
      let metric = calcPixelMetric(i, j, arr, flag);
      metricRow.push(metric);
    }
    meter.push(metricRow);
    fs.appendFileSync("Output.txt", metricRow.join("") + "\n");
  }
  fs.appendFileSync("Output.txt", "\n");
};

let processedData = inputData.map((item) => item.replace("\r", ""));
let testCases = getEachTestCase(processedData);
let isValidFormat = checkInputValid(testCases);
console.log(getEachTestCase(processedData));

if (isValidFormat) {
  for (let i = 1; i < testCases.length; i++) {
    calculateMetricArr(testCases[i]);
  }
}
