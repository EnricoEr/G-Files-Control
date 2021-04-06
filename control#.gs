var urlparam = "https://docs.google.com/spreadsheets/d/1Bs1gTMWci0R6LSgGLWpel6KyaqSLvKvPoXEVulsiqU8/edit#gid=1559985121"

var List_h_folder;
var List_h_file;

function Hash_init() {

  var ss=SpreadsheetApp.openByUrl(urlparam);
  var ws1=ss.getSheetByName("Folder");
  List_h_folder = ws1.getRange(1,1,ws1.getRange("A1").getDataRegion().getLastRow(),1).getValues();

  Logger.log("# Folder ->" + List_h_folder)

  var ws2=ss.getSheetByName("File");
  List_h_file = ws2.getRange(1,1,ws2.getRange("A1").getDataRegion().getLastRow(),1).getValues();

  Logger.log("# File ->" + List_h_file)
}

function test(){

  Hash_init()

  ctrl = verify_h_file( "#2021m01d27 Controlli sui files #Rev 01.01 (#P21-00002)","File")
  Logger.log("-->"+ctrl+"<--")

  ctrl = verify_h_file( "Ciao #P   ippo amico mio","Folder")
  Logger.log("-->"+ctrl+"<--")

}

function verify_h_file(name,world){

  var ctrl = "";
  var pos = -1;

  if (world == "File") {
    List = List_h_file
  } else {
    List = List_h_folder
  }

  do {

    if ((world == "File") && (pos <9)){
      pos = name.indexOf("#",9); // after #2021m01d01
    } else {
      pos = name.indexOf("#",pos+1);
    } 
    if (pos != -1){
      var pos1 = name.indexOf(" ",pos)
      if (pos1 == -1) {
        pos1 = name.length;
      }
      var Tmp = name.substr(pos,pos1-pos);

      if (Tmp.substr(0,2) == "#P") {
        Tmp = "";
      } else {
        for (i=0;i<List.length;i++) {
          if (Tmp == List[i]) {
            Tmp = "";
          }
        }
      }


      if (Tmp != "") {
        ctrl = Tmp
      }
    }

  }while ((pos > -1) && (ctrl == ""));

  return ctrl

}