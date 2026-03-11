import "./style.css"
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css"

import { PDFGenerator } from "./PDFGenerator.js"

const inputs = document.querySelectorAll('input[type="file"]')


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
    const inputsConFotos = []

    inputs.forEach((input) => {

        const fotosInput = []

        for(let i = 0; i < input.files.length; i++)
        {
            const file = input.files[i]
            const foto = URL.createObjectURL(file)
            fotosInput.push(foto)
        }

        if(fotosInput.length > 0)
        {
            inputsConFotos.push({
                nameInput: input.name,
                fotosInput: fotosInput
            })
        }
    })

    return inputsConFotos
}


function cargarSiguienteFoto(fotoIndex,inputIndex,cropper,inputsConFotos,dialog)
{
    if(fotoIndex < (inputsConFotos[inputIndex].fotosInput.length - 1)){
            fotoIndex++
    }
    else{
        inputIndex++
        fotoIndex = 0
    }

    if(inputIndex >= inputsConFotos.length){
        dialog.close()
        dialog.remove()
        const pdf = new PDFGenerator(inputsConFotos)

        return
    }

    const nuevaFoto = inputsConFotos[inputIndex].fotosInput[fotoIndex]

    cropper.replace(nuevaFoto)
}


function crearModal(primeraFoto, inputsConFotos){

    const dialog = document.createElement("dialog")
    dialog.classList.add("modal")
    const espacioTrabajo = document.createDocumentFragment()

    dialog.innerHTML = 
                
                `
                    <div class="menu">

                        <button id="rotar">rotar</button>
                        <button id="recortar">recortar</button>
                        <button id="confirmar">Confirmar</button>
                        <button id="descartar">Descartar</button>
                        <button id="cancelarRecortado">Cancelar Recortado</button>
                        <button id="close">
                            <span class="material-symbols-outlined">close</span>
                        </button>

                    </div>
                        <img src="${primeraFoto}">
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

    const imgDialog = dialog.querySelector("img")

    const cropper = new Cropper(imgDialog,{
        viewMode:1,
        aspectRatio:NaN,
    })

    let inputIndex = 0;
    let fotoIndex = 0;



    // Cerar el dialog
    close.addEventListener("click", () => dialog.close())

    //rotar la imagen
    rotar.addEventListener("click",()=>{
        cropper.rotate(90)
    })

    //recortar selecion que sale en el grooper
    recortar.addEventListener("click",()=>{
        const canvas = cropper.getCroppedCanvas()
        const recorte = canvas.toDataURL("image/png")
        cropper.replace(recorte)
    })
    

    //confirmar la imagen vista y si es la ultima imagen, crear el pddf
    confirmar.addEventListener("click", ()=>{
        const canvas = cropper.getCroppedCanvas()
        const imagenFinal = canvas.toDataURL("image/png")

        inputsConFotos[inputIndex].fotosInput[fotoIndex] = imagenFinal

        cargarSiguienteFoto(fotoIndex,inputIndex,cropper,inputsConFotos,dialog)
    })
    
    //descartar la imagen que sale el crooper y pasar a la siguiente
    descartar.addEventListener("click",()=>{
        cargarSiguienteFoto(fotoIndex,inputIndex,cropper,inputsConFotos,dialog)
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




