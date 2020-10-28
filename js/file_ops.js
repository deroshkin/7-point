/*
Copyright (c) 2020, Dmytro Yeroshkin
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following
disclaimer.

* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following
disclaimer in the documentation and/or other materials provided with the distribution.

* Neither the name of the <organization> nor the names of its contributors may be used to endorse or promote products
derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES,
INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/



function exportTableToTSV(table) {
    var tsv = [];
    var rows = $('#' + table)[0].rows;

    for (var i = 0; i < rows.length; i++) {
        var row = [], cols = rows[i].querySelectorAll("td, th");

        for (var j = 0; j < cols.length; j++)
            row.push('"' + cols[j].innerText.replaceAll('"','""') + '"');

        tsv.push(row.join("\t"));
    }

    return tsv.join('\n')
}

function downloadTableAsTSV(table, filename){
    var tsv = exportTableToTSV(table);

    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain,' + encodeURIComponent(tsv));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function exportJSON(filename){
    const json = JSON.stringify({'plots': plots, 'plotTable': plotTable}, null, 2);

    var element = document.createElement('a');
    element.setAttribute('href', 'data:json/plain,' + encodeURIComponent(json));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function loadJSON(source){
    const reader = new FileReader();
    reader.readAsText($('#' + source)[0].files[0]);
    reader.onloadend = function () {
        const data = JSON.parse(reader.result);
        console.log(data);
        plots = data['plots'];
        plotTable = data['plotTable'];
        remakePlotTable();
        makeOutline();
        startOutlineGenerator();
    };
}