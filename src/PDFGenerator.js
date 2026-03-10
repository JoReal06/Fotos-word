import { PDFDocument } from "pdf-lib"
import { saveAs } from "file-saver"

export class PDFGenerator {

    constructor(data) {

        this.cedulas = data.cedulas
        this.matriNeg = data.matriNeg
        this.numRuc = data.numRuc
        this.circulacion = data.circulacion
        this.facturas = data.facturas
        this.interiorNeg = data.interiorNeg
        this.exterior = data.exterior

    }

    async fileToBytes(file) {
        return await file.arrayBuffer()
    }

    async embedImage(pdf, file) {

        const bytes = await this.fileToBytes(file)

        if (file.type.includes("png")) {
            return await pdf.embedPng(bytes)
        }

        return await pdf.embedJpg(bytes)

    }


    async generar() {

        const pdf = await PDFDocument.create()

        // tamaño A4
        const width = 595
        const height = 842

        // pageHeight - Y - height


        // Página 1 → Cedula

        const pageCedula = pdf.addPage([width, height])

        const img1 = await this.embedImage(pdf, this.cedulas[1])
        const img2 = await this.embedImage(pdf, this.cedulas[0])

        pageCedula.drawImage(img1, {
            x: 2,
            y: 432,
            width: 600,
            height: 400
        })

        pageCedula.drawImage(img2, {
            x: 2,
            y: 25,
            width: 600,
            height: 400
        })


        // // Página 2 → Matrícula

        if (this.matriNeg && this.matriNeg.length) {

            const page = pdf.addPage([width, height])

            const img = await this.embedImage(pdf, this.matriNeg[0])

            page.drawImage(img, {
                x: 80,
                y: 150,
                width: 420,
                height: 520
            })

        }


        // // Página 3 → RUC

        // if (this.numRuc && this.numRuc.length) {

        //     const page = pdf.addPage([width, height])

        //     const img = await this.embedImage(pdf, this.numRuc[0])

        //     page.drawImage(img, {
        //         x: 80,
        //         y: 150,
        //         width: 420,
        //         height: 520
        //     })

        // }


        // // Página 4 → Circulación

        // if (this.circulacion.length) {

        //     const page = pdf.addPage([width, height])

        //     const img1 = await this.embedImage(pdf, this.circulacion[0])
        //     const img2 = await this.embedImage(pdf, this.circulacion[1])

        //     page.drawImage(img1, {
        //         x: 40,
        //         y: 450,
        //         width: 520,
        //         height: 300
        //     })

        //     page.drawImage(img2, {
        //         x: 40,
        //         y: 120,
        //         width: 520,
        //         height: 300
        //     })

        // }


        // // Facturas (2x2 por página)

        // if (this.facturas.length) {

        //     for (let i = 0; i < this.facturas.length; i += 4) {

        //         const page = pdf.addPage([width, height])

        //         const posiciones = [

        //             { x: 40, y: 450 },
        //             { x: 300, y: 450 },
        //             { x: 40, y: 120 },
        //             { x: 300, y: 120 }

        //         ]

        //         for (let j = 0; j < 4; j++) {

        //             if (this.facturas[i + j]) {

        //                 const img = await this.embedImage(pdf, this.facturas[i + j])

        //                 page.drawImage(img, {

        //                     x: posiciones[j].x,
        //                     y: posiciones[j].y,
        //                     width: 250,
        //                     height: 350

        //                 })

        //             }

        //         }

        //     }

        // }

        // //Interior
        // if(this.interiorNeg.length)
        // {

        // }


        // // Última página → Exterior

        // if (this.exterior) {

        //     const page = pdf.addPage([width, height])

        //     const img = await this.embedImage(pdf, this.exterior)

        //     page.drawImage(img, {
        //         x: 80,
        //         y: 150,
        //         width: 420,
        //         height: 520
        //     })

        // }


        const pdfBytes = await pdf.save()

        const blob = new Blob([pdfBytes], { type: "application/pdf" })

        saveAs(blob, "documentos.pdf")

    }

}