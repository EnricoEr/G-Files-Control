function print_ctrl() {
  
  var sheet = SpreadsheetApp.getActive();
  
  Lista_ctrl()

  var dest = [];
  var ws=sheet.getSheetByName("Errors");
  var range = ws.getRange(2,3,ws.getRange("C2").getDataRegion().getLastRow(),1);
  var values = range.getValues()

  for (var i = 0; i < values.length; i++) {
    for (var j = 0; j < values[i].length; j++) {
      if (values[i][j] && dest.indexOf(values[i][j]) == -1){
        dest.push(values[i][j])
        //Logger.log(values[i][j]);
      }
    }
  };

  var range = sheet.getRange("A1:D2000");
  var values = range.getValues()
  for ( var k=0;k<dest.length;k++) {
    msg = "Dear user, \nthe are some errors in your files/folder naming. Please correct them. \n\n"
  
    // Logger.log( dest[k])
    for (var i = 0; i < values.length; i++) {
      for (var j = 0; j < values[i].length; j++) {
        if (values[i][j] == dest [k]){
          msg = msg + " - In the file/folder " + values[i][0] + "(url: " + values[i][1] + " ) correct: " + values[i][3] +"\n"
          //Logger.log("i = " + i + "j = " + j + " - Val -" + values[i][j]);
          
        }
      }
    };
    
    var emailAddress = dest[k]
    var message = msg
    var subject = 'Correct error in file naming';
    MailApp.sendEmail(emailAddress, subject, message);
    //Logger.log(msg) 
  }; 
};

function Lista_ctrl() {
  Clear()
  Hash_init()

  var sheet = SpreadsheetApp.getActive();
  sheet.appendRow([ "Name", "URL",  "Owner", "Control" ]);
  
  listfiles_()

  listfolders_()

  
};


function listfiles_() {
  try  {
    var sheet = SpreadsheetApp.getActive();
    var files = DriveApp.getFiles();
    while (files.hasNext()) {
      var fileItem = files.next()

      ctrl = controlla_file_nome_(fileItem)
      if (ctrl != "") {

        data = [
          fileItem.getName(),
          fileItem.getUrl(),
          fileItem.getOwner().getEmail(),
          ctrl
        ];

        // Write 
        sheet.appendRow(data);
      }

      ctrl = verify_h_file(fileItem.getName(),"File")
      if (ctrl != "") {

        data = [
          fileItem.getName(),
          fileItem.getUrl(),
          fileItem.getOwner().getEmail(),
          ctrl + " is not allowed for Files"
        ];

        // Write 
        sheet.appendRow(data);
      }

    }
  } catch (e) {
    Logger.log (fileItem + "->" + e.message)
  } 
};


function listfolders_() {
  var sheet = SpreadsheetApp.getActive();
  try {
      
    // Log the name of every folder in the user's Drive that you own and is starred.
    var folders = DriveApp.getFolders();
    while (folders.hasNext()) {
      var folderitem = folders.next();
      //Logger.log("* " + folderitem)
      var parents = folderitem.getParents();
      if (parents.hasNext()) {
        var parent = parents.next(); 
        father = parent.getName()
      };

      if (folderitem.getName().indexOf("#ib") != -1 ){
        if (folderitem.getName().indexOf("#ib - ") == -1 ){
          var tmp = folderitem.getName();
          pippo = tmp.replace("#ib ", "#ib - ");
          //Logger.log("-> " + pippo);
          folderitem.setName (pippo)
        } else {
          //Logger.log("** -> " + folderitem.getName());
        };        
      }

      ctrl = controlla_nome_folder_ (folderitem.getName(),father)

      //if (folderitem.getName() == "#WF - Documents") folderitem.setName ("#ib - Documents")

      //Logger.log("folder->"+folderitem.getName())
      if (folderitem.getName() == "#ib - Com external") {
        folderitem.setName ("#ib - eMail")
        //Logger.log("email , father->"+father)
      } else if (folderitem.getName() == "#ib - Com internal") {
        parent.removeFolder(folderitem)
        //Logger.log("erase com internal , father->"+father)
      }
      if (ctrl != "") {

        data = [
          folderitem.getName(),
          folderitem.getUrl(),
          folderitem.getOwner().getEmail(),
          ctrl
        ];

        // Write 
        sheet.appendRow(data);
      }

      ctrl = verify_h_file(folderitem.getName(),"Folder")
      if (ctrl != "") {

        data = [
          folderitem.getName(),
          folderitem.getUrl(),
          folderitem.getOwner().getEmail(),
          ctrl + " is not allowed for Folder"
        ];

        // Write 
        sheet.appendRow(data);
      }

    }    
  } catch (e) {
    Logger.log (folderitem + "->" + e.message)
  } 
}

function elenco_destinatari() {


  var sheet = SpreadsheetApp.getActive();
  var range = sheet.getRange("C2:C2000");
  var values = range.getValues()

  for (var i = 0; i < values.length; i++) {
    for (var j = 0; j < values[i].length; j++) {
      if (values[i][j] && dest.indexOf(values[i][j]) == -1){
        dest.push(values[i][j])
        Logger.log(values[i][j]);
      }
    }
  };

  return dest
};  

function Clear() {
  var spreadsheet = SpreadsheetApp.getActive();
  var sheet = spreadsheet.getActiveSheet();
  sheet.getRange(1, 1, sheet.getMaxRows(), sheet.getMaxColumns()).activate();
  spreadsheet.getActiveRangeList().clear({contentsOnly: true, skipFilteredRows: true});
};