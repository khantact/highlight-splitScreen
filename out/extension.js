"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
// initializing the counter to be incremented and decremented
let counter = 0;
// initializing the panel for the counter to be displayed in
let counterPanel;
// creates a blank panel to the right
function SplitScreen() {
    vscode.commands.executeCommand('workbench.action.newGroupRight');
}
// defining the counter
function defineCounter(value) {
    return `<!DOCTYPE html>
	<html lang="en">
	<head>
        <title>Counter</title>
	</head>
	<body>
		<p>Counter: ${value}</p>
	</body>
	</html>`;
}
// update the counter in the right panel
// occurs at every status bar button click
//*Changes*
// Changed paramter to boolean
function updateCounter(test, screen) {
    // update the counter depending on the button clicked
    if (test === true) {
        counter = counter + 1;
    }
    else if (test === false) {
        counter = counter - 1;
    }
    // display the counter
    screen.webview.html = defineCounter(counter);
}
// create and return the panel that the counter is displayed in
// occurs once at the activation of the counter
function displayCounter() {
    // create a webview window to display the table in
    // link the webview window to the initialized panel so that it can be accessed in other functions
    counterPanel = vscode.window.createWebviewPanel('displayCounter', 'Display Counter', vscode.ViewColumn.Two, // put the table in the second panel 
    {});
    // display the initial counter
    counterPanel.webview.html = defineCounter(0);
}
// hardcoded time complexity table
function defineTable() {
    return `<!DOCTYPE html>
	<html lang="en">

	<head>
	<style>
	table {
		font-family: 'Courier New', monospace;
		border-collapse: collapse;
		width: 50%;
		margin-left: auto;
		margin-right: auto;
	}

	td, th {
		border: 1px solid #1b1c1c;
		text-align: center;
		padding: 7px;
	}
    
    th {
    	background-color: #f96650;
        color: #ffffff;
    }

	.col {
    	width: 33%;
    }

	tr {
		background-color: #ffffff;
		color: #1b1c1c;
	}

	tr + tr + tr + tr + tr + tr + tr {
		background-color: #d6ff8c;
		color: #1b1c1c;
	}
	</style>
	</head>

	<body>
	<br>
	<table class="table">
    	<colgroup>
        	<col class = "col" span = "3">
        </colgroup>
    
		<tr>   <th>i</th><th>j</th><th>body</th>   </tr>
	</table>
	</body>

	</html>`;
}
// display time complexity table in the right panel
function displayTable() {
    // create a webview window to display the table in 
    const panel = vscode.window.createWebviewPanel('displayTable', 'Display Table', vscode.ViewColumn.Two, // put the table in the second panel 
    {});
    // display the table
    panel.webview.html = defineTable();
}
// hardcoded sample code
function defineCode() {
    return `<!DOCTYPE html>
	<html lang="en">
	<head>
        <title>Code</title>
	</head>

	<body>
        <div id="code">
<pre>public void example(int [] arr) {</pre>
<pre>    int sum = 0;</pre>
<pre>    for (int i = 0; i < arr.length; i++) {</pre>
<pre>        for (int j = 0; j < arr.length; j++) {</pre>
<pre>            System.out.println(arr[i] + " " + arr[j]);</pre>
<pre>        }</pre>
<pre>    }</pre>
<pre>}</pre>
        </div>
	</body>
    
	</html>`;
}
// display sample code in the left panel
function displayCode() {
    // create a webview window to display the code in 
    const panel = vscode.window.createWebviewPanel('displayCode', 'Display Code', vscode.ViewColumn.One, // put the code in the first panel 
    {});
    panel.webview.html = defineCode();
}
// displays the inputted status bar item
function displayStatusBarItem(item, text) {
    item.text = text;
    item.show();
}
/////////////////////////////////////////////////////////////////////////////////////////
// MAIN & ACTIVATION
function activate(context) {
    // SPLIT SCREEN
    let disposable = vscode.commands.registerCommand('timecomplexity.splitScreen', () => {
        vscode.window.showInformationMessage('Splitting the screen.');
        SplitScreen();
    });
    context.subscriptions.push(disposable);
    // DISPLAY TABLE
    let disposable2 = vscode.commands.registerCommand('timecomplexity.displayTable', () => {
        vscode.window.showInformationMessage('Displaying the table.');
        displayTable();
    });
    context.subscriptions.push(disposable2);
    // DISPLAY CODE
    let disposable3 = vscode.commands.registerCommand('timecomplexity.displayCode', () => {
        vscode.window.showInformationMessage('Displaying the code.');
        displayCode();
    });
    context.subscriptions.push(disposable3);
    // DISPLAY COUNTER
    let disposable6 = vscode.commands.registerCommand('timecomplexity.displayCounter', () => {
        vscode.window.showInformationMessage('Displaying the counter.');
        displayCounter();
        updateCounter(null, counterPanel);
    });
    context.subscriptions.push(disposable6);
    // NEXT BUTTON
    // register a command that is invoked when the status bar item (next button) is selected
    // *Changes*
    let disposable4 = vscode.commands.registerCommand('timecomplexity.previousButton', () => {
        vscode.window.showInformationMessage('Jumping to previous step.');
        // connecting status bar button to the counter
        updateCounter(false, counterPanel);
    });
    let disposable5 = vscode.commands.registerCommand('timecomplexity.nextButton', () => {
        vscode.window.showInformationMessage('Jumping to next step.');
        // connecting status bar button to the counter
        updateCounter(true, counterPanel);
    });
    context.subscriptions.push(disposable4);
    context.subscriptions.push(disposable5);
}
exports.activate = activate;
// this method is called when the extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map