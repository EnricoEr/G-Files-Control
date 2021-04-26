function getOwnName(){
  var email = Session.getEffectiveUser().getEmail();
  var self = ContactsApp.getContact(email);

  // If user has themselves in their contacts, return their name
  if (self) {
    // Prefer given name, if that's available
    var userName = self.getGivenName();
    // But we will settle for the full name
    if (!userName) userName = self.getFullName();
  }
  // If they don't have themselves in Contacts, return the bald userName.
  else {
    var userName = Session.getEffectiveUser().getFullName();
    //var userName = Session.getEffectiveUser().getUsername();

  }

  Logger.log(userName);
  return userName;
}

function controlla_nome_folder_ (foldername,father){

  //Logger.log(foldername + " - " + father)
  ctrl = ""
  try {
    if (foldername == "Quantum Biology")  return ctrl
    if (foldername == "Research Wings") return ctrl

    if (foldername.indexOf("#Dept - ") != -1) {
      if (father.indexOf("#OU") != -1) {
        ctrl = ""
      } else {
        ctrl = "#Dept must be child of #OU"
      }
    } else if (foldername.indexOf("#S - ") != -1)  {
      if (father.indexOf("#Dept") != -1 || father.indexOf("#OU") != -1 ||  father.indexOf("#S") != -1 ) {
        ctrl = ""
      } else {
        ctrl = "#S must be child of #OU or #Dept or #S"
      }
    } else if (foldername.indexOf("#ib - ") != -1 ) {
      if (father.indexOf("#S") != -1 ) {
        ctrl = ""
      } else {
        ctrl = "#ib must be child of #S"
      }
    } else if (foldername.indexOf("#OU - ") != -1) {
      if (father == "Quantum Biology" || father == "Research Wings") {
        ctrl = ""
      } else {
        ctrl = "#OU must be child of a company"
      }
    } else {
      ctrl = "folder must be one of these categories: '#OU - ', '#Dept - ', '#S - ' or '#ib - '" 
    }

    // #IK
    if (foldername.indexOf("#IK-CCY") != -1  ) {
      if (Utilities.formatDate(new Date(), "GMT+1", "MM") == "12") {
        ctrl = "Info: This folder has to be closed at the end of the year"  
      } 
    }  
    if (foldername.indexOf("#IK-CCM") != -1  ) {
      if (Utilities.formatDate(new Date(), "GMT+1", "dd") > "24") {
        ctrl = "Info: This folder has to be closed at the end of the month " 
      }      
    }  

  } catch (e) {
    Logger.log (fileItem + "->" + e.message)
  } 
  return ctrl 
};

function controlla_file_nome_ (FileItem) {
  ctrl = ""
  try {
    var Filename = FileItem.getName()
    var Filetipe = FileItem.getMimeType()

    if (Filetipe.indexOf("shortcut") != -1) return ctrl
    
    // date control

    if (Filename.substring(0,1) != '#' || Filename.substring(1,4) != '202' || Filename.substring(5,6) != 'm'|| Filename.substring(8,9) != 'd') {;
      if (Filename.substring(0,3) == '202' ){
        pippo = "#" + Filename;
      } else {
        pippo = "#" + Utilities.formatDate(new Date(), "GMT+1", "yyyy") + "m" 
        pippo += Utilities.formatDate(new Date(), "GMT+1", "MM") + "d" + Utilities.formatDate(new Date(), "GMT+1", "dd");
        pippo += " - " + Filename;
      };        
      //Logger.log("-> " + pippo);
      FileItem.setName (pippo)
      Filename = FileItem.getName()
      ctrl ="#Date was missing, inserted automatically"
    }

    // Rev ctrl
    if (Filename.indexOf("#Rev") == -1) {

      punto = Filename.indexOf(".",Filename.length-5)
      if (punto == -1) punto = Filename.length

      //Logger.log("punto ->" + punto + "<-" )
      pippo = Filename.substr(0,punto) + " #Rev 00.00 " + Filename.substr(punto,5) 
      //Logger.log("1 ->" + Filename.substr(0,punto) + "<-" )
      //Logger.log("2 ->" + Filename.substr(punto,5)  + "<-" )
 
      //Logger.log("-> " + pippo);
      FileItem.setName (pippo)

      if (ctrl == "") {
        ctrl = "#Rev was missing, inserted automatically"      
      } else {
        ctrl = ctrl + " ,#Rev was missing, inserted automatically"    
      }  
    } else if (Filename.indexOf("#Rev.") > -1) {
      Filename = Filename.replace("#Rev.", "#Rev ")
      FileItem.setName (Filename)
    } else if (Filename.indexOf("#Rev  ") > -1) {
      Filename = Filename.replace("#Rev  ", "#Rev ")
      FileItem.setName (Filename)
    } 
  }catch (e) {
    Logger.log (FileItem + "->" + e.message)
  }  
  return ctrl  
};
