import { PDFDocument,PDFPage,rgb } from "pdf-lib"
import { saveAs } from "file-saver"

const layouts = {

    cara_y_atras:{
        imagenArriba:{x:5, y:430,width:602, height:340},
        imagenAbajo:{x:5, y:70,width:602, height:340}
    },

    vertical:{
        x:106,
        y:82,
        width:400,
        height:700
    }
     

}


async function dibujar(){

    const pdf = await PDFDocument.create();
    const page = pdf.addPage([612,792])

    page.drawRectangle({
        x:layouts.cara_y_atras.imagenArriba.x,
        y:layouts.cara_y_atras.imagenArriba.y,
        width:layouts.cara_y_atras.imagenArriba.width,
        height:layouts.cara_y_atras.imagenArriba.height,
        borderColor:rgb(1,0,0),
        borderWidth:2
    })

    page.drawRectangle({
        x:layouts.cara_y_atras.imagenAbajo.x,
        y:layouts.cara_y_atras.imagenAbajo.y,
        width:layouts.cara_y_atras.imagenAbajo.width,
        height:layouts.cara_y_atras.imagenAbajo.height,
        borderColor:rgb(1,0,0),
        borderWidth:2
    })

    const pdfBytes = await pdf.save()
    const blob = new Blob([pdfBytes], {type: "application/pdf"})
    saveAs(blob,"prueba.pdf")
}


class PDFGenerator{
    constructor()
    {
        // data.forEach(element => {
        //         this[element.nameInput] = element.fotosInput
        // });

        // this.pageWidth = 612;
        // this.pageHeight = 792;
        // this.margin = 15;
        // this.usableWidth = this.pageWidth - (this.margin * 2)
        // this.usableHeight = this.pageHeight - (this.margin * 2)
    }

    
    async generarPDF()
    {
        const pdf = await PDFDocument.create()

        await this.paginaAdelanteAtras(pdf,this.cedula)

        const pdfBytes = await pdf.save()

        const blob = new Blob([pdfBytes], { type: "application/pdf" })

        saveAs(blob, "documentos.pdf")

    }
}

export{
    PDFGenerator,
    dibujar
}