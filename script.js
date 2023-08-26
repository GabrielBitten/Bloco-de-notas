//elements
const noteContainer = document.querySelector("#notes-container")
const noteInput = document.querySelector("#note-content")
const addNoteBtn = document.querySelector("#add-note")
const searchInput = document.querySelector("#search-input")
const exportButton = document.querySelector("#export-notes")
//functions
function showNotes(){
    cleanNotes()
    getNotes().forEach((note) => {
        const noteElement = createNote(note.id, note.content, note.fixed)
    noteContainer.appendChild(noteElement)
    })
}
   
function cleanNotes(){
    noteContainer.replaceChildren([])
}
 

function addNote(){
   const notes = getNotes()

    const noteObject ={
        id: generateId(),
        content: noteInput.value,
        fixed: false,
    }
    const noteElement = createNote(noteObject.id, noteObject.content)

     noteContainer.appendChild(noteElement)

     notes.push(noteObject)

     saveNotes(notes)
        
     
     noteInput.value = ""
}

function generateId(){
    return Math.floor(Math.random() * 5000)
}

function createNote(id, content, fixed){
    const element = document.createElement("div")

    element.classList.add("note")

    const textarea = document.createElement("textarea")

    textarea.value = content

    textarea.placeholder = "Adicione algum texto..."

    element.appendChild(textarea)

    if(fixed){
        element.classList.add("fixed")
    }
    const pinIcon = document.createElement("i")
    pinIcon.classList.add("fa-thumbtack")
    element.appendChild(pinIcon)
    pinIcon.textContent = "Fixar"
    //-----------------------------------------
    const xIcon = document.createElement("i")
    xIcon.classList.add("fa-xmark")
    element.appendChild(xIcon)
    xIcon.textContent = "X"
    //-----------------------------------------
    const fileIcon = document.createElement("i")
    fileIcon.classList.add("fa-file-circle-plus")
    element.appendChild(fileIcon)
    fileIcon.textContent = "Duplicar"
 


   
    //element events
    element.querySelector("textarea").addEventListener("keyup",(e)=>{
      const noteContent = e.target.value

      updateNote(id, noteContent)
    })
    element.querySelector(".fa-thumbtack").addEventListener("click",() =>{
        
        toggleFixNote(id)
        
    })

    element.querySelector(".fa-xmark").addEventListener("click",()=>{
        
        deleteNote(id, element)
    })
   
    element.querySelector(".fa-file-circle-plus").addEventListener("click",()=>{
        
        copyNote(id)
    })
   
    return element;
}

function toggleFixNote(id){

    const notes = getNotes()

    const targetNote = notes.filter((note) => note.id === id)[0]
    
    targetNote.fixed = !targetNote.fixed

    saveNotes(notes)

    showNotes()
}
function deleteNote(id, element){
    const notes = getNotes().filter((note)=> note.id !==id)

    saveNotes(notes)

    noteContainer.removeChild(element)
}
function copyNote(id){

    const notes = getNotes()
    const targetNote = notes.filter((note)=> note.id === id)[0]

    const noteObject ={
        id: generateId(),
        content: targetNote.content,
        fixed: false,
    }

    const noteElement = createNote(noteObject.id, noteObject.content, noteObject.fixed)

    noteContainer.appendChild(noteElement)

    notes.push(noteObject)
    saveNotes(notes)
       
}
function updateNote(id, newContent){
    const notes = getNotes()

    const targetNote = notes.filter((note ) => note.id === id)[0]

    targetNote.content = newContent;

    saveNotes(notes)
}

function exportData(){
    const notes = getNotes()

    const csvString =[
        ["ID","Conteúdo","Fixado?"],
        ...notes.map((note)=> [note.id,note.content,note.fixed])
    ].map((e)=> e.join("," )).join("\n")
    const element = document.createElement("a")

    element.href = "data:text/csv;charset=utf-8" + encodeURI(csvString)
    element.target = "_blank"
    element.download = "notes.csv"
    element.click()
}
//local storage
function getNotes(){
    const notes = JSON.parse(localStorage.getItem("notes") || "[]")

    const orderedNotes = notes.sort((a, b) =>  a.fixed > b.fixed ? -1 : 1 )
    return orderedNotes;
}
function saveNotes(notes){
    localStorage.setItem("notes",JSON.stringify(notes))
}
function searchNotes(search){
    const searchResults = getNotes().filter((note)=> 
    note.content.includes(search))

    if(search !== " "){
        cleanNotes()

        searchResults.forEach((note ) =>{
            const noteElement = createNote(note.id, note.content)
            noteContainer.appendChild(noteElement)
        })
        return
    }
}
//events
addNoteBtn.addEventListener("click", () =>addNote())

searchInput.addEventListener("keyup", (e) =>{
    const search = e.target.value
    searchNotes(search)
})

noteInput.addEventListener("keydown",(e) =>{
    if(e.key === "Enter" ){
        addNote()
    }
})
exportButton.addEventListener("click",()=>{
    exportData()
})
showNotes();