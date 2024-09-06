function generateProcessTable() {
    let numProcesses = parseInt(document.getElementById('numProcesses').value);
    let processContainer = document.getElementById('processContainer');
    
    // Clear the previous content
    processContainer.innerHTML = '';

    // Create a new table for both input and output
    let processTable = document.createElement('table');
    processTable.id = 'processTable';
    
    // Create the header row
    let headerRow = document.createElement('tr');
    headerRow.innerHTML = `
        <th>Process</th>
        <th>Arrival Time (AT)</th>
        <th>Burst Time (BT)</th>
        <th>Completion Time (CT)</th>
        <th>Turnaround Time (TAT)</th>
        <th>Waiting Time (WT)</th>
    `;
    processTable.appendChild(headerRow);
    
    // Create rows for each process with input fields for AT and BT, output will be filled later
    for (let i = 1; i <= numProcesses; i++) {
        let row = document.createElement('tr');
        row.innerHTML = `
            <td>P${i}</td>
            <td><input type="number" id="at${i}" value=""></td>
            <td><input type="number" id="bt${i}" value=""></td>
            <td id="ct${i}"></td>
            <td id="tat${i}"></td>
            <td id="wt${i}"></td>
        `;
        processTable.appendChild(row);
    }

    // Append the table to the processContainer
    processContainer.appendChild(processTable);
}

function calculateFCFS() {
    let numProcesses = parseInt(document.getElementById('numProcesses').value);
    let at = [];
    let bt = [];
    let ct = [];
    let tat = [];
    let wt = [];

    // Fetching input values
    for (let i = 1; i <= numProcesses; i++) {
        at.push(parseInt(document.getElementById('at' + i).value) || 0);
        bt.push(parseInt(document.getElementById('bt' + i).value) || 0);
    }

    // Calculating CT, TAT, WT
    ct[0] = at[0] + bt[0];
    tat[0] = ct[0] - at[0];
    wt[0] = tat[0] - bt[0];
    for (let i = 1; i < numProcesses; i++) {
        ct[i] = Math.max(ct[i-1], at[i]) + bt[i];
        tat[i] = ct[i] - at[i];
        wt[i] = tat[i] - bt[i];
    }

    // Displaying results in the table
    for (let i = 0; i < numProcesses; i++) {
        document.getElementById('ct' + (i + 1)).innerText = ct[i];
        document.getElementById('tat' + (i + 1)).innerText = tat[i];
        document.getElementById('wt' + (i + 1)).innerText = wt[i];
    }

    // Calculating and displaying average TAT and WT
    let avgTAT = tat.reduce((a, b) => a + b, 0) / numProcesses;
    let avgWT = wt.reduce((a, b) => a + b, 0) / numProcesses;
    document.getElementById('avgTAT').innerText = avgTAT
    document.getElementById('avgWT').innerText = avgWT

    // Generating Gantt Chart
    let ganttChart = document.getElementById('ganttChart');
    ganttChart.innerHTML = '';
    for (let i = 0; i < numProcesses; i++) {
        let width = bt[i] * 30; // each unit time is represented by 30px width
        ganttChart.innerHTML += `
        <div class="gantt-bar" style="width: ${width}px;">P${i+1} (${ct[i] - bt[i]}-${ct[i]})</div>`;
    }
}
