import { PDFDocument,PDFPage,rgb } from "pdf-lib"
import { saveAs } from "file-saver"

const layouts = {

    //y
    cara_y_atras:{
        imagenArriba:{x:15, y:402,width:580, height:340},
        imagenAbajo:{x:15, y:50,width:580, height:340}
    },

    //y
    vertical:{
        x:56,
        y:16,
        width:500,
        height:760
    },

    //Y
    tripleHorizontal:{
        imagenArriba:{x:15, y:525, width:580,height:250},
        imagenMedio:{x:15, y:268, width:580, height:250},
        imagenAbajo:{x:15,y:11, width:580, height: 250}, 
    },


    
    matrizDosPorDos:{
        arribaIzquierda:{x:21, y:396, width:280, height:380},
        arribaDerecha:{x:306, y:396, width: 280, height:380},

        abajoIzquierda:{x:21, y:11, width:280, height: 380},
        abajoDerecha:{x:306, y:11, width:280, height: 380}
    },

    dosResagados:{
        arriba:{x:16, y:398,width:580,height:300},
        abajo:{x:16, y:90, width:580,height:300}
    },

    unResagado:{
        x:56,
        y:71,
        width:500,
        height:650
    }


}


class PDFGenerator{
    constructor()
    {
        data.forEach(element => {
                this[element.nameInput] = element.fotosInput
        });

        this.pageWidth = 612;
        this.pageHeight = 792;
    }
    

    /**
     * 
     * @param {Array} inputsConFotos 
     */
    async generarPDF(inputsConFotos)
    {
        const pdf = await PDFDocument.create()

        
            

        const pdfBytes = await pdf.save()

        const blob = new Blob([pdfBytes], { type: "application/pdf" })

        saveAs(blob, "documentos.pdf")

    }
}

export{
    PDFGenerator,
}