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

const prompts = [
    {
        'key': 'HEADER',
        'full': 'Plot Line',
        'prompt': 'The title you want to use to reference this plot line.'
    },
    {
        'key': 'RES',
        'full': 'Resolution',
        'prompt': 'The Climax. Everything in the story leads to this moment.'
    },
    {
        'key': 'HOOK',
        'full': 'Hook',
        'prompt': 'The "before" picture.<br>' +
            'Tip: start with the opposite of the of Resolution.'
    },
    {
        'key': 'MID',
        'full': 'Midpoint',
        'prompt': 'The point at which the characters begin moving from one state to the other. From reaction to action.'
    },
    {
        'key': 'TP1',
        'full': 'Turning Point 1',
        'prompt': 'Introduces conflict and bridges gap between the Hook and the Midpoint.<br>\n' +
            'The character\'s world changes. New people, new secrets, etc.'
    },
    {
        'key': 'TP2',
        'full': 'Turning Point 2',
        'prompt': 'Bridges the gap between the Midpoint and the Resolution. ' +
            'Obtain the last thing needed to reached the resolution.<br>\n' +
            'Example: "Use the Force Luke."'
    },
    {
        'key': 'PP1',
        'full': 'Pinch Point 1',
        'prompt': 'Something bad happens. ' +
            'Apply pressure, forcing the characters to act. Often used to introduce the villain.'
    },
    {
        'key': 'PP2',
        'full': 'Pinch Point 2',
        'prompt': 'Something even worse happens. Apply even more pressure, until the situation seems hopeless.<br>\n' +
            'Tip: These are the jaws of defeat from which your hero will be snatching victory.' +
            'Make sure the teeth are sharp'
    }];

const parts = ['HOOK', 'TP1', 'PP1', 'MID', 'PP2', 'TP2', 'RES'];

var plots = [];
var partial;
var cur;

function startPlotGenerator() {
    $('#full').html(prompts[0]['full']);
    $('#prompt').html(prompts[0]['prompt']);
    $('#plotItem').val('');
    cur = 0;
    partial = {};
}

function nextPlotGenerator() {
    var plotitem = $('#plotItem');
    partial[prompts[cur]['key']] = plotitem.val().replaceAll('\n', '<br>');
    cur++;
    if (cur === prompts.length) {
        partial['STAGE'] = 0
        plots.push(partial);
        for (const [key, value] of Object.entries(partial)) {
            if (key === 'HEADER') {
                $('#' + key).append('<th scope="col">' + value + '</th>');
            } else {
                $('#' + key).append('<td>' + value + '</td>');
            }
            startPlotGenerator();
        }
    } else {
        $('#full').text(prompts[cur]['full'] + ' of ' + partial['HEADER']);
        $('#prompt').html(prompts[cur]['prompt']);
        plotitem.val('');
    }
}

var plotTable = [];

function startOutlineGenerator() {
    var i;
    $('#outline-tab').removeClass('disabled');
    $('#tblNext').html('<thead class="thead-dark"><tr id="plotName">\n' +
        '                    <th>Plot item name</th>\n' +
        '                </tr></thead>\n' +
        '                <tr id="plotNext">\n' +
        '                    <th>The Next Step in each plot</th>\n' +
        '                </tr>\n' +
        '                <tr id="plotSelect">\n' +
        '                    <th>Which plot item(s) should happen next?</th>\n' +
        '                </tr>');
    for (i = 0; i < plots.length; i++) {
        const plot = plots[i];
        $('#plotName').append('<th>' + plot['HEADER'] + '</th>');
        if (plot['STAGE'] < prompts.length - 1) {
            $('#plotNext').append('<td style="background: var(--' + parts[plot['STAGE']] + ')">' +
                plot[parts[plot['STAGE']]] + '</td>');
            $('#plotSelect').append('<td><input type="checkbox" id="plotLine' + i + '"></td>');
        } else {
            $('#plotNext').append('<td></td>');
            $('#plotSelect').append('<td></td>');
        }
    }
}

function submitOutlineGenerator() {
    plotTable.push([])
    for (var i = 0; i < plots.length; i++) {
        if ($('#plotLine' + i).is(':checked')) {
            plotTable[plotTable.length - 1].push(parts[plots[i]['STAGE']]);
            plots[i]['STAGE']++;
        } else {
            plotTable[plotTable.length - 1].push('');
        }
    }

    startOutlineGenerator();
}

function makeOutline() {
    var i;
    $('#tblOutline').html('<thead class="thead-dark"><tr id="plotNames">' +
        '<th scope="col" style="width: 5rem">Scene</th></tr></thead>' +
        '<tbody id="tblOutlineBody"></tbody>');
    for (i = 0; i < plots.length; i++) {
        $('#plotNames').append('<th scope="col">' + plots[i]['HEADER'] + '</th>')
    }
    for (i = 0; i < plotTable.length; i++) {
        $('#tblOutlineBody').append('<tr id="tblOutlineRow' + i + '"><th scope="row">' + (i + 1) + '</th></tr>');
        for (var j = 0; j < plots.length; j++) {
            if (plotTable[i][j] === '') {
                $('#tblOutlineRow' + i).append('<td></td>')
            } else {
                $('#tblOutlineRow' + i).append('<td style="background: var(--' + plotTable[i][j] + ')">' +
                    plots[j][plotTable[i][j]] + '</td>');
            }
        }
    }
}

function clearOutline() {
    var r = confirm("Are you sure you want to clear the current outline?\n" +
        "This will reset the outline process, but it will not impact your plot lines");
    if (r === true) {
        plotTable = [];
        for (var i = 0; i < plots.length; i++) {
            plots[i]['STAGE'] = 0;
        }
        startOutlineGenerator();
    }
}

function textArea(e) {
    if (e.which === 13 && !e.shiftKey) {
        e.preventDefault();
        nextPlotGenerator();
    }
}

function remakePlotTable() {
    // Re-initialize the plot lines table to its default
    $('#tbl7point').html('\n' +
        '                <thead class="thead-dark">\n' +
        '                <tr id="HEADER">\n' +
        '                    <th scope="col">Plot Point</th>\n' +
        '                </tr>\n' +
        '                </thead>\n' +
        '                <tbody>\n' +
        '                <tr id="HOOK" style="background: var(--HOOK)">\n' +
        '                    <th scope="row">Hook</th>\n' +
        '                </tr>\n' +
        '                <tr id="TP1" style="background: var(--TP1)">\n' +
        '                    <th scope="row">Turning Point 1</th>\n' +
        '                </tr>\n' +
        '                <tr id="PP1" style="background: var(--PP1)">\n' +
        '                    <th scope="row">Pinch Point 1</th>\n' +
        '                </tr>\n' +
        '                <tr id="MID" style="background: var(--MID)">\n' +
        '                    <th scope="row">Midpoint</th>\n' +
        '                </tr>\n' +
        '                <tr id="PP2" style="background: var(--PP2)">\n' +
        '                    <th scope="row">Pinch Point 2</th>\n' +
        '                </tr>\n' +
        '                <tr id="TP2" style="background: var(--TP2)">\n' +
        '                    <th scope="row">Turning Point 2</th>\n' +
        '                </tr>\n' +
        '                <tr id="RES" style="background: var(--RES)">\n' +
        '                    <th scope="row">Resolution</th>\n' +
        '                </tr>');

    for (var i = 0; i < plots.length; i++) {
        for (const [key, value] of Object.entries(plots[i])) {
            if (key === 'HEADER') {
                $('#' + key).append('<th scope="col">' + value + '</th>');
            } else {
                $('#' + key).append('<td>' + value + '</td>');
            }
        }
    }
}