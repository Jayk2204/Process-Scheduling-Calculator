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

function calculateSRT() {
    let numProcesses = parseInt(document.getElementById('numProcesses').value);
    let at = [];
    let bt = [];
    let rt = []; // Remaining time
    let ct = [];
    let tat = [];
    let wt = [];
    let completed = 0;
    let currentTime = 0;
    let minRemainingTime = Infinity;
    let shortestProcess = -1;
    let isProcessSelected = false;
    
    // Fetching input values
    for (let i = 1; i <= numProcesses; i++) {
        at.push(parseInt(document.getElementById('at' + i).value) || 0);
        bt.push(parseInt(document.getElementById('bt' + i).value) || 0);
        rt.push(bt[i - 1]); // Remaining time is initially equal to burst time
    }

    // SRT logic: preemptive scheduling based on the remaining time
    while (completed < numProcesses) {
        // Find the process with the shortest remaining time that's ready to execute
        for (let i = 0; i < numProcesses; i++) {
            if (at[i] <= currentTime && rt[i] < minRemainingTime && rt[i] > 0) {
                minRemainingTime = rt[i];
                shortestProcess = i;
                isProcessSelected = true;
            }
        }

        if (!isProcessSelected) {
            currentTime++;
            continue;
        }

        // Execute the process with the shortest remaining time
        rt[shortestProcess]--;

        // Update minimum remaining time
        minRemainingTime = rt[shortestProcess];
        if (minRemainingTime === 0) {
            minRemainingTime = Infinity;
        }

        // If a process is completed
        if (rt[shortestProcess] === 0) {
            completed++;
            isProcessSelected = false;

            ct[shortestProcess] = currentTime + 1; // Completion time
            tat[shortestProcess] = ct[shortestProcess] - at[shortestProcess]; // Turnaround time
            wt[shortestProcess] = tat[shortestProcess] - bt[shortestProcess]; // Waiting time
        }

        // Increment current time
        currentTime++;
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
    document.getElementById('avgTAT').innerText = avgTAT.toFixed(2);
    document.getElementById('avgWT').innerText = avgWT.toFixed(2);
}
