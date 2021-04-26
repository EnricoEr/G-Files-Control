const folderId = "0AFiyIvoxrzwdUk9PVA"; // Folder ID of the RW shared Drive 

function tests(){
  var fileId = "1meTbJyCOrSBOA919crcqq8aKhGgWKKqc"
  Logger.log("-->" + find_mail_owner(fileId))
}

function find_mail_owner(folderId) {
  Arr = getPermissionsList(folderId);
  for (i=0; i< Arr.length;i++) {
    if (Arr[i][1] == "writer") {
      return Arr[i][0]
    }
  }
  for (i=0; i< Arr.length;i++) {
    if (Arr[i][1] == "fileOrganizer") {
      return Arr[i][0]
    }
  }
  for (i=0; i< Arr.length;i++) {
    if (Arr[i][1] == "Organizer") {
      return Arr[i][0]
    }
  }
   //Logger.log("email ->" + Arr[i][0]);
   //Logger.log("role -->" + Arr[i][1]); 
  return "";
}

function getPermissionsList(fileId) {
  //const fileId = "1meTbJyCOrSBOA919crcqq8aKhGgWKKqc"; // ID of your shared drive

  // THIS IS IMPORTANT! The default value is false, so the call won't 
  // work with shared drives unless you change this via optional arguments
  const args = {
    supportsAllDrives: true
  };

  // Use advanced service to get the permissions list for the shared drive
  let pList = Drive.Permissions.list(fileId, args);

  //Put email and role in an array
  let editors = pList.items;
  var arr = [];

  for (var i = 0; i < editors.length; i++) {
    let email = editors[i].emailAddress;
    if (email) {
      let role = editors[i].role;
      arr.push([email, role]);      
    }


  }

  //Logger.log(arr);
  return arr;

}

function Lista_ctrl() {

  Clear()
  Hash_init()

  var sheet = SpreadsheetApp.getActive();
  sheet.appendRow([ "Name", "URL",  "Owner", "Control" ]);

  const getFileList = (id, folders = []) => {
    const f = DriveApp.getFolderById(id);
    const fols = f.getFolders();
    let temp = [];
    while (fols.hasNext()) {
      const fol = fols.next();

      ctrl_folder(fol.getId());

      const files = fol.getFiles();
      let fileList = [];
      while (files.hasNext()) {
        const file = files.next();

        /*
        var parentFolder = file.getParents()
        while (parentFolder.hasNext()) {
          var Pfolder = parentFolder.next();
        }
        if (Pfolder.getName().indexOf("#ib") == -1) {
          data = [
            file.getName(),
            file.getUrl(),
            email,
            "Il file si trova in un folder "+ Pfolder.getName() + " che non è un #ib "
          ];

          sheet.appendRow(data);

        }
        */

        var  email = find_mail_owner(file.getId())
        ctrl = controlla_file_nome_(file)
        if (ctrl != "") {
          data = [
            file.getName(),
            file.getUrl(),
            email,
            ctrl
          ];

          sheet.appendRow(data);
        }

        //Logger.log("1->" + file.getName())
        ctrl = verify_h_file(file.getName(),"File")
        if (ctrl != "") {

          data = [
            file.getName(),
            file.getUrl(),
            email,
            ctrl + " is not allowed for Files"
          ];

          // Write 
          sheet.appendRow(data);
        }
        
        fileList.push({ name: file.getName(), id: file.getId() });
      }
      temp.push({
        name: fol.getName(),
        id: fol.getId(),
        parent: id,
        parentName: f.getName(),
        files: fileList,
      });
    }
    if (temp.length > 0) {
      folders.push(temp);
      temp.forEach((e) => getFileList(e.id, folders));
    }
    return folders;
  };

  const res = getFileList(folderId);
  //console.log(res);
}

function ctrl_folder(folderId) {
  try {
    var sheet = SpreadsheetApp.getActive();
    var folder = DriveApp.getFolderById(folderId);

    var parents = folder.getParents();
    if (parents.hasNext()) {
      var parent = parents.next(); 
      father = parent.getName()
    };

    if (folder.getName().indexOf("#ib") != -1 ){
      if (folder.getName().indexOf("#ib - ") == -1 ){
        var tmp = folder.getName();
        pippo = tmp.replace("#ib ", "#ib - ");
        //Logger.log("-> " + pippo);
        folder.setName (pippo)
      } else {
        //Logger.log("** -> " + folder.getName());
      };        
    }

    var  email = find_mail_owner(folder.getId())

    ctrl = controlla_nome_folder_ (folder.getName(),father)

    /*
    if (folder.getName().indexOf("#WF") > -1 ) {
      var pippo = folder.getName ()
      pippo = "#S" + pippo.substring(3,pippo.length)
      Logger.log(pippo)
      folder.setName (pippo)
    }
    */
 

    //Logger.log("folder->"+folder.getName())
    /*
    if (folder.getName() == "#ib - Com external") {
      folder.setName ("#ib - eMail")
      //Logger.log("email , father->"+father)
    } else if (folder.getName() == "#ib - Com internal") {
      parent.removeFolder(folder)
      //Logger.log("erase com internal , father->"+father)
    }
    */

    if (ctrl != "") {
      data = [
        folder.getName(),
        folder.getUrl(),
        email,
        ctrl
      ];

      // Write 
      sheet.appendRow(data);
    }

    ctrl = verify_h_file(folder.getName(),"Folder")
    if (ctrl != "") {

      data = [
        folder.getName(),
        folder.getUrl(),
        email,
        ctrl + " is not allowed for Folder"
      ];

      // Write 
      sheet.appendRow(data);
    }

   
  } catch (e) {
    Logger.log (folder + "->" + e.message)
  } 
}

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