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

function calculateRoundRobin() {
    let numProcesses = parseInt(document.getElementById('numProcesses').value);
    let timeQuantum = parseInt(document.getElementById('timeQuantum').value);
    let at = [];
    let bt = [];
    let rt = []; // Remaining time
    let ct = [];
    let tat = [];
    let wt = [];
    let currentTime = 0;
    let completed = 0;
    let queue = [];
    let processedTime = 0;

    // Fetching input values
    for (let i = 1; i <= numProcesses; i++) {
        at.push(parseInt(document.getElementById('at' + i).value) || 0);
        bt.push(parseInt(document.getElementById('bt' + i).value) || 0);
        rt.push(bt[i - 1]); // Remaining time is initially equal to burst time
    }

    // Adding first process to the queue if it has arrived at time 0
    for (let i = 0; i < numProcesses; i++) {
        if (at[i] === 0) queue.push(i);
    }

    // Round Robin Logic
    while (completed < numProcesses) {
        if (queue.length === 0) {
            // If no process in the queue, move time forward to next process arrival
            currentTime++;
            for (let i = 0; i < numProcesses; i++) {
                if (at[i] <= currentTime && rt[i] > 0 && !queue.includes(i)) {
                    queue.push(i);
                }
            }
            continue;
        }

        let currentProcess = queue.shift(); // Get process from the front of the queue

        if (rt[currentProcess] > timeQuantum) {
            rt[currentProcess] -= timeQuantum;
            processedTime = timeQuantum;
        } else {
            processedTime = rt[currentProcess];
            rt[currentProcess] = 0;
            completed++;
            ct[currentProcess] = currentTime + processedTime; // Set completion time
        }

        currentTime += processedTime;

        // Add any newly arrived processes to the queue
        for (let i = 0; i < numProcesses; i++) {
            if (at[i] <= currentTime && rt[i] > 0 && !queue.includes(i)) {
                queue.push(i);
            }
        }

        // If process is not finished, push it back into the queue
        if (rt[currentProcess] > 0) {
            queue.push(currentProcess);
        } else {
            // Calculate TAT and WT
            tat[currentProcess] = ct[currentProcess] - at[currentProcess];
            wt[currentProcess] = tat[currentProcess] - bt[currentProcess];
        }
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
