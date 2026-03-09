import "./style.css"

const form = document.querySelector(".form")


form.addEventListener("submit",(e) =>{
    e.preventDefault()
    
    const modal  = document.createElement("dialog")
    const frag = document.createDocumentFragment()

    modal.innerHTML = 
    `
        <button type="submit">Rotar</button>
        <button type="submit">Recortar</button>
        <button type="submit">r</button>
    `

    frag.appendChild(modal)
    document.body.appendChild(frag)

    const data = new FormData(form);



    // if(data.getAll("cedula").length == 1){
    //     alert("Seleccione las fotos de cédula, en ambas caras")
    //     return
    // }

    // if(data.getAll("interiorNeg").length == 1){
    //     alert("Seleccione las fotos del interior del negocio")
    //     return
    // }

    

})



