import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {ParseDataToTable} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        var result = ParseDataToTable(parsedCode);
        CreateTableFromJson(result);
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
    });
});


function AddNewlyTableWithJson(table) {
    var divContainer = document.getElementById('showData');
    divContainer.innerHTML = '';
    divContainer.appendChild(table);

}

function CreateTheCols(myBooks) {
    let col = [];
    for (let i = 0; i < myBooks.length; i++) {
        for (let key in myBooks[i]) {
            if (col.indexOf(key) === -1) {
                col.push(key);
            }
        }
    }
    return col;
}

function CreateTableFromJson(myBooks)
{
    var col = CreateTheCols(myBooks);
    var table = document.createElement('table');
    table.id='table2';
    var tr = table.insertRow(-1);                   // TABLE ROW.
    for (var i = 0; i < col.length; i++) {
        var th = document.createElement('th');      // TABLE HEADER.
        th.innerHTML = col[i];
        tr.appendChild(th);
    }
    for (i = 0; i < myBooks.length; i++) {
        tr = table.insertRow(-1);
        for (var j = 0; j < col.length; j++) {
            var tabCell = tr.insertCell(-1);
            tabCell.innerHTML = myBooks[i][col[j]];
        }
    }
    AddNewlyTableWithJson(table);
}
