import { PDFDocument } from "pdf-lib"
import { saveAs } from "file-saver"

class PDFGenerator{

    constructor(data)
    {
        data.forEach(element => {
                this[element.nameInput] = element.fotosInput
        });
    }


    /**
     * 
     * @param {*} pdfDoc 
     * @param {*} fotos 
     * @returns 
     */
    async paginaAdelanteAtras(pdfDoc,fotos){
        let contador = 0;

        if(fotos.length === 2)
        {
            const pagina = pdfDoc.addPage([612, 792])

            const bytes1 = await fotos[1].arrayBuffer()
            const bytes2 = await fotos[0].arrayBuffer()

            const img1 = await pdfDoc.embedJpg(bytes1)
            const img2 = await pdfDoc.embedJpg(bytes2)
            
            pagina.drawImage(img1,{
                x:6,
                y:391,
                width:600,
                height:390
            })

            pagina.drawImage(img2,{
                x:6,
                y:0,
                width:600,
                height:390
            })
            
        }
    }

    async paginaVertical(){

    }

    async paginaTripleHorizontal(){

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
    PDFGenerator
}