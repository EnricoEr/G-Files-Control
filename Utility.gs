//Create folder if does not exists only
function createFolder(fatherName, folderName, Id){

  try {

    //Logger.log(" father ->"+fatherName)
    //Logger.log(" son ->"+folderName)

    if (Id == -1) {
      var parentFolder = DriveApp.getFoldersByName(fatherName);
      while (parentFolder.hasNext()) {
        var Pfolder = parentFolder.next();
        // get folder name
      }
    } else {
      Pfolder = DriveApp.getFolderById(Id);
    }

    var subFolders = Pfolder.getFolders();
    var doesntExists = true;
    var newFolder = '';
    
    // Check if folder already exists.
    while(subFolders.hasNext()){
      var folder = subFolders.next();
      
      //If the name exists return the id of the folder
      if(folder.getName() === folderName){
        doesntExists = false;
        newFolder = folder;
        return newFolder.getId();
      };
    };
    //If the name doesn't exists, then create a new folder
    if(doesntExists == true){
      //Logger.log(" Create son ->"+folderName)
      //If the file doesn't exists
      newFolder = Pfolder.createFolder(folderName);
      return newFolder.getId();
    };
  } catch(e){
      Logger.log("Error ->"+e)
  }
};

