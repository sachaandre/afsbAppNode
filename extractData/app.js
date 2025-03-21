function filePicked(event){
    //Récupération du fichier
    var file = event.target.files[0];
    var fileType = file.type;

    console.log(fileType);

    //Tableau des formats de tableurs les plus utilisés (.csv, .ods, .xls, .xlsx)
    const acceptedTypes = ['text/csv','application/vnd.oasis.opendocument.spreadsheet','application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    function checkType(arr, val){ return arr.some((arrVal) => val === arrVal)}

    //Test du format / Validation de fichier
    if (checkType(acceptedTypes, fileType)){
        console.log(file)
        fileUploadMessageBlock.textContent = "Vous venez de téléverser un fichier au format " + fileType + ".";
        fileUploadMessageBlock.classList.add("success");

        readFile(file);
    } else {
        //message d'erreur
        fileUploadMessageBlock.textContent = "Le format du document téléversé n'est pas accepté. Merci de mettre un fichier parmis les formats suivants : .ods, .csv, .xls, .xlsx";
        fileUploadMessageBlock.classList.add("error");
    }
}

/*
*   readFile(pFile)
*   Récupère un fichier .ods/.xls/.csv et le lit avec SheetJS
*   reader est un objet FileReader() (https://developer.mozilla.org/en-US/docs/Web/API/FileReader)
*   L'utilitaire Sheet JS est ensuite utilisé pour lire le contenu du fichier
*/

function readFile(pFile){
    reader.addEventListener(
        "load",
        () => {
            console.log("Resultats");
            console.log(reader.result);
            fileArrayBuffer = reader.result;
            
            //Utilisation de SheetJS pour le décodage du fichier + l'extraction des données
            //https://docs.sheetjs.com
            var wb = XLSX.read(fileArrayBuffer);
            processFile(wb);
        },
        false
    )
    reader.readAsArrayBuffer(pFile);
    
}

/* À partir de cette partie, l'analyse du fichier est très contextuelle au besoin de l'application "AFSB Contrib Importer"
*  et du fichier à traiter.
*
*   Création d'un objet *globalData* qui servira ensuite à alimenter les blocs pour l'API Osuny
    Pour rendre l'outil plus global :
        - Besoin de pouvoir sélectionner quelles colonnes correspondent à :
            - Un titre d'article
            - La date de publication
            - L'auteur de la contribution
            - Le lieu rattaché à la publication
            - Le contenu de l'article
        - Le contenu Pour / Contre est contextuel à l'enquête publique
    
    Pour un MVP, les données de date, d'auteur et de lieu peuvent constituer un bloc chapitre, avec légère mise en avant, et constituer ainsi un bloc de "métadonnées"
    Se concentrer également avec un jeu de donné seulement présente dans la "Feuille 1"
*   
*
*/
function processFile(obj){
    var sheet = obj.Sheets[obj.SheetNames[0]];
    var nameRef = "B",
        locRef = "C",
        dateRef = "D",
        titleRef = "H",
        contentRef = "I",
        firstNum = 2,
        lastNum = 1570;


    console.log(sheet[nameRef.toString()+firstNum.toString()].v);

    for (let i = firstNum; i <= lastNum; i++) {
        globalData["contrib_" + i.toString()] = {
            name: sheet[nameRef.toString() + i.toString()] != null ? sheet[nameRef.toString() + i.toString()].v : "",
            loc: sheet[locRef.toString() + i.toString()] != null ? sheet[locRef.toString() + i.toString()].v : "",
            date: !!sheet[dateRef.toString() + i.toString()] ? sheet[dateRef.toString() + i.toString()].v : "",
            title: !!sheet[titleRef.toString() + i.toString()] ? sheet[titleRef.toString() + i.toString()].v : "",
            content: !!sheet[contentRef.toString() + i.toString()] ? sheet[contentRef.toString() + i.toString()].v : "",
            position : getAvis(i, sheet)
        }
        
    }
    console.log(globalData);
}

function getAvis(num, sheet){
    var pourRef = "E",
        contreRef = "F",
        autreRef = "G";
    
    if (sheet[pourRef.toString() + num.toString()] != null) {
        return "Pour";
    } else if (sheet[contreRef.toString() + num.toString()] != null) {
        return "Contre";
    } else if (sheet[autreRef.toString() + num.toString()] != null) {
        return "Autre";
    } else {
        return "";
    }
}

