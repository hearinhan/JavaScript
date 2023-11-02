// 1. 필요한 상수 생성(선언)
const spreadSheetContainer = document.getElementById('spreadsheet-container')
const ROWS = 10 // 행
const COLS = 10 // 렬
const spreadsheet = []
const alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
const exportBtn = document.getElementById('export-btn')

// 3. 객체 데이터 생성하기 -> 2보다 위로 옮겨주고 -> 2 코드 수정
// 각각의 Cell 마다 header(isHeader:true/false) 인지, 입력할 수 있는지(disable), 어떤 데이터가 있는지, row&col 위치는 어디인지 등...을 데이터로 생성한다. 
// 9. rowName, columnName 추가
class Cell {
    constructor(isHeader, disable, data, row, column, rowName, columnName, active = false) { // 기본값 = false
        this.isHeader = isHeader;
        this.disable = disable;
        this.data = data;
        this.row = row;
        this.column = column;
        this.rowName = rowName; // 9에서 추가
        this.columnName = columnName; // 9에서 추가
        this.active = active;
    }
}

// 12. 만든 excel expoprt 해서 csv 로 저장하기
exportBtn.onclick = function(e) {
    // 12-3. csv 로 바꿔주는 함수
    let csv = "";
    for (let i = 0; i <spreadsheet.length; i++) {
        if(i===0) continue; // 첫 줄(A, B, C, D , ... column 순번 써있는 header)은 건너뛰기
        csv += spreadsheet[i]
            .filter( (item) => !item.isHeader)
            .map( (item) => item.data)
            .join(',') + "\r\n"
    }
    console.log("csv :", csv);

    // 13. csv로 변환된 excel 파일 다운로드 
    const csvObj = new Blob([csv]) // 위에서 만든 csv 파일 Blob으로 넣어줌
    const csvUrl = URL.createObjectURL(csvObj) // createObjectURL 함수에 csvObj 넣어줌
    console.log("csvUrl : ", csvUrl);

    const a = document.createElement('a'); // a 요소 만들고 csvURL 넣어주기
    a.href = csvUrl;
    a.download = "Spreadsheet File Name.csv"
    a.click();
}


// 2. 기본 데이터 생성하기 : row 10개, column 10개 (= 표 형태 만듬) -> 코드 수정
initSpreadsheet() // 함수 호출

function initSpreadsheet() { // 함수 선언 및 생성
    for (let i = 0; i < ROWS; i++) {
        let spreadsheetRow = [];
        for (let j = 0; j < COLS; j++) {


            // 6. 첫 번째 컬럼에 숫자 넣기 => cellData
            // 7. header 넣어주기 => isHeader
            // 8. disabled 넣어주기 => disable 
            let cellData ="";
            let isHeader = false;
            let disabled = false;

            if (j === 0) { // 모든 row 의 첫번째 칸은 숫자 넣기
                cellData = i;
                isHeader = true;
                disabled = true;
            }
            if (i === 0) { // 모든 column 의 첫번째 칸은 숫자 넣기 -> alphabets 로 바꿔줌 
                cellData = alphabets[j-1]; // j -> alphabets[j-1]
                isHeader = true;
                disabled = true;
            }
            if ( !cellData ) { // 첫번째 row 이자 첫번째 col 은 '' -> undefined이거나 null 이면 ''
                                  // cellData <=0 -> !cellData
                cellData = "";
            }

            // 9-1. cell 전달 객체에도 rowName, columnName 추가
            const rowName = i;
            const columnName = alphabets[j-1];

            // 3번 코딩 후 수정
            // spreadsheetRow.push(i + "-" + j); // 0-0, 0-1, ... , 8-9, 9-9 -> 3번에 의해 없어짐
            const cell = new Cell(isHeader, disabled, cellData, i, j, rowName, columnName, false); // i + "-" + j -> '' 로 변경 보여지는 값 없게 만듬 
                                                                        // 6-1. '' -> cellData 로 변경 cell 내 data 값 보이게 함.
                                                                        // 7-1. 첫번째 false -> isHeader 로 변경 
                                                                        // 8-1. 두번째 false -> disabled 로 변경
                                                                        // 9-2. cell 전달 객체 rowName, columnName 추가
            spreadsheetRow.push(cell);

         
        }
        spreadsheet.push(spreadsheetRow);
    }
    drawSheet(); // 5번 화면에 보여주기
    console.log("spreadsheet : ", spreadsheet); // 콘솔
}


// 4. cell이 화면에 보이게 input type 으로 생성하기
// 10. cell 에 onclick 이벤트 부여
function createCellEl (cell) {
    const cellEl = document.createElement('input');
    cellEl.className = 'cell';
    cellEl.id = 'cell_' + cell.row + cell.column;
    cellEl.value = cell.data;
    cellEl.disabled = cell.disable;

    // 7-2. isHeader 스타일링
    if (cell.isHeader) {
        cellEl.classList.add('header');
    }

    // 10-1. onclick 이벤트로 handleCellClick 함수 호출 
    cellEl.onclick = () => handleCellClick(cell);

    // 12-1. onchange 이벤트로 handleOnChange 함수 호출 => cell 의 data value 값을 타이핑해서 입력받은 것으로 바꿔줌
    cellEl.onchange = (e) => handleOnChange(e.target.value, cell);
    
    return cellEl;
}

// 12-2. handleOnChange() 함수 생성
function handleOnChange(data, cell) {
    cell.data = data; // 여기서 cell.data = '' 원래의 빈 칸, data = 타이핑해서 입력 받은 값
}

// 10-2. handleCellClick() 함수 생성
function handleCellClick(cell) {
    // 11-1. 항상 다른 칸 클릭할 때마다 이전 active 된 걸 지우는 함수 호출!  
    clearHeaderActiveStates();
    // 10-3. 만약 B3 의 칸을 클릭하면 그 칸의 row 값(3)과 column 값(B)을 받아온다 -> 추후 style 적용 예정
    const columnHeader = spreadsheet[0][cell.column];
    const rowHeader = spreadsheet[cell.row][0];
    const columnHeaderEl = getElFromRowCol(columnHeader.row, columnHeader.column);
    const rowHeaderEl = getElFromRowCol(rowHeader.row, rowHeader.column);

    // 10-5. 선택한 cell active 상태 만들기
    columnHeaderEl.classList.add('active');
    rowHeaderEl.classList.add('active');

    console.log("clicked cell", columnHeader, rowHeader); // 콘솔창 용 test

    // 14. 추가사항 - 현재 클릭한 Cell 위치 보여주기
    document.getElementById('#cell_status').innerHTML = cell.columnName + cell.rowName
}

// 11. 클릭할 때마다 이전에 하이라이트 된 active 지우기
function clearHeaderActiveStates () {
    const headers = document.querySelectorAll('.header');

    headers.forEach ((header) => {
        header.classList.remove('active');
    })
}

// 10-4. getElFromRowCol() 함수 생성
function getElFromRowCol(row, col) {
    return document.getElementById("cell_" + row + col);
}


// 5. cell 렌더링 하기
function drawSheet() {
    for (let i =0; i < spreadsheet.length; i++) {
        const rowContainerEl = document.createElement("div");
        rowContainerEl.className = "cell-row";

        for (let j = 0; j < spreadsheet[i].length; j++) {
            const cell = spreadsheet [i][j];
            rowContainerEl.append(createCellEl(cell));
        }

        spreadSheetContainer.append(rowContainerEl);
    }
}
