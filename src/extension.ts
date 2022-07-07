// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

const decorationtype = vscode.window.createTextEditorDecorationType({
			backgroundColor: 'rgba(255, 255, 0, 0.2)',
			isWholeLine: true
});

type traceInfo ={
	lineNum: number, 
	varType: string, 
	varName: string, 
	varValue: any, 
	textDesc: string
};

const PrimTrace:traceInfo ={
	lineNum: 4, 
	varType: 'int', 
	varName: 'number', 
	varValue: 13, 
	textDesc: 'An int type is a primitive type.'
};

const RefTrace:traceInfo ={
	lineNum: 5, 
	varType: 'string', 
	varName: 'string', 
	varValue: 'Go Gate', 
	textDesc: 'A strirng is a reference type.'
}

let currentState = RefTrace;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function highlight(){
	//get current editor
	let editor = vscode.window.activeTextEditor;
	let position = new vscode.Position(currentState.lineNum-1, 0);
	let currentposition = new vscode.Range(position, position);

	editor?.setDecorations(decorationtype, [currentposition]);
}

function SplitScreen(){
	//Creates a blank workspace to the right 
	//Could also do above, below, or to the left if we prefer
	vscode.commands.executeCommand('workbench.action.newGroupRight');
	vscode.window.showInformationMessage('Screen has been split');
}
function drawRectangle(){
	
return	`<div id="canvasSection">
		
			<canvas id="myCanvas"
			style="border:3px solid #FF1200"
			width="500" height="200">
			</canvas>
		</div>
		<script>
			let canvas = document.getElementById("myCanvas");
			let ctx = canvas.getContext("2d"); 
			ctx.fillStyle = "#2ECC71";
			ctx.fillRect(0, 0, 150, 75);
			ctx.stroke();
			
		</script>
		<noscript>It's not working :(</noscript>`;

}



function HighlightTest(line:number){
	vscode.commands.executeCommand('editor.action.wordHighlight.trigger');
}

function getWebviewOptions(extensionUri: vscode.Uri): vscode.WebviewOptions{
	return{
		enableScripts: true,
		localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media')]
	};
}
function Mailbox(){

	

 	return `<div id="canvasSection">
		
			<canvas id="myCanvas"
				style="border:3px solid #FF1200"
				width="500" height="200">
			</canvas>
			</div>
			<script>
				let canvas = document.getElementById("myCanvas");
				let ctx = canvas.getContext("2d"); 
				ctx.fillStyle = "#2ECC71";
				ctx.fillRect(0, 0, 150, 75);
				ctx.stroke();
	
				</script>
			<noscript>It's not working :(</noscript>`;
	//DrawingPanel!.currentPanel!.doRefactor(html);
}


//Draws a basic locker (still need to draw corresponding mailbox)
function Locker(){ //Add params from trace 
	let refNum = 1;
	return`<div id=LockerSection">
				<canvas id="Lockers"
					style="border:3px solid #4951c9"
					width="500" height="200">
				</canvas>
			</div>
			<script>
				let canvas = document.getElementById("Lockers"); 
				let ctx = canvas.getContext("2d"); 
				ctx.fillStyle = "#76767a"; 
				ctx.fillRect(100, 50, 300, 100);

				ctx.fillStyle = "#99cf9b";
				ctx.fillRect(200, 60, 190, 80)

				ctx.fillStyle = "#0b0b0d";
				ctx.beginPath();
				ctx.arc(150, 100, 40, 0, 2 * Math.PI);
				ctx.fill();

				ctx.beginPath();
				ctx.fillStyle = "#404042";
				ctx.arc(150, 100, 25, 0, 2*Math.PI);
				ctx.fill();

				ctx.textBaseline = "alphabetic"; 
				ctx.textAlign = "start"; 
				ctx.font = "15px Georgia";
				ctx.fillText("Locker ${refNum}", 210, 75); 

				ctx.textAlign = "center"; 
				ctx.font = "25px Georgia"; 
				ctx.fillText("${currentState.varValue}", 295, 120);
				ctx.stroke();

			</script>`;
}
function ShowStartPage(){

	//Just for now 
	return Locker();
}

export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('highlight.splitScreen', () => {
		vscode.window.showInformationMessage('The extension is running!');
		DrawingPanel.createOrShow(context.extensionUri); 	
		highlight();
	});

	let disposable1 = vscode.commands.registerCommand('split-screen-template.drawingTest', () => {
		vscode.window.showInformationMessage('Drawing...'); 
	});
	context.subscriptions.push(disposable);
	context.subscriptions.push(disposable1);
}
class DrawingPanel {
	public static currentPanel: DrawingPanel | undefined;

	public static readonly viewType = "drawing"; 

	private readonly _panel: vscode.WebviewPanel; 
	private readonly _extensionUri: vscode.Uri;
	private _disposables: vscode.Disposable[] = [];

	//Make a data structure of trace info 

	public static createOrShow(extensionUri: vscode.Uri){
		const column =  vscode.window.activeTextEditor
			    ? vscode.window.activeTextEditor.viewColumn
				: undefined; 

		if (DrawingPanel.currentPanel){
			DrawingPanel.currentPanel._panel.reveal(column);
			return;
		}

		const panel = vscode.window.createWebviewPanel(
			DrawingPanel.viewType,
			'Visualization',
			vscode.ViewColumn.Two, //Always appear in the split side 
			getWebviewOptions(extensionUri),
		);

		DrawingPanel.currentPanel = new DrawingPanel(panel, extensionUri); 
	}


	public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri){
		DrawingPanel.currentPanel = new DrawingPanel(panel, extensionUri);
	}

	private constructor(panel:vscode.WebviewPanel, extensionUri:vscode.Uri){
		this._panel = panel; 
		this._extensionUri = extensionUri; 

		//Set initial html content
		this._update(ShowStartPage()); 

		this._panel.onDidChangeViewState(
			e => {
				if (this._panel.visible){
					this._update(ShowStartPage());
				}
			}, 
			null, 
			this._disposables
		);
	}

	public doRefactor(drawingType: string){
		let html = drawingType
		this._update(drawingType);
	} 

	public dispose(){
		DrawingPanel.currentPanel = undefined; 

		this._panel.dispose(); 

		while (this._disposables.length){
			const x = this._disposables.pop(); 
			if (x){
				x.dispose();
			}
		}
	}

	private _update(drawing: string){
		const webview = this._panel.webview;
		this._panel.title = "Visualization"; 
		let fillerHtml = drawing; 
		this._panel.webview.html = this._getHtmlForWebview(webview, fillerHtml );
	}

	private _getHtmlForWebview(webview: vscode.Webview, Html: string){
		const scriptPathOnDisk = vscode.Uri.joinPath(this._extensionUri, 'media', 'main.js');

		const scriptUri = webview.asWebviewUri(scriptPathOnDisk); 

		const styleResetPath = vscode.Uri.joinPath(this._extensionUri, 'media', 'reset.css'); 
		const stylesPathMainPath = vscode.Uri.joinPath(this._extensionUri, 'media', 'vscode.css'); 

		const stylesResetUri = webview.asWebviewUri(styleResetPath); 
		const stylesMainUri = webview.asWebviewUri(stylesPathMainPath); 

		const nonce = getNonce(); 
		//for now just do the rectangle stuff
		return `<!DOCTYPE html>
				<html lang="en">
				<head>
					<meta charset="UTF-8">

					<!--
							Use a content security policy to only allow loading images from https or from our extension directory, 
							and only allow scripts that have a specific nonce. 
					-->
					<meta http-equiv="Content-Secutity-Policy" content="default-src 'none'; style-src ${webview.cspSource}; img-src ${webview.cspSource} https:; script-src 'nonce-${nonce}';">
					<meta name = "viewport" content="width=device-width, initial-scale=1.0">

					<link href="${stylesResetUri}" rel="stylesheet">
					<link href="${stylesMainUri}" rel="stylesheet">

					<title>Visualizer</title>
				</head>
				<style>
				.button {
					background-color: #96EBE5;
					border: none;
					color: black;
					padding: 15px 32px;
					text-align: center;
					text-decoration: none;
					display: inline-block; 
					font-size: 16px; 
					margin: 4px 2px;
					cursor: pointer; 
						
				}
				</style>
				<body>
					${Html}
				</body>
				</html>`;
		
	}

	
}

function getNonce(){
	let text = ''; 
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++){
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

// this method is called when your extension is deactivated
export function deactivate() {

}
