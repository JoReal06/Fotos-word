import { PDFDocument } from "pdf-lib"
import { saveAs } from "file-saver"

class PDFGenerator{

    constructor(data){

            data.forEach(element => {
                    this[element.nameInput] = element.fotosInput
            });

        }
}



export{
    PDFGenerator
}