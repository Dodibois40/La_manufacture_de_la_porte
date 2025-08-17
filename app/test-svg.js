const fs = require('fs');

const svg = fs.readFileSync('./public/12.svg', 'utf8');
console.log('Taille du fichier:', svg.length);
console.log('Première ligne:', svg.split('\n')[0]);
console.log('Contient des patterns:', svg.includes('<pattern'));
console.log('Contient des clipPath:', svg.includes('<clipPath'));
console.log('Contient des defs:', svg.includes('<defs'));

// Vérifier si c'est un SVG valide
const { DOMParser } = require('@xmldom/xmldom');
const parser = new DOMParser();
try {
  const doc = parser.parseFromString(svg, 'image/svg+xml');
  console.log('SVG parsé avec succès');
  console.log('Element racine:', doc.documentElement.tagName);
  console.log('Nombre d\'éléments text:', doc.getElementsByTagName('text').length);
  
  // Chercher les éléments avec des IDs spécifiques
  const tokens = ['OUVERTURE_L', 'CLOISON_E', 'CADRE_E', 'COUVRE_JOINT_L', 'COUVRE_JOINT_E', 'PORTE_L', 'PASSAGE_L'];
  const found = tokens.filter(id => doc.getElementById(id) !== null);
  console.log('Tokens trouvés:', found);
  
} catch (e) {
  console.error('Erreur parsing:', e.message);
}

