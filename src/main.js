import "./style.css"
import Cropper from "cropperjs"
import "cropperjs/dist/cropper.css"
import { PDFGenerator } from "./PDFGenerator.js"

const form = document.querySelector(".form")
const inputs = document.querySelectorAll('input[type="file"]')

const cedulas = []
let matriNeg;
let numRuc
const circulacion = []
const facturas = []
const interiorNeg = []
let exterior;


form.addEventListener("submit",(e) =>{
    e.preventDefault() 

    const obligatorios = ["cedula","exteriorNeg","interiorNeg"]

    for(const input of inputs){
        if(obligatorios.includes(input.name) && input.files.length === 0)
        {
            alert(`El campo ${input.name} requiere al maneo suna imagen`)
            return
        }
    }

    const fotos = []
    let indice = 0

    inputs.forEach((input) =>{
        const files = Array.from(input.files)
        files.forEach(file =>{
            fotos.push({file: file, tipo: input.name})
        })
    })


    const dialog = document.createElement("dialog")
    const frag = document.createDocumentFragment()

    const imagen = URL.createObjectURL(fotos[indice].file)

    dialog.innerHTML = 
            `
            <div class="menu">
                <button type="button" id="rotar">Rotar</button>
                <button type="button" id="recortar">Recortar</button>
                <button type="button" id="confirmar">Confirmar</button>
                <button type="button" id="eliminar">Descartar foto</button>
                <button type="button" id="cancelar">Cancelar recorte</button>

                <button id="close"><span class="material-symbols-outlined">close</span></button>
            </div>
            
            <img class="menu__img" src="${imagen}">
            `
    dialog.classList.add("modal")
    frag.appendChild(dialog)
    document.body.appendChild(frag)
    dialog.showModal()
    
    const img = dialog.querySelector("img")
    
    const rotar = dialog.querySelector("#rotar")
    const recortar = dialog.querySelector("#recortar")
    const confirmar = dialog.querySelector("#confirmar")
    const eliminar = dialog.querySelector("#eliminar")
    const cancelarRe = dialog.querySelector("#cancelar")

    const close = dialog.querySelector("#close")

    const cropper = new Cropper(img,{
        viewMode: 1,
        autoCrop: false,
        responsive:true
    })

    //CERRAR EL MODAL
    close.addEventListener("click",() =>{
        dialog.close()
        dialog.remove()
    })

    let contador = 1;
    //GUardar foto
    confirmar.addEventListener("click", () => {
        
        const canvas = cropper.getCroppedCanvas()

        canvas.toBlob((blob) =>{
            const nuevaImagen = new File([blob],`editada${contador}.png`,{type: "image/png"})
            contador++


            const tipo = fotos[indice].tipo
            
            if(tipo === "cedula") cedulas.push(nuevaImagen)
            if(tipo === "matriculaNeg") matriNeg = nuevaImagen
            if(tipo === "numRuc") numRuc = nuevaImagen
            if(tipo === "circulacion") circulacion.push(nuevaImagen)
            if(tipo === "factura") facturas.push(nuevaImagen)
            if(tipo === "interiorNeg") interiorNeg.push(nuevaImagen)
            if(tipo === "exteriorNeg") exterior = nuevaImagen

            indice++

            if(indice < fotos.length)
            {
                const nueva = URL.createObjectURL(fotos[indice].file)
                cropper.replace(nueva)
            }
            else{
                dialog.close()
                dialog.remove()

                const pdf = new PDFGenerator({
                    cedulas,
                    matriNeg,
                    numRuc,
                    circulacion,
                    facturas,
                    interiorNeg,
                    exterior
                })

                pdf.generar()
            }
        })
    })


    //Rotar la imagen del cropper
    rotar.addEventListener("click",()=>{
        cropper.rotate(90)
    })

    //Recortar imagen
    recortar.addEventListener("click",()=>{
        const canvas = cropper.getCroppedCanvas()
        const nuevaImagen = canvas.toDataURL("image/png")
        cropper.replace(nuevaImagen)
    })

    //Cancelar recorte
    cancelarRe.addEventListener("click",()=>{
        cropper.clear()
    })

    //Descartar foto que se mira visualmente
    eliminar.addEventListener("click",()=>{
        fotos.splice(indice, 1)

        if(fotos.length === 0){
            dialog.close()
            dialog.remove()
            return
        }

        if(indice >= fotos.length){
            indice = fotos.length - 1
        }

        const nuevaImagen = URL.createObjectURL(fotos[indice].file)
        cropper.replace(nuevaImagen)
    })

})



