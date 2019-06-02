import * as vscode from 'vscode';
import * as https from 'https';
import * as path from "path";
import * as zlib from 'zlib';

export class StackOverflowProvider implements vscode.TreeDataProvider<StackOverflowModel>{

    getTreeItem(element: StackOverflowModel): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }

    getChildren(): Thenable<StackOverflowModel[]> {
        return new Promise((resolve, reject)=>{
            https.get("https://api.stackexchange.com/2.2/search?page=1&pagesize=2&order=desc&sort=relevance&intitle=javascript&site=stackoverflow", (res)=>{
                let raw = '';
                let gunzip = zlib.createGunzip();
                res.pipe(gunzip);
                gunzip.on('data',(data)=>{
                    raw += data;
                })
                .on('end',()=>{
                    let {items} = JSON.parse(raw);
                    let menuArray:StackOverflowModel[] = [];
                    for(let arrIndex in items){
                        menuArray.push(new StackOverflowModel(
                            items[arrIndex]["title"], 
                            items[arrIndex]["link"], 
                            "stackoverflow.png", 
                            vscode.TreeItemCollapsibleState.None,
                            {
                                "command":"stackOverflow.launch",
                                "title":'',
                                "arguments":[items[arrIndex]["link"]]
                            }));
                    }
                    resolve(menuArray);
                })
                .on('error',(err)=>{
                    reject(err);
                });
            });
        });
    }
}

class StackOverflowModel extends vscode.TreeItem{
    url:string;
    icon:string;
    constructor(label:string, url:string, icon:string, collapsibleState:vscode.TreeItemCollapsibleState, command:vscode.Command) {
        super(label,collapsibleState);
        this.label = label;
        this.icon = icon;
        this.url = url;
        this.collapsibleState = collapsibleState;
        this.command = command;
        this.iconPath = {
            dark:path.join(__filename,'..', '..','Icons','Dark',this.icon),
            light:path.join(__filename,'..', '..','Icons','Dark',this.icon)
        };
    }
    contextValue = "searchResultItem";
}

