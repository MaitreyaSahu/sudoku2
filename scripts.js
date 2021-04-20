var grid = [];
var transGrid = [];
var num = 1;
var count = 1;
var retArr = [];

function getFirstRow() {
    var i = 0;
    var j = 0;
    do {
        var x = (Math.round(Math.random() * 8) + 1);
        if (grid[0].indexOf(x) == -1) {
            grid[i][j] = x;
            transGrid[j++][i] = x;
        }
    } while (j < 9)
}

function createGrid() {
    for (var i = 0; i < 9; i++) {
        var arr = [];
        for (var j = 0; j < 9; j++) {
            arr.push(0);
        }
        grid.push(arr.slice());
        transGrid.push(arr.slice());
    }
}

function startGame() {

    loadGrid();

    $('#mainGrid td').each(function() {
        if (Math.random() > 0.5) {
            $(this).html('').removeClass('locked-cell').addClass('unLocked-cell unfilled');
        }
    });

}

function autoSolve() {
    $('#mainGrid td.unLocked-cell').each(function() {
        var id = $(this).attr('id');
        var i = id.substring(1, 2);
        var j = id.substring(2, 3);
        $(this).html(grid[i][j]).removeClass('error-cell').removeClass('unfilled');

    });

}

function getHint() {
    alert('Coming soon!!!');
}

function loadGrid() {
    grid = [];
    transGrid = [];
    retArr = [1, 0];

    createGrid();

    getFirstRow();

    do {

        retArr = solve(retArr[0], retArr[1]);

    } while (retArr[0] != 'x');console.table(grid);

    createTable(grid);
}

function createTable(tableData) {
    $("#mainGrid tbody tr").each(function(rowIndex) {
        var rowData = grid[rowIndex];
        $(this).find("td").each(function(cellIndex) {
            $(this).text(rowData[cellIndex]).addClass('locked-cell').removeClass('unLocked-cell').removeClass('error-cell').removeClass('unfilled');
            $('.selected-row').removeClass('selected-row');
        });
    })
}

function isValidInRow(gridVal, gridRow) {
    return grid[gridRow].indexOf(gridVal) == -1 ? true : false;
}

function isValidInColumn(gridVal, gridColumn) {
    return transGrid[gridColumn].indexOf(gridVal) == -1 ? true : false;
}

function isValidInBox(gridVal, gridRow, gridColumn) {
    var boxIndexI = Math.round((gridRow - 1) / 3) * 3;
    var boxIndexJ = Math.round((gridColumn - 1) / 3) * 3;
    for (var i = boxIndexI; i < boxIndexI + 3; i++) {
        for (var j = boxIndexJ; j < boxIndexJ + 3; j++) {
            if (grid[i][j] == gridVal) {
                return false;
            }
        }
    }
    return true;
}

function getPossibleValues(posI, posJ) {
    var possibleValues = [];
    for (var i = 1; i < 10; i++) {
        if (isValidInRow(i, posI) && isValidInColumn(i, posJ) && isValidInBox(i, posI, posJ)) {
            possibleValues.push(i);
        }
    }
    return possibleValues;
}

function solve(posI, posJ) {
    var index;
    num = grid[posI][posJ];
    grid[posI][posJ] = 0;
    transGrid[posJ][posI] = 0;

    var possibleValues = getPossibleValues(posI, posJ);
    index = possibleValues.indexOf(num);
    if (possibleValues.length == 0 || (index == (possibleValues.length - 1))) {
        return [posJ == 0 ? --posI : posI, posJ == 0 ? 8 : --posJ];
    } else {
        num = possibleValues[index + 1];
        grid[posI][posJ] = num;
        transGrid[posJ][posI] = num;
        if (posI == 8 && posJ == 8) {
            return ['x', 'x'];
        }
        return [posJ == 8 ? ++posI : posI, posJ == 8 ? 0 : ++posJ];

    }

}

$(document).ready(function() {

    $("#mainGrid td").click(function() {
        //selectionOn(this);
        $('.selected-row').removeClass('selected-row');
        $('#mainGrid td.selected').removeClass('selected');
        var index = $(this).index();
        index++;
        if ($(this).hasClass('locked-cell')) {} else {
            $(this).addClass('selected');
        }
        $(this).closest('tr').addClass('selected-row');
        $("#mainGrid tr td:nth-child(" + index + ")").addClass('selected-row');
    });

    $("#nums-table td").click(function() {
        var val = $(this).html();
        var selected = $('#mainGrid td.selected').html(val);
        if (selected.length != 0) {
            var id = '';
            id = $(selected).attr('id');
            var i = id.substring(1, 2);
            var j = id.substring(2, 3);
            //grid[i][j] != val ? $(selected).addClass('error-cell') : $(selected).removeClass('error-cell');
            if (grid[i][j] != val) {
                $(selected).addClass('error-cell');
            } else {
                $(selected).removeClass('error-cell').removeClass('unfilled');
                if ($('.unfilled').length == 0) {//alert('Congratulations, You Won!');
                //startGame();
                }
            }
        }

    });
    startGame();
});

function selectionOn(selectedCell) {
    var index = $(selectedCell).index();
    index++;
    //$(selectedCell).addClass('selected');
    $(selectedCell).closest('tr').addClass('selected-row');
    $("#mainGrid tr td:nth-child(" + index + ")").addClass('selected-row');

}

function selectionRemoved(selectedCell) {
    var index = $(selectedCell).index();
    index++;
    //$(selectedCell).removeClass('selected');
    $(selectedCell).closest('tr').removeClass('selected-row');
    $("#mainGrid tr td:nth-child(" + index + ")").removeClass('selected-row');

}
