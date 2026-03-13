import "./style.css"
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css"

import { PDFGenerator} from "./PDFGenerator.js"

const inputs = document.querySelectorAll('input[type="file"]')


const ordenSeleccion = []

inputs.forEach(input =>{
    input.addEventListener("change", () => {

        // eliminar fotos anteriores de ese input
        for(let i = ordenSeleccion.length - 1; i >= 0; i--)
        {
            if(ordenSeleccion[i].nameInput === input.name)
            {
                ordenSeleccion.splice(i,1)
            }
        }

        // agregar las nuevas en el orden que vienen
        for(let i = 0; i < input.files.length; i++)
        {
            ordenSeleccion.push({
                nameInput: input.name,
                file: input.files[i]
            })
        }

    })
})


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

        if(input.name === "cedula" || input.name === "circulacion")
        {
            const cantidad = input.files.length

            if(cantidad % 2 !== 0)
            {
                alert(`Las fotos de ${input.name} deben, en caso de ser más de una persona, tiene que ser pares el numero de fotos a ingresar (ejemplo: 2,4 .....`)
                return true
            }
        }   

        return false
    })

    return faltan
}

function obtenerFotos()
{
    const inputsConSusFotos = []

   ordenSeleccion.forEach(item =>{
        let grupo = inputsConSusFotos.find(x => x.nameInput === item.nameInput)

        if(!grupo)
        {
            grupo = {
                nameInput: item.nameInput,
                fotosInput:[]
            }

            inputsConSusFotos.push(grupo)
        }

        grupo.fotosInput.push(item.file);
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

/**
 * 
 * @param {Cropper} cropper 
 * @param {Array} inputsConFotos 
 * @param {HTMLDialogElement} dialog 
 * @param {Boolean} descartar 
 * @returns 
 */
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
        pdf.generarPDF(inputsConFotos)
        return
    }

    const nuevaFoto = generarImagenAMostrar(inputsConFotos[inputIndex].fotosInput[fotoIndex])
    cropper.replace(nuevaFoto)
    cropper.options.dragMode = "none"
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

    const inputsConFotos = obtenerFotos()

    crearModal(inputsConFotos[0].fotosInput[0], inputsConFotos)

})