/*

RH-Downloads by mvan231

v1.1 Add support for checking multiple links and cycle through them with each refresh of the widget 

v1.0 Initial Release

*/

/*
#####
   Initialization and HTML Grab
#####
*/

//to check different accounts / shortcuts on each run, add another URL to the url array below. They must be separated by a comma ',' and must be enclosed in single quotes.                                                                                                                                
let wv=new WebView()
var url = ['https://routinehub.co/shortcut/5583/','https://routinehub.co/user/mvan231','https://routinehub.co/shortcut/5195']


/*
#####
   Start iCloud Storage File Information
#####
*/
const now = new Date()
let ff = new DateFormatter()
ff.dateFormat = 'd-MMM H:mm'
let frmt = ff.string(now)
log(frmt)

ab = FileManager.iCloud()
dir=ab.documentsDirectory()
let path = dir+"/RhLastUpd.json"
log(path)
let file
//let temp ={}
if (!ab.fileExists(path))
{
  //if file does not exist
  file={}
  file.date = now.getDate()
  file.index = -1
  ab.write(path, Data.fromString(JSON.stringify(file)))
  ab.writeString(path, JSON.stringify(file))
}
  //parse the existing file or the newly created file
  file = JSON.parse(ab.readString(path))
  log(file.date)
  log("index is "+file.index)

// if file doesn't contain the index key:value
if (!file.index && (!String(file.index).length))file.index = -1 
//if (file.hasOwnProperty('index'))file.index = -1

/*if (!file.weekDelta)
*/

/*
#####
   End iCloud Storage File Information
#####
*/

/*
#####
   Grab HTML and Parse
#####
*/
log("index is "+file.index)

log(url.length)
file.index += 1
log("index is now "+file.index)
if (file.index >= url.length)
{
 file.index = 0 
}
log(file.index)
url = url[file.index]
log(url)
//initialize the name variable
var name
//initialize the regex variable
var reg


await wv.loadURL(url)

let html = await wv.getHTML()

// check if the current (to use) URL contains "user" or not
if (url.includes("user"))
{
  reg = /user\/(.+)(\/|)/
  if (reg.exec(url))
  {
    name = url.match(reg)[1]
    log("match is "+url.match(reg)[1])
  }  
}else {
  reg = /•\s(.+)\<\/title\>/
  if (reg.exec(html))
  {
    name = html.match(reg)[1]
    log("match is "+html.match(reg)[1])
  }
}
log(name)

reg = /\<p\>Downloads\: (\d+)\<\/p>/
var str
var lastUpd

if (reg.exec(html))
  {
  str = html.match(reg)[1]
  log(str)
  }else{
    window.stop();
  }

log(file[name])

if (!file[name])
{
file[name] = {
  downloads:str,
  dayDelta:0
  }
}else{
  //temp.dayDelta=file[name].dayDelta
  //temp.downloads=file[name].downloads
}
/*
#####
   start download diff calculation
#####
*/
var diff

if (file.date != now.getDate())
  {
    file[name].dayDelta = 0
  }
    
  // calculate difference between new RH count, file download count and the previous delta value. this shows the change in downloads throughout the current day
  diff = (str - file[name].downloads) + file[name].dayDelta

/*
#####
   finish diff calculation
#####
*/

//   assign dictionary items new Values
/*temp.dayDelta = diff
temp.downloads = str*/

file.date = now.getDate()
//file[name] = temp
file[name] = {
  dayDelta:diff,
  downloads:str
}

// save file with updates
ab.writeString(path, JSON.stringify(file))


/*
#####
   start widget
#####
*/
  const w = new ListWidget()
  w.setPadding(14, 5, 14, 5)
  
  const main = w.addText("RH Downloads")
  main.textColor = Color.gray()
  main.centerAlignText()

  if (name)
  {
    const nameText = w.addText(name)
    nameText.textColor=Color.gray()
    nameText.centerAlignText()
  }

  // add current Date to widget
  const sub = w.addText(frmt)
  sub.textColor = Color.red()
  sub.font = Font.boldSystemFont(9)
  sub.centerAlignText()
  
  // add downloads to widget
  const titlew = w.addText(await str)
  titlew.textColor = Color.blue()
  titlew.font = Font.boldSystemFont(13)
  titlew.centerAlignText()
  
  // if delta greater than 0 then add day delta to Widget
    if (diff >0)
    {
      const subsub = w.addText("+"+diff + " since yesterday")
      subsub.textColor = Color.blue()
      subsub.font = Font.regularMonospacedSystemFont(11)
      subsub.centerAlignText()
    }
  
  w.addSpacer(6)
  //set the widget
  Script.setWidget(w)
  //complete the script
  Script.complete()
  w.presentSmall()
/*
#####
   end widget
#####
*/