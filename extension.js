// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
var request = require("request");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "namege" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.helloWorld', function () {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		let editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}
		let document = editor.document;
		let selection = editor.selection;
		let line  = selection.start.line;
		let text = document.lineAt(line).text;
	
		let startpoint =text.search(/(!!!).*(!!!)/g);
		if(startpoint ===-1){
			return
		}
		let array=text.match(/(!!!).*(!!!)/g);
		if(array.length==0){
			return
		}
		let name = array[0].trim().replace(/!/g,"");
		let url='http://fanyi.youdao.com/translate?&doctype=json&type=AUTO&i='+encodeURI(name)
		request.get(url, function(err, response, body){
			if(!err && response.statusCode ===200){
				let diction  =JSON.parse(response.body.trim()).translateResult;
				if(diction.length ==0){
					return
				}
				let eglish  = diction[0][0].tgt;
				let newname ="";
				while(startpoint>-1){
					newname+=" ";
					startpoint--;
				}
				newname+= "function ";
				let allwords = eglish.split(" ")
				var countdex =0
				for(countdex in allwords)
				{
					if(countdex>0){
						newname+=allwords[countdex][0].toUpperCase();
						newname+=allwords[countdex].slice(1);
					}else{
						newname+=allwords[countdex][0].toLowerCase();
						newname+=allwords[countdex].slice(1);
					}
				}


				newname+=" ( ) {  }\n";

				let postin  = new vscode.Position(line+1,0);
				vscode.window.activeTextEditor.edit(editBuilder => {
					editBuilder.insert(postin,newname);
				});
			}
		});
	});
	context.subscriptions.push(disposable);

}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
