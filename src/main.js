import "./style.css"
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css"

import { PDFGenerator } from "./PDFGenerator.js"

const inputs = document.querySelectorAll('input[type="file"]')

let inputIndex = 0;
let fotoIndex = 0;
let recorte = 1;

function validar(inputs)
{
    const obligatorios = ["cedula","interiorNeg","exteriorNeg"]

    const faltan = Array.from(inputs).some(input => {

        if(obligatorios.includes(input.name) && input.files.length === 0)
        {
            alert(`Tiene que haber fotos de ${input.name}`)
            return true
        }

        if(input.name === "cedula")
        {
            const cantidad = input.files.length

            if(cantidad % 2 !== 0)
            {
                alert("Las fotos de cedula deben, en caso de agregar más de una persona, tiene que ser pares el num de fotos a ingresar (ejemplo: 2,4 .....")
                return true
            }
        }

        return false
    })

    return faltan
}

function obtenerFotos(inputs)
{
    const inputsConSusFotos = []

    inputs.forEach((input) => {

        const fotosInput = []

        for(let i = 0; i < input.files.length; i++)
        {
            const fotoFile = input.files[i]
            fotosInput.push(fotoFile)
        }

        if(fotosInput.length > 0)
        {
            inputsConSusFotos.push({
                nameInput: input.name,
                fotosInput: fotosInput
            })
        }
    })

    return inputsConSusFotos
}

async function guardarArchivo(cropper,inputsConFotos){
    const canvas = cropper.getCroppedCanvas();
   
    const blob = await new Promise(resolve =>{
        canvas.toBlob(resolve,"image/jpeg",0.85)
    });

    const file = new File([blob],`recortes${recorte}.jpeg`,{
        type:"image/jpeg"
    });

    recorte++

    inputsConFotos[inputIndex].fotosInput[fotoIndex] = file
}      

async function descartarArchivo(inputsConFotos) {
    inputsConFotos[inputIndex].fotosInput.splice(fotoIndex,1)
}


async function cargarSiguienteFoto(cropper,inputsConFotos,dialog,descartar = false)
{
    await guardarArchivo(cropper,inputsConFotos)

    if(descartar){
       await descartarArchivo(inputsConFotos)   
    }

    if(fotoIndex < (inputsConFotos[inputIndex].fotosInput.length - 1)){
        fotoIndex++;
    }
    else{
        inputIndex++;
        fotoIndex = 0;
    }

    if(inputIndex >= inputsConFotos.length){
        dialog.close()
        dialog.remove()
        const pdf = new PDFGenerator(inputsConFotos)
        pdf.generarPDF()

        return
    }

    const nuevaFoto = generarImagenAMostrar(inputsConFotos[inputIndex].fotosInput[fotoIndex])

    cropper.replace(nuevaFoto)
}

function generarImagenAMostrar(file){
    const fotoReal = URL.createObjectURL(file)
    return fotoReal
}


function crearModal(primeraFoto, inputsConFotos){

    const dialog = document.createElement("dialog")
    dialog.classList.add("modal")
    const espacioTrabajo = document.createDocumentFragment()
    const  foto = generarImagenAMostrar(primeraFoto)

    dialog.innerHTML = 
                
                `
                    <div class="menu">

                        <button type="button" id="rotar">Rotar</button>
                        <button type="button" id="recortar">Recortar</button>
                        <button type="button" id="mover">Mover img</button>
                        <button type="button" id="confirmar">Confirmar</button>
                        <button type="button" id="descartar">Descartar</button>
                        <button type="button" id="cancelarRecortado">Cancelar Recortado</button>
                        <button type="button" id="close">
                            <span class="material-symbols-outlined">close</span>
                        </button>

                    </div>
                        <img src="${foto}">
                `
    espacioTrabajo.append(dialog)
    document.body.append(espacioTrabajo)
    dialog.showModal()

    const rotar = dialog.querySelector("#rotar")
    const recortar = dialog.querySelector("#recortar")
    const confirmar = dialog.querySelector("#confirmar")
    const descartar = dialog.querySelector("#descartar")
    const cancelarRecortado = dialog.querySelector("#cancelarRecortado")
    const close = dialog.querySelector("#close")
    const moverImagen = dialog.querySelector("#mover")

    const imgDialog = dialog.querySelector("img")

    let dragMode;

    const cropper = new Cropper(imgDialog,{
        autoCrop:false,
        dragMode:dragMode,
        viewMode:1,
        movable:true
    })


    // Cerar el dialog
    close.addEventListener("click", () => dialog.close())

    //rotar la imagen
    rotar.addEventListener("click",()=>{
        cropper.rotate(90)
    })

    //recortar selecion que sale en el grooper
    recortar.addEventListener("click",()=>{
        cropper.setDragMode("crop")
        dragMode = "crop"
        confirmar.textContent = "Confirmar Recorte"
    })
    
    moverImagen.addEventListener("click", ()=>{
        cropper.setDragMode("move")
        dragMode = "mover"
    })

    //confirmar la imagen vista y si es la ultima imagen, crear el pddf
    confirmar.addEventListener("click", ()=>{

        if(dragMode === "crop"){
            confirmar.textContent = "Confirmar"
        }
        
        cargarSiguienteFoto(cropper,inputsConFotos,dialog)
    })
    
    //descartar la imagen que sale el crooper y pasar a la siguiente
    descartar.addEventListener("click",()=>{
        cargarSiguienteFoto(cropper,inputsConFotos,dialog,true)
    })

    //Cancela la accion de recortado del cropper
    cancelarRecortado.addEventListener("click",()=>{
        cropper.clear()
    })

}


//ACION
const pdf = document.querySelector(".form")

pdf.addEventListener("submit",(e) => {
    e.preventDefault()

    const hay = validar(inputs)
    if(hay)
    {
        return
    }

    const inputsConFotos = obtenerFotos(inputs)

    crearModal(inputsConFotos[0].fotosInput[0], inputsConFotos)

})




