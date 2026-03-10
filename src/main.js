import "./style.css"
import Cropper from "cropperjs"
import "cropperjs/dist/cropper.css"
const form = document.querySelector(".form")
const inputs = document.querySelectorAll('input[type="file"]')

const cedulas = []
const  matriNeg = []
const numRuc = []
const circulacion = []
const Facturas = []
const interiorNeg = []
const exterior = []


form.addEventListener("submit",(e) =>{
    e.preventDefault()

    const fotos = []
    let indice = 0

    inputs.forEach((input) =>{
        const file = Array.from(input.files)
        fotos.push(...file)
    })

    const dialog = document.createElement("dialog")
    const frag = document.createDocumentFragment()

    const imagen = URL.createObjectURL(fotos[indice])

    dialog.innerHTML = 
            `
            <div class="menu">
                <button type="button" id="rotar">Rotar</button>
                <button type="button" id="recortar">Recortar</button>
                <button type="button" id="confirmar">Confirmar</button>
                <button type="button" id="eliminar">Eliminar</button>

                <button id="close"><span class="material-symbols-outlined">close</span></button>
            </div>
            
            <img class="menu__img" src="${imagen}">
            `
    dialog.classList.add("modal")
    frag.appendChild(dialog)
    document.body.appendChild(frag)
    dialog.showModal()

    const img = dialog.querySelector("img")

    const cropper = new Cropper(img,{
        viewMode: 1,
        autoCrop: false,
        responsive:true
    })

    const close = dialog.querySelector("#close")
    close.addEventListener("click",() =>{
        dialog.close()
        dialog.remove()
    })

    const confirmar = dialog.querySelector("#confirmar")
    confirmar.addEventListener("click", () => {

        indice++

        if(indice < fotos.length){
            const nuevaImagen = URL.createObjectURL(fotos[indice])
            cropper.replace(nuevaImagen)

        }else{
            // logica para crear el word
            dialog.close()
            dialog.remove()
        }
    })

    const rotar = dialog.querySelector("#rotar")
    rotar.addEventListener("click",()=>{
        cropper.rotate(90)
    })

    const recortar = dialog.querySelector("#recortar")
    console.log(recortar)
    recortar.addEventListener("click",()=>{
        const canvas = cropper.getCroppedCanvas()
        const nuevaImagen = canvas.toDataURL("image/png")
        cropper.replace(nuevaImagen)
    })
})



