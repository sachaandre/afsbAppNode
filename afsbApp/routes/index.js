var express = require('express');
var router = express.Router();
const fetch = (...args) =>
	import('node-fetch').then(({default: fetch}) => fetch(...args));

const postOsunyPost = async (data) => {
  const url = "https://sachaandre.osuny.org/api/osuny/v1/communication/websites/"+ process.env.OSUNY_WEBSITE_ID +"/posts"
  try{
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Osuny-Token": process.env.OSUNY_API_KEY
      },
      body: JSON.stringify(data),
    })
    var resultat = await response.json();
    return resultat;
  } catch (error) {
    console.error("Erreur :", error);
  }
}

const getJSONData = async (data) => {
  try{
    const response = await fetch('http://localhost:3000/donnees.json', {method: 'get'})
    var res = await response.json();
    var resArr = Object.values(res);
    
    return resArr;

  } catch (error) {
    console.error("Erreur :", error);
  }
}


/**
 * 
 * @param {number} num Numéro de contribution 
 * @param {string} contentAvis Contenu de l'avis 
 * @param {string} locAvis Lieu de l'avis
 * @param {string} nomAvis Nom de l'auteur de l'avis
 * @param {string} positionAvis Pour/Contre/Autre
 * @param {string} titreAvis Titre donné par l'auteur sur la plateforme initiale
 * @param {string} dateAvis Date de publication de l'avis
 * @returns 
 */
function generateOsunyPost(num, contentAvis, locAvis, nomAvis, positionAvis, titreAvis, dateAvis){
    var nomMigChapter = "contribution-" + num.toString(),
        chapterBlocks = generateOsunyChapter(nomMigChapter, contentAvis, locAvis, nomAvis, positionAvis);
        utcDate = getDateFromString(dateAvis);

    var post = {
        "id": null,
        "migration_identifier": nomMigChapter,
        "full_width": false,
        "localizations": {
            "fr": {
                "id": null,
                "migration_identifier": nomMigChapter + "-fr",
                "title": titreAvis,
                "featured_image": {
                    "blob_id": null,
                    "alt": null,
                    "credit": null,
                    "url": null
                },
                "meta_description": null,
                "pinned": false,
                "published": true,
                "published_at": utcDate,
                "slug": nomMigChapter,
                "subtitle": null,
                "summary": null,
                "text": null,
                "blocks": chapterBlocks,
                "created_at": null,
                "updated_at": null
            }
        },
        "created_at": null,
        "updated_at": null
    }

    return post;
}

/**
 * generateOsunyChapter(): Créé un array de chapitres
 * 
 * 
 * @param {string} nomPost Nom du post Parent
 * @param {string} contentChapter Contenu du Chapitre
 * @param {string} locAvis Lieu de l'avis donné
 * @param {string} nomAvis Nom de l'auteur de l'avis
 * @param {string} positionAvis Position affichée de l'avis
 */
function generateOsunyChapter(nomPost, contentChapter, locAvis, nomAvis, positionAvis){
  var chapters = [
      {
          "id": null,
          "migration_identifier": nomPost + "-chapter-1",
          "template_kind": "chapter",
          "title": null,
          "position": 1,
          "published": true,
          "html_class": null,
          "data":{
              "layout": "no_background",
              "text": "<p>" + contentChapter + "</p>",
              "notes": "",
              "image": {
              "id": ""
              },
              "alt": "",
              "credit": ""
          }
      },
      {
          "id": null,
          "migration_identifier": nomPost + "-chapter-2",
          "template_kind": "chapter",
          "title": null,
          "position": 1,
          "published": true,
          "html_class": null,
          "data":{
              "layout": "alt_background",
              "text": "<p> Lieu : " + locAvis + ".</p><p> Avis écrit par " + nomAvis + ".</p><p> Avis " + positionAvis + ".</p>",
              "notes": "",
              "image": {
              "id": ""
              },
              "alt": "",
              "credit": ""
          }
      }
  ]
  return chapters;
}

function getDateFromString(stringDate){
  /**
   * très spécifique 
   */
  var d,
      subD,
      m,
      subM,
      y,
      subY,
      h,
      subH,
      min,
      subMin;

  subD = stringDate.substring(0,2);
  subM = stringDate.substring(3,5);
  subY = stringDate.substring(6,10);
  subH = stringDate.substring(11,13);
  subMin = stringDate.substring(14,16);

  d = Number(subD);
  m = Number(subM);
  y = Number(subY);
  h = Number(subH);
  min = Number(subMin);

  var returnDate = new Date(y, m, d, h, min)
  return returnDate;
}


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'AFSB Contrib to Osuny', retourAPI: null, post: null });
});

router.get('/send-test', async function(req, res, next) {
  var testData = generateOsunyPost(0, "Projet inutile et imposé, une vraie plaie", "Saint-Roustan", "Guilem Meurice", "Contre", "Un projet inutile", "15/07/2024 10h14");
  const data = await postOsunyPost(testData);
  res.render('index', {title: 'AFSB Contrib to Osuny', retourAPI: JSON.stringify(data), post: JSON.stringify(testData, null, 4)});
});

// router.get('/send-data-test', async function(req, res, next) {
//   var dataArr = getJSONData();
//   dataArr.then(async (data) => {
//     for (let index = 0; index < data.length; index++) {
//       console.log(data[index]);
//       var toPost = generateOsunyPost(index, data[index].content, data[index].loc, data[index].name, data[index].position, data[index].title, data[index].date)
//       const posted = await postOsunyPost(toPost);
//     }
//   })
//   res.render('index', { title: 'AFSB Contrib to Osuny', retourAPI: null, post: null });
// });

router.get('')

module.exports = router;
